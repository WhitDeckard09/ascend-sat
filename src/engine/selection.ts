import type { Difficulty, Domain, Question } from '../data/types'
import { QUESTIONS_PER_LESSON } from '../data/types'
import { byDomainDifficulty } from '../data/bank'

/**
 * Picks the questions for half a lesson.
 *
 * Two constraints shape this beyond "pick at the right difficulty":
 *  - The bank is 38% student-produced response on the math side, but the real
 *    test is about 25%, so SPR is capped per half-module.
 *  - Questions already seen are avoided until the relevant pool runs dry, at
 *    which point the least-recently-seen come back.
 */

export const HALF_MODULE = QUESTIONS_PER_LESSON / 2
export { QUESTIONS_PER_LESSON }

/** Difficulty mix for each tier. Tier 2 is the broad mix the real Module 1 uses. */
const MIX: Record<Difficulty, Difficulty[]> = {
  1: [1, 1, 1, 1, 2, 2],
  2: [1, 1, 2, 2, 3, 3],
  3: [2, 2, 3, 3, 3, 3],
}

/** At most this share of a math half-module may be grid-ins. */
const MAX_SPR_PER_HALF = 2

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export interface SelectionContext {
  /** Question ids already answered, most recent last. */
  seen: string[]
}

export const selectHalf = (
  domains: Domain[],
  tier: Difficulty,
  ctx: SelectionContext,
  exclude: Set<string>,
): Question[] => {
  const seenRank = new Map(ctx.seen.map((id, i) => [id, i]))
  const picked: Question[] = []
  const used = new Set(exclude)
  let sprCount = 0

  const pattern = MIX[tier]

  for (let slot = 0; slot < HALF_MODULE; slot++) {
    const domain = domains[slot % domains.length]
    const wanted = pattern[slot]

    // Difficulties to try, nearest first, so a thin pool degrades to an adjacent
    // band rather than failing.
    const ladder: Difficulty[] = wanted === 1 ? [1, 2, 3] : wanted === 3 ? [3, 2, 1] : [2, 1, 3]

    const draw = (pool: Question[]): Question | undefined => {
      if (!pool.length) return undefined
      const allowed = sprCount >= MAX_SPR_PER_HALF ? pool.filter((q) => q.type !== 'spr') : pool
      return shuffle(allowed.length ? allowed : pool)[0]
    }

    let choice: Question | undefined

    // Pass one: an unseen question. Exhaust every difficulty and both domain
    // preferences before settling for a repeat — taking an unseen question one
    // band away is far better practice than re-serving a seen one at the exact
    // difficulty, and skipping this pass burned through the hard questions long
    // before the rest of the bank had been touched.
    for (const d of ladder) {
      for (const pools of [[domain], domains]) {
        const pool = pools
          .flatMap((dom) => byDomainDifficulty(dom, d))
          .filter((q) => !used.has(q.id) && !seenRank.has(q.id))
        choice = draw(pool)
        if (choice) break
      }
      if (choice) break
    }

    // Pass two: everything in reach has been seen, so take whichever was seen
    // longest ago, still preferring the intended difficulty.
    if (!choice) {
      for (const d of ladder) {
        const pool = domains
          .flatMap((dom) => byDomainDifficulty(dom, d))
          .filter((q) => !used.has(q.id))
        if (!pool.length) continue
        const allowed = sprCount >= MAX_SPR_PER_HALF ? pool.filter((q) => q.type !== 'spr') : pool
        const from = allowed.length ? allowed : pool
        choice = [...from].sort((a, b) => (seenRank.get(a.id) ?? -1) - (seenRank.get(b.id) ?? -1))[0]
        break
      }
    }

    if (!choice) continue
    used.add(choice.id)
    if (choice.type === 'spr') sprCount++
    picked.push(choice)
  }

  return picked
}

/**
 * The routing decision between the two halves — the mechanic the digital SAT is
 * built on. Do well on the first half and the second gets harder; struggle and
 * it gets easier.
 */
export const ROUTE_UP_THRESHOLD = 4

export const routeTier = (startTier: Difficulty, correctInFirstHalf: number): {
  tier: Difficulty
  direction: 'up' | 'down'
} => {
  const up = correctInFirstHalf >= ROUTE_UP_THRESHOLD
  const raw = up ? startTier + 1 : startTier - 1
  const tier = Math.max(1, Math.min(3, raw)) as Difficulty
  return { tier, direction: up ? 'up' : 'down' }
}
