import { useSyncExternalStore } from 'react'
import type { Domain, Section } from '../data/types'
import { DOMAINS } from '../data/types'
import type { Plan, PlanInput, Timeframe } from '../engine/planner'
import { buildPlan, extendPlan } from '../engine/planner'
import type { Ratings } from '../engine/rating'
import { seedRatings } from '../engine/rating'
import { advanceStreak, localDay } from '../engine/streak'

export { localDay }

const STORAGE_KEY = 'ascend-sat-v1'

export const MAX_HEARTS = 5
export const HEART_REFILL_MS = 30 * 60 * 1000

/** How long one committed lesson took, so pace can be compared over time. */
export interface LessonTime {
  lessonId: string
  /** Time on questions, in ms. Reading the explanations is not counted. */
  ms: number
  questions: number
  at: number
}

export interface MissedRecord {
  questionId: string
  response: number | string | null
  lessonId: string
  at: number
}

export interface Profile {
  name: string
  goalScore: number
  timeframe: Timeframe
  dailyMinutes: number
  createdAt: string
}

export interface AppState {
  profile: Profile | null
  plan: Plan | null
  ratings: Ratings
  answeredByDomain: Partial<Record<Domain, number>>
  seen: string[]
  missed: MissedRecord[]
  completedLessons: string[]
  /** Newest first. Written by `commitLesson`, read by the recap. */
  lessonTimes: LessonTime[]
  xp: number
  streak: number
  bestStreak: number
  lastActiveDay: string | null
  daysActive: string[]
  hearts: number
  heartsUpdatedAt: number
  freezes: number
  unlimitedHearts: boolean
  soundOn: boolean
  /** Which trail the Learn tab is showing. Persisted so it survives a reload. */
  activeTrack: Section
}

const emptyState = (): AppState => ({
  profile: null,
  plan: null,
  ratings: seedRatings(1300),
  answeredByDomain: {},
  seen: [],
  missed: [],
  completedLessons: [],
  lessonTimes: [],
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastActiveDay: null,
  daysActive: [],
  hearts: MAX_HEARTS,
  heartsUpdatedAt: Date.now(),
  freezes: 0,
  unlimitedHearts: false,
  soundOn: true,
  activeTrack: 'rw',
})

// ------------------------------------------------------------------- the store

let state: AppState = emptyState()
const listeners = new Set<() => void>()

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private browsing or a full quota. The session still works in memory.
  }
}

const set = (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => {
  const next = typeof patch === 'function' ? patch(state) : patch
  state = { ...state, ...next }
  persist()
  listeners.forEach((l) => l())
}

export const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as Partial<AppState>
    // Merge over defaults so a state saved by an older build still loads.
    state = { ...emptyState(), ...parsed }
    // Guard against a corrupted ratings object.
    if (!state.ratings || DOMAINS.some((d) => typeof state.ratings[d.id] !== 'number')) {
      state.ratings = seedRatings(state.profile?.goalScore ?? 1300)
    }
    // A plan saved before the path was split by section has a single `units`
    // list. Rebuild it from the stored profile. Lesson ids change, so path
    // position is lost, but ratings, XP, streak and misses all carry over.
    if (state.plan && !Array.isArray((state.plan as Partial<Plan>).rw)) {
      if (state.profile) {
        state.plan = buildPlan({
          name: state.profile.name,
          timeframe: state.profile.timeframe,
          dailyMinutes: state.profile.dailyMinutes,
          goalScore: state.profile.goalScore,
        })
        state.completedLessons = []
      } else {
        state.plan = null
      }
      // Write the migrated shape back so this only ever runs once.
      persist()
    }
  } catch {
    state = emptyState()
  }
}

export const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const getState = () => state

export const useStore = <T,>(selector: (s: AppState) => T): T =>
  useSyncExternalStore(subscribe, () => selector(state), () => selector(state))

export const useApp = (): AppState => useSyncExternalStore(subscribe, getState, getState)

// ---------------------------------------------------------------------- hearts

/** Hearts regenerate on a timer, so the live count is derived, not stored. */
export const currentHearts = (s: AppState = state): number => {
  if (s.unlimitedHearts) return MAX_HEARTS
  if (s.hearts >= MAX_HEARTS) return MAX_HEARTS
  const earned = Math.floor((Date.now() - s.heartsUpdatedAt) / HEART_REFILL_MS)
  return Math.min(MAX_HEARTS, s.hearts + earned)
}

