import type { Domain, Section } from '../data/types'
import { DOMAINS, DOMAIN_BY_ID } from '../data/types'

/**
 * Turns the three onboarding answers into a concrete path of units and lessons.
 *
 * Two things drive the shape of a plan:
 *   1. Available time sets how many lessons there are.
 *   2. The goal score sets which domains get the extra lessons — a student
 *      aiming at 1200 gains more from grammar and linear algebra, while one
 *      aiming at 1500 needs Craft & Structure and Advanced Math, where the
 *      hardest questions live.
 */

export type Timeframe = '1-week' | '2-weeks' | '1-month' | '2-months' | '3-months'

export const TIMEFRAMES: { id: Timeframe; label: string; weeks: number }[] = [
  { id: '1-week', label: '1 week', weeks: 1 },
  { id: '2-weeks', label: '2 weeks', weeks: 2 },
  { id: '1-month', label: '1 month', weeks: 4 },
  { id: '2-months', label: '2 months', weeks: 9 },
  { id: '3-months', label: '3+ months', weeks: 13 },
]

export const DAILY_GOALS = [
  { minutes: 5, label: 'Casual', sub: '5 min / day' },
  { minutes: 10, label: 'Regular', sub: '10 min / day' },
  { minutes: 15, label: 'Serious', sub: '15 min / day' },
  { minutes: 20, label: 'Intense', sub: '20 min / day' },
]

/** 12 questions plus the recap runs a little over ten minutes in practice. */
export const MINUTES_PER_LESSON = 11
const ACTIVE_DAYS_PER_WEEK = 5
export const LESSONS_PER_UNIT = 5

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

export const lessonCountFor = (timeframe: Timeframe, dailyMinutes: number): number => {
  const weeks = TIMEFRAMES.find((t) => t.id === timeframe)!.weeks
  const totalMinutes = weeks * ACTIVE_DAYS_PER_WEEK * dailyMinutes
  const raw = Math.round(totalMinutes / MINUTES_PER_LESSON)
  return Math.max(12, Math.min(90, raw))
}

/**
 * Split the lesson budget across the eight domains.
 *
 * The two sections are apportioned separately and get half the lessons each,
 * because the real test weighs them equally. Doing it in one pass over all eight
 * domains lets rounding drift the split — with 27 lessons every remainder
 * happened to fall to Reading & Writing, giving 15/12. Goal emphasis still
 * applies, but within a section rather than across the whole plan.
 */
const allocate = (totalLessons: number, goal: number): Record<Domain, number> => {
  const emphasis = goalEmphasis(goal)
  const alloc = {} as Record<Domain, number>

  const perSection: Record<Section, number> = {
    rw: Math.ceil(totalLessons / 2),
    math: Math.floor(totalLessons / 2),
  }

  for (const section of ['rw', 'math'] as Section[]) {
    const domains = DOMAINS.filter((d) => d.section === section)
    for (const d of domains) alloc[d.id] = 1 // every domain gets at least one

    let remaining = perSection[section] - domains.length
    const weights = domains.map((d) => ({ id: d.id, w: d.weight * (emphasis[d.id] ?? 1) }))
    const totalW = weights.reduce((sum, x) => sum + x.w, 0)

    // Largest-remainder apportionment so the counts sum exactly to the budget.
    const exact = weights.map((x) => ({ id: x.id, v: (x.w / totalW) * Math.max(0, remaining) }))
    for (const e of exact) {
      const floor = Math.floor(e.v)
      alloc[e.id] += floor
      remaining -= floor
    }
    const byFraction = [...exact].sort((a, b) => (b.v % 1) - (a.v % 1))
    for (let i = 0; i < remaining; i++) alloc[byFraction[i % byFraction.length].id]++
  }

  return alloc
}

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
const sequenceSection = (
  alloc: Record<Domain, number>,
  section: Section,
  goal: number,
): Domain[] => {
  const pool = sectionPool(section, goal)
  const counts: Partial<Record<Domain, number>> = {}
  for (const d of pool) counts[d] = alloc[d]
  return orderByRotation(counts, pool)
}

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
    const meta = DOMAIN_BY_ID[primaryDomain]

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
      subtitle: meta.label,
      section,
      color: TRACK_COLORS[section][unitIndex % TRACK_COLORS[section].length],
      primaryDomain,
      lessons,
    })
  }

  return units
}

export const buildPlan = (input: PlanInput): Plan => {
  const totalLessons = lessonCountFor(input.timeframe, input.dailyMinutes)
  const allocation = allocate(totalLessons, input.goalScore)

  // The split changes where lessons live, not how many there are.
  const rw = buildTrack(sequenceSection(allocation, 'rw', input.goalScore), 'rw')
  const math = buildTrack(sequenceSection(allocation, 'math', input.goalScore), 'math')
  const count = rw.concat(math).reduce((sum, u) => sum + u.lessons.length, 0)

  return {
    rw,
    math,
    totalLessons: count,
    estimatedMinutes: count * MINUTES_PER_LESSON,
    allocation,
  }
}

/**
 * Pick which domains `count` extra lessons should cover.
 *
 * Rather than plain round-robin, each new lesson goes to whichever domain is
 * furthest below its blueprint share of the trail so far. That keeps a trail
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
 * Append lessons to one trail, filling any partial final unit before starting a
 * new one. A unit that reaches five lessons gains a review as its last step,
 * matching how the initial plan is built.
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
    for (const l of unit.lessons) if (l.kind === 'lesson') tally.set(l.domains[0], (tally.get(l.domains[0]) ?? 0) + 1)
    if (tally.size) {
      const primary = [...tally.entries()].sort((a, b) => b[1] - a[1])[0][0]
      unit.primaryDomain = primary
      unit.subtitle = DOMAIN_BY_ID[primary].label
    }
  }

  return next
}

/** Largest number of lessons a plan may hold, however often it is extended. */
export const MAX_PLAN_LESSONS = 250

/** Add lessons to either trail. Returns a new plan; the input is untouched. */
export const extendPlan = (
  plan: Plan,
  add: { rw: number; math: number },
  goal: number,
): Plan => {
  const room = Math.max(0, MAX_PLAN_LESSONS - plan.totalLessons)
  const rwAdd = Math.max(0, Math.min(add.rw, room))
  const mathAdd = Math.max(0, Math.min(add.math, room - rwAdd))

  const rw = extendTrack(plan.rw, 'rw', rwAdd, goal)
  const math = extendTrack(plan.math, 'math', mathAdd, goal)
  const count = rw.concat(math).reduce((sum, u) => sum + u.lessons.length, 0)

  return { ...plan, rw, math, totalLessons: count, estimatedMinutes: count * MINUTES_PER_LESSON }
}
