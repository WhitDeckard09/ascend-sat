import type { Domain, Section } from '../data/types'
import { DOMAINS, DOMAIN_BY_ID, QUESTIONS_PER_LESSON } from '../data/types'
import { questionCounts } from '../data/bank'

/**
 * Turns the three onboarding answers into a concrete path of units and lessons.
 *
 * Two things drive the shape of a plan:
 *   1. Time available sets how many lessons there are — one a day, or two a day
 *      at the most intensive setting.
 *   2. The goal score sets which domains get the extra lessons: a student aiming
 *      at 1200 gains more from grammar and linear algebra, while one aiming at
 *      1500 needs Craft & Structure and Advanced Math, where the hardest
 *      questions live.
 */

export type Timeframe = '1-week' | '2-weeks' | '1-month' | '2-months' | '3-months'

export const TIMEFRAMES: { id: Timeframe; label: string; days: number }[] = [
  { id: '1-week', label: '1 week', days: 7 },
  { id: '2-weeks', label: '2 weeks', days: 14 },
  { id: '1-month', label: '1 month', days: 30 },
  { id: '2-months', label: '2 months', days: 60 },
  { id: '3-months', label: '3+ months', days: 90 },
]

export const DAILY_GOALS = [
  { minutes: 5, label: 'Casual', sub: '5 min / day' },
  { minutes: 10, label: 'Regular', sub: '10 min / day' },
  { minutes: 15, label: 'Serious', sub: '15 min / day' },
  { minutes: 20, label: 'Intense', sub: '20 min / day' },
]

/** 12 questions plus the recap runs a little over ten minutes in practice. */
export const MINUTES_PER_LESSON = 11
export const LESSONS_PER_UNIT = 5

/** Two lessons a day only at the most intensive setting; otherwise one. */
const lessonsPerDay = (dailyMinutes: number): number => (dailyMinutes >= 20 ? 2 : 1)

export interface PlanInput {
  name: string
  timeframe: Timeframe
  dailyMinutes: number
  goalScore: number
}

export type LessonKind = 'lesson' | 'review'

export interface PlannedLesson {
  id: string
  /** Domains this lesson draws from. A review pulls from the whole unit. */
  domains: Domain[]
  kind: LessonKind
  unitIndex: number
  indexInUnit: number
}

export interface PlannedUnit {
  index: number
  title: string
  subtitle: string
  section: Section
  color: string
  primaryDomain: Domain
  lessons: PlannedLesson[]
}

/** The path is split by section so a student can spend a day on one of them. */
export interface Plan {
  rw: PlannedUnit[]
  math: PlannedUnit[]
  totalLessons: number
  estimatedMinutes: number
  allocation: Partial<Record<Domain, number>>
  /** Lessons the timeframe asked for, before the bank's ceiling was applied. */
  requestedLessons: number
  /** True when the bank could not fill everything the timeframe asked for. */
  cappedByBank: boolean
}

export const trackUnits = (plan: Plan, section: Section): PlannedUnit[] =>
  section === 'rw' ? plan.rw : plan.math

export const trackLessons = (plan: Plan, section: Section): PlannedLesson[] =>
  trackUnits(plan, section).flatMap((u) => u.lessons)

/** How much each domain's share is nudged, based on where the goal sits. */
const goalEmphasis = (goal: number): Partial<Record<Domain, number>> => {
  if (goal >= 1450)
    return {
      'craft-structure': 1.3,
      'advanced-math': 1.3,
      'information-ideas': 1.1,
      'standard-english': 0.75,
      algebra: 0.8,
    }
  if (goal <= 1200)
    return {
      'standard-english': 1.4,
      algebra: 1.35,
      'problem-solving-data': 1.1,
      'craft-structure': 0.75,
      'advanced-math': 0.75,
    }
  return {}
}

/**
 * Lessons in a plan: one per day, or two a day at the most intensive setting.
 * Sizing by the minutes budget instead used to produce a 12-lesson plan for a
 * whole month, which is nowhere near a lesson a day.
 */
