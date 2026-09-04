import type { Difficulty, Domain, Question } from '../data/types'
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

export const HALF_MODULE = 6
export const QUESTIONS_PER_LESSON = HALF_MODULE * 2

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

    // Try the exact difficulty first, then adjacent bands, so a thin pool in one
    // domain degrades gracefully instead of failing.
    const ladder: Difficulty[] = wanted === 1 ? [1, 2, 3] : wanted === 3 ? [3, 2, 1] : [2, 1, 3]

    let choice: Question | undefined
    for (const d of ladder) {
      // Widen across all this lesson's domains if one domain is exhausted.
      const pool = domains
        .flatMap((dom) => byDomainDifficulty(dom, d))
        .filter((q) => !used.has(q.id))
      if (!pool.length) continue

      const sprBlocked = sprCount >= MAX_SPR_PER_HALF
      const allowed = sprBlocked ? pool.filter((q) => q.type !== 'spr') : pool
      const finalPool = allowed.length ? allowed : pool

      // Prefer this slot's own domain when it has anything left.
      const onDomain = finalPool.filter((q) => q.domain === domain)
      const candidates = onDomain.length ? onDomain : finalPool

      const unseen = candidates.filter((q) => !seenRank.has(q.id))
      if (unseen.length) {
        choice = shuffle(unseen)[0]
      } else {
        // Everything has been seen: take whatever was seen longest ago.
        choice = [...candidates].sort(
          (a, b) => (seenRank.get(a.id) ?? -1) - (seenRank.get(b.id) ?? -1),
        )[0]
      }
      if (choice) break
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
