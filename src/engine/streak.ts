/**
 * Streak bookkeeping, kept pure so it can be tested without a browser.
 *
 * A streak counts consecutive days with at least one completed lesson. Missing a
 * single day is forgiven if a freeze is available, and a freeze is earned every
 * fifth day. Everything is computed in local time — a streak should break at the
 * user's midnight, not UTC's.
 */

export const MAX_FREEZES = 2
const FREEZE_EVERY = 5

export const localDay = (d: Date = new Date()): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Whole days from `a` to `b`, both 'YYYY-MM-DD'. Uses UTC math on date-only
 *  values so daylight-saving shifts can't produce a 23- or 25-hour "day". */
export const dayDiff = (a: string, b: string): number => {
  const toUTC = (s: string) => {
    const [y, m, d] = s.split('-').map(Number)
    return Date.UTC(y, m - 1, d)
  }
  return Math.round((toUTC(b) - toUTC(a)) / 86_400_000)
}

export interface StreakState {
  streak: number
  bestStreak: number
  freezes: number
  lastActiveDay: string | null
  daysActive: string[]
}

/** Apply one day's activity. Returns the unchanged state if today already counted. */
export const advanceStreak = (s: StreakState, today: string = localDay()): StreakState => {
  if (s.lastActiveDay === today) return s

  const gap = s.lastActiveDay ? dayDiff(s.lastActiveDay, today) : null
  let streak: number
  let freezes = s.freezes

  if (gap === 1) {
    streak = s.streak + 1
  } else if (gap === 2 && freezes > 0) {
    // Exactly one missed day, and a freeze to cover it.
    freezes -= 1
    streak = s.streak + 1
  } else {
    streak = 1
  }

  if (streak % FREEZE_EVERY === 0) freezes = Math.min(MAX_FREEZES, freezes + 1)

  return {
    streak,
    bestStreak: Math.max(s.bestStreak, streak),
    freezes,
    lastActiveDay: today,
    daysActive: s.daysActive.includes(today) ? s.daysActive : [...s.daysActive, today],
  }
}