export const lessonCountFor = (timeframe: Timeframe, dailyMinutes: number): number => {
  const days = TIMEFRAMES.find((t) => t.id === timeframe)!.days
  return days * lessonsPerDay(dailyMinutes)
}

/**
 * Split one section's lesson budget across its four domains by blueprint weight,
 * adjusted by goal emphasis. Every domain gets at least one lesson, and
 * largest-remainder apportionment makes the counts sum exactly to the budget.
 *
 * The two sections are apportioned separately and get half the budget each,
 * because the real test weighs them equally. Doing it in one pass over all eight
 * domains let rounding drift the split — with 27 lessons every remainder fell to
 * Reading & Writing, producing 15/12.
 */
const allocateSection = (budget: number, section: Section, goal: number): Record<Domain, number> => {
  const emphasis = goalEmphasis(goal)
  const domains = DOMAINS.filter((d) => d.section === section)
  const alloc = {} as Record<Domain, number>
  for (const d of domains) alloc[d.id] = 1

  let remaining = budget - domains.length
  const weights = domains.map((d) => ({ id: d.id, w: d.weight * (emphasis[d.id] ?? 1) }))
  const totalW = weights.reduce((sum, x) => sum + x.w, 0)

  const exact = weights.map((x) => ({ id: x.id, v: (x.w / totalW) * Math.max(0, remaining) }))
  for (const e of exact) {
    const floor = Math.floor(e.v)
    alloc[e.id] += floor
    remaining -= floor
  }
  const byFraction = [...exact].sort((a, b) => (b.v % 1) - (a.v % 1))
  for (let i = 0; i < remaining; i++) alloc[byFraction[i % byFraction.length].id]++

  return alloc
}

/**
 * How many lessons one trail can fill without repeating a question.
 *
 * Computed against the real allocator rather than raw blueprint weights, because
 * a budget is apportioned with a one-lesson floor per domain and largest-
 * remainder rounding — neither of which follows the blueprint exactly.
 *
 * The one-lesson reserve per domain absorbs the drift from unit reviews, which
 * draw across every domain in their unit rather than from the single domain the
 * allocation charges them to.
 */
export const trailCapacity = (section: Section, goal: number): number => {
  const counts = questionCounts()
  const domains = DOMAINS.filter((d) => d.section === section)
  const fits = (budget: number): boolean => {
    // Emphasis shifts the split, so capacity has to be computed for the goal
    // actually in play — a 1600 target loads Craft and Advanced Math well above
    // their blueprint share.
    const alloc = allocateSection(budget, section, goal)
    return domains.every((d) => (alloc[d.id] + 1) * QUESTIONS_PER_LESSON <= counts[d.id])
  }
  let best = domains.length
  for (let b = domains.length; b <= 400; b++) {
    if (!fits(b)) break
    best = b
  }
  return best
}

/**
 * Largest plan the bank can fill without repeating a question. The two trails
 * cap independently, so a long plan can end up with more Math lessons than
 * Reading & Writing ones — extra practice rather than recycled questions.
 */
export const planCeiling = (goal: number): number =>
  trailCapacity('rw', goal) + trailCapacity('math', goal)

/** The section's domains, most-emphasised first. */
const sectionPool = (section: Section, goal: number): Domain[] => {
  const emphasis = goalEmphasis(goal)
  return DOMAINS.filter((d) => d.section === section)
    .map((d) => d.id)
    .sort((a, b) => (emphasis[b] ?? 1) - (emphasis[a] ?? 1))
}

/**
 * Emit `counts` lessons in rotation order, so a trail never runs eight grammar
 * lessons back to back. Domains with more allocated lessons simply keep coming
 * round after the smaller ones run out.
 */
const orderByRotation = (counts: Partial<Record<Domain, number>>, pool: Domain[]): Domain[] => {
  const left = { ...counts }
  const out: Domain[] = []
  let cursor = 0
  let remaining = pool.reduce((sum, d) => sum + (left[d] ?? 0), 0)

  while (remaining > 0) {
    for (let i = 0; i < pool.length; i++) {
      const cand = pool[(cursor + i) % pool.length]
      if ((left[cand] ?? 0) > 0) {
        out.push(cand)
        left[cand] = (left[cand] ?? 0) - 1
        remaining--
        cursor = (cursor + i + 1) % pool.length
        break
      }
    }
  }
  return out
}

