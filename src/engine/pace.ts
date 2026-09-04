import type { Section } from '../data/types'

/**
 * The lesson clock.
 *
 * It runs in the background — nothing is rendered while you work — and surfaces
 * only on the recap, where the number finally means something.
 *
 * What it measures is time spent *on questions*: the clock runs while a question
 * is on screen and stops the instant you hit Check, so reading an explanation is
 * never charged to your pace. It also stops while the tab is hidden, because a
 * lesson left open on a locked phone would otherwise report eight hours.
 */

/**
 * Seconds per question the real digital SAT allows. Reading & Writing gives 64
 * minutes for 54 questions across its two modules; Math gives 70 for 44. Math
 * is the more generous of the two by about 24 seconds a question.
 */
export const SECONDS_PER_QUESTION: Record<Section, number> = {
  rw: (64 * 60) / 54,
  math: (70 * 60) / 44,
}

/** What the real test would allow for this exact set of questions. */
export const budgetMs = (sections: Section[]): number =>
  sections.reduce((ms, s) => ms + SECONDS_PER_QUESTION[s] * 1000, 0)

const seconds = (ms: number): number =>
  Math.max(0, Math.round((Number.isFinite(ms) ? ms : 0) / 1000))

/** `m:ss`, widening to `h:mm:ss` only if a session ever runs past an hour. */
export const formatDuration = (ms: number): string => {
  const total = seconds(ms)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  return `${h > 0 ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`
}

/** A per-question average, which is usually under a minute and reads better as
 *  plain seconds than as `0:48`. */
export const formatPace = (ms: number): string => {
  const s = seconds(ms)
  return s < 60 ? `${s}s` : formatDuration(s * 1000)
}

export interface PaceVerdict {
  label: 'ahead' | 'on' | 'over'
  /** Milliseconds of budget left over. Negative means the clock beat you. */
  spareMs: number
}

/**
 * The accumulator behind the lesson clock. Kept out of the component so the
 * awkward parts — pausing, resuming, and never double-counting a running
 * segment — can be tested against a fake clock instead of a real one.
 *
 * `hidden` is consulted at every start: a lesson left open on a locked phone
 * banks the time up to the moment it was backgrounded and nothing after.
 */
export interface LessonClock {
  /** Begin timing, unless already running or the page is hidden. */
  start(): void
  /** Bank the running segment. Safe to call when already stopped. */
  stop(): void
  /** Stop, then hand back everything banked and reset for the next question. */
  take(): number
}

export const makeLessonClock = (
  now: () => number = Date.now,
  hidden: () => boolean = () => typeof document !== 'undefined' && document.hidden,
): LessonClock => {
  let banked = 0
  let since: number | null = null

  const start = () => {
    if (since === null && !hidden()) since = now()
  }
  const stop = () => {
    if (since === null) return
    banked += Math.max(0, now() - since)
    since = null
  }
  const take = () => {
    stop()
    const ms = banked
    banked = 0
    return ms
  }

  return { start, stop, take }
}

/**
 * How a lesson compares to the real test's clock. Anything inside a 10% band
 * counts as on pace — the useful signal is the ballpark, not a stopwatch duel,
 * and a student who is 20 seconds off over twelve questions is fine.
 */
export const comparePace = (elapsedMs: number, budget: number): PaceVerdict => {
  const spareMs = budget - elapsedMs
  const band = budget * 0.1
  return { label: spareMs > band ? 'ahead' : spareMs < -band ? 'over' : 'on', spareMs }
}