export const msUntilNextHeart = (s: AppState = state): number => {
  if (s.unlimitedHearts || currentHearts(s) >= MAX_HEARTS) return 0
  const elapsed = (Date.now() - s.heartsUpdatedAt) % HEART_REFILL_MS
  return HEART_REFILL_MS - elapsed
}

const syncHearts = () => {
  const live = currentHearts()
  if (live !== state.hearts) {
    state = { ...state, hearts: live, heartsUpdatedAt: live >= MAX_HEARTS ? Date.now() : state.heartsUpdatedAt }
  }
}

export const loseHeart = () => {
  if (state.unlimitedHearts) return
  syncHearts()
  const wasFull = state.hearts >= MAX_HEARTS
  set({
    hearts: Math.max(0, state.hearts - 1),
    // The refill clock starts the moment you drop below full.
    heartsUpdatedAt: wasFull ? Date.now() : state.heartsUpdatedAt,
  })
}

export const refillHearts = () => set({ hearts: MAX_HEARTS, heartsUpdatedAt: Date.now() })

export const setUnlimitedHearts = (on: boolean) =>
  set({ unlimitedHearts: on, ...(on ? {} : { hearts: MAX_HEARTS, heartsUpdatedAt: Date.now() }) })

export const setSound = (on: boolean) => set({ soundOn: on })

export const setTrack = (activeTrack: Section) => set({ activeTrack })

/** Append lessons to either trail. Returns how many were actually added, which
 *  can be fewer than asked if the plan is near its ceiling. */
export const addLessons = (add: { rw: number; math: number }): number => {
  const s = state
  if (!s.plan || !s.profile) return 0
  const before = s.plan.totalLessons
  const plan = extendPlan(s.plan, add, s.profile.goalScore)
  set({ plan })
  return plan.totalLessons - before
}

// ------------------------------------------------------------------- mutations

export const startPlan = (input: PlanInput) => {
  const plan = buildPlan(input)
  set({
    ...emptyState(),
    profile: {
      name: input.name.trim(),
      goalScore: input.goalScore,
      timeframe: input.timeframe,
      dailyMinutes: input.dailyMinutes,
      createdAt: new Date().toISOString(),
    },
    plan,
    ratings: seedRatings(input.goalScore),
  })
}

export interface LessonResult {
  lessonId: string
  /** One entry per question, in the order they were answered. */
  answers: {
    questionId: string
    domain: Domain
    difficulty: 1 | 2 | 3
    correct: boolean
    response: number | string | null
    /** Time this question was on screen, in ms. */
    ms: number
  }[]
  ratingsAfter: Ratings
  xpEarned: number
  /** Sum of the per-question times — the lesson's pace, not its wall clock. */
  durationMs: number
}

export const commitLesson = (result: LessonResult) => {
  set((s) => {
    const answeredByDomain = { ...s.answeredByDomain }
    for (const a of result.answers) answeredByDomain[a.domain] = (answeredByDomain[a.domain] ?? 0) + 1

    const newMissed: MissedRecord[] = result.answers
      .filter((a) => !a.correct)
      .map((a) => ({
        questionId: a.questionId,
        response: a.response,
        lessonId: result.lessonId,
        at: Date.now(),
      }))

    // Only the streak fields, never the whole object. `advanceStreak` returns
    // its argument unchanged when today has already counted, and `s` here is the
    // entire AppState — spreading that back over this patch silently reverted
    // every second lesson of the day.
    const { streak, bestStreak, freezes, lastActiveDay, daysActive } = advanceStreak(s)

    // Keep the seen list bounded; it only exists to avoid repeats.
    const seen = [...s.seen.filter((id) => !result.answers.some((a) => a.questionId === id)),
      ...result.answers.map((a) => a.questionId)].slice(-600)

    return {
      ratings: result.ratingsAfter,
      answeredByDomain,
      seen,
      missed: [...newMissed, ...s.missed].slice(0, 200),
      completedLessons: s.completedLessons.includes(result.lessonId)
        ? s.completedLessons
        : [...s.completedLessons, result.lessonId],
      lessonTimes: [
        {
          lessonId: result.lessonId,
          ms: result.durationMs,
          questions: result.answers.length,
          at: Date.now(),
        },
        ...s.lessonTimes,
      ].slice(0, 200),
      xp: s.xp + result.xpEarned,
      streak,
      bestStreak,
      freezes,
      lastActiveDay,
      daysActive,
    }
  })
}

export const clearMissed = (questionId: string) =>
  set((s) => ({ missed: s.missed.filter((m) => m.questionId !== questionId) }))

export const resetEverything = () => {
  state = emptyState()
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* nothing to clean up */
  }
  listeners.forEach((l) => l())
}