/** Order one section's lessons for the initial plan. */
const sequenceSection = (alloc: Record<Domain, number>, section: Section, goal: number): Domain[] =>
  orderByRotation(alloc, sectionPool(section, goal))

/** Each track gets its own palette so the two trails feel distinct. Gold is
 *  deliberately absent — white banner text on #FFC800 is unreadable. */
const TRACK_COLORS: Record<Section, string[]> = {
  rw: ['macaw', 'beetle'],
  math: ['grass', 'fox'],
}

/** Chunk one section's sequence into units of five, the last being a review. */
const buildTrack = (sequence: Domain[], section: Section): PlannedUnit[] => {
  const units: PlannedUnit[] = []

  for (let start = 0; start < sequence.length; start += LESSONS_PER_UNIT) {
    const slice = sequence.slice(start, start + LESSONS_PER_UNIT)
    const unitIndex = units.length

    // The unit takes its identity from whichever domain appears most in it.
    const tally = new Map<Domain, number>()
    for (const d of slice) tally.set(d, (tally.get(d) ?? 0) + 1)
    const primaryDomain = [...tally.entries()].sort((a, b) => b[1] - a[1])[0][0]

    const lessons: PlannedLesson[] = slice.map((d, i) => ({
      id: `${section}-u${unitIndex}-l${i}`,
      domains: [d],
      kind: 'lesson' as LessonKind,
      unitIndex,
      indexInUnit: i,
    }))

    // Close every full unit with a review drawing on everything in it.
    if (lessons.length === LESSONS_PER_UNIT) {
      const last = lessons[lessons.length - 1]
      last.kind = 'review'
      last.domains = [...new Set(slice)]
    }

    units.push({
      index: unitIndex,
      title: `Unit ${unitIndex + 1}`,
      subtitle: DOMAIN_BY_ID[primaryDomain].label,
      section,
      color: TRACK_COLORS[section][unitIndex % TRACK_COLORS[section].length],
      primaryDomain,
      lessons,
    })
  }

  return units
}

export const buildPlan = (input: PlanInput): Plan => {
  const requestedLessons = lessonCountFor(input.timeframe, input.dailyMinutes)

  // The two sections are budgeted separately and equally, and each is capped at
  // what its own bank can serve without repeating a question.
  const budget: Record<Section, number> = {
    rw: Math.min(Math.ceil(requestedLessons / 2), trailCapacity('rw', input.goalScore)),
    math: Math.min(Math.floor(requestedLessons / 2), trailCapacity('math', input.goalScore)),
  }

  const rwAlloc = allocateSection(budget.rw, 'rw', input.goalScore)
  const mathAlloc = allocateSection(budget.math, 'math', input.goalScore)

  const rw = buildTrack(sequenceSection(rwAlloc, 'rw', input.goalScore), 'rw')
  const math = buildTrack(sequenceSection(mathAlloc, 'math', input.goalScore), 'math')
  const count = rw.concat(math).reduce((sum, u) => sum + u.lessons.length, 0)

  return {
    rw,
    math,
    totalLessons: count,
    estimatedMinutes: count * MINUTES_PER_LESSON,
    allocation: { ...rwAlloc, ...mathAlloc },
    requestedLessons,
    cappedByBank: count < requestedLessons,
  }
}

/** Questions a plan will serve in total. */
export const planQuestionCount = (plan: Plan): number => plan.totalLessons * QUESTIONS_PER_LESSON

/**
 * Pick which domains `count` extra lessons should cover.
 *
 * Rather than plain round-robin, each new lesson goes to whichever domain is
 * furthest below its blueprint share of the trail so far, which keeps a trail
 * proportionally correct however many times it is extended.
 */
const deficitAllocation = (
  existing: Domain[],
  pool: Domain[],
  count: number,
  goal: number,
): Partial<Record<Domain, number>> => {
  const emphasis = goalEmphasis(goal)
  const weight = (d: Domain) => DOMAIN_BY_ID[d].weight * (emphasis[d] ?? 1)
  const totalW = pool.reduce((sum, d) => sum + weight(d), 0)

  const have: Record<string, number> = {}
  for (const d of pool) have[d] = 0
  for (const d of existing) if (d in have) have[d]++

  const added: Partial<Record<Domain, number>> = {}
  let total = existing.length

  for (let i = 0; i < count; i++) {
    total++
    let best = pool[0]
    let bestDeficit = -Infinity
    for (const d of pool) {
      const deficit = (weight(d) / totalW) * total - have[d]
      if (deficit > bestDeficit) {
        bestDeficit = deficit
        best = d
      }
    }
    have[best]++
    added[best] = (added[best] ?? 0) + 1
  }
  return added
}

/**
 * Append lessons to one trail, filling any partial final unit before opening a
 * new one. A unit reaching five lessons gains a review as its last step, the
 * same rule the initial build follows.
 */
const extendTrack = (
  units: PlannedUnit[],
  section: Section,
  count: number,
  goal: number,
): PlannedUnit[] => {
  if (count <= 0) return units

  const pool = sectionPool(section, goal)
  const existing = units.flatMap((u) => u.lessons.flatMap((l) => l.domains))
  const additions = orderByRotation(deficitAllocation(existing, pool, count, goal), pool)

  // Clone so callers never see a half-mutated plan.
  const next: PlannedUnit[] = units.map((u) => ({ ...u, lessons: u.lessons.map((l) => ({ ...l })) }))

  for (const domain of additions) {
    let unit = next[next.length - 1]

    if (!unit || unit.lessons.length >= LESSONS_PER_UNIT) {
      const index = next.length
      unit = {
        index,
        title: `Unit ${index + 1}`,
        subtitle: DOMAIN_BY_ID[domain].label,
        section,
        color: TRACK_COLORS[section][index % TRACK_COLORS[section].length],
        primaryDomain: domain,
        lessons: [],
      }
      next.push(unit)
    }

    unit.lessons.push({
      id: `${section}-u${unit.index}-l${unit.lessons.length}`,
      domains: [domain],
      kind: 'lesson',
      unitIndex: unit.index,
      indexInUnit: unit.lessons.length,
    })

    if (unit.lessons.length === LESSONS_PER_UNIT) {
      const last = unit.lessons[LESSONS_PER_UNIT - 1]
      last.kind = 'review'
      last.domains = [...new Set(unit.lessons.flatMap((l) => l.domains))]
    }

    // Keep each unit labelled by whatever domain dominates it.
    const tally = new Map<Domain, number>()
    for (const l of unit.lessons)
      if (l.kind === 'lesson') tally.set(l.domains[0], (tally.get(l.domains[0]) ?? 0) + 1)
    if (tally.size) {
      const primary = [...tally.entries()].sort((a, b) => b[1] - a[1])[0][0]
      unit.primaryDomain = primary
      unit.subtitle = DOMAIN_BY_ID[primary].label
    }
  }

  return next
}

/** Hard ceiling on plan size, however many times a plan is extended. */
export const MAX_PLAN_LESSONS = 250

/** Add lessons to either trail. Returns a new plan; the input is untouched. */
export const extendPlan = (plan: Plan, add: { rw: number; math: number }, goal: number): Plan => {
  const room = Math.max(0, MAX_PLAN_LESSONS - plan.totalLessons)
  const rwAdd = Math.max(0, Math.min(add.rw, room))
  const mathAdd = Math.max(0, Math.min(add.math, room - rwAdd))

  const rw = extendTrack(plan.rw, 'rw', rwAdd, goal)
  const math = extendTrack(plan.math, 'math', mathAdd, goal)
  const count = rw.concat(math).reduce((sum, u) => sum + u.lessons.length, 0)

  return { ...plan, rw, math, totalLessons: count, estimatedMinutes: count * MINUTES_PER_LESSON }
}
