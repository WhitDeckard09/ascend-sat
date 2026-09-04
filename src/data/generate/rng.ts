/**
 * A small seeded PRNG (mulberry32).
 *
 * Generated questions must have stable ids and stable content across builds:
 * the app persists which question ids a student has seen, so a bank that
 * reshuffled itself on every build would silently break repeat-avoidance.
 */
export interface Rng {
  int: (min: number, max: number) => number
  pick: <T>(items: readonly T[]) => T
  shuffle: <T>(items: readonly T[]) => T[]
  /** A non-zero integer in [-max, -min] ∪ [min, max]. */
  signed: (min: number, max: number) => number
}

export const makeRng = (seed: number): Rng => {
  let a = seed >>> 0
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1))
  return {
    int,
    pick: <T,>(items: readonly T[]) => items[int(0, items.length - 1)],
    shuffle: <T,>(items: readonly T[]) => {
      const out = [...items]
      for (let i = out.length - 1; i > 0; i--) {
        const j = int(0, i)
        ;[out[i], out[j]] = [out[j], out[i]]
      }
      return out
    },
    signed: (min: number, max: number) => (next() < 0.5 ? -1 : 1) * int(min, max),
  }
}

/**
 * Format a number for display: no trailing ".0", and a typographic minus so
 * generated questions match the hand-written bank. Accepted answers keep the
 * ASCII hyphen — grading normalises both.
 */
export const num = (n: number): string => {
  const raw = Number.isInteger(n) ? String(n) : String(Number(n.toFixed(4)))
  return raw.replace('-', '−')
}

/** Signed term for building expressions, e.g. "− 3" or "+ 5". */
export const signed = (n: number): string => (n < 0 ? `− ${num(Math.abs(n))}` : `+ ${num(n)}`)

/** "3x", "−x", "x" — a coefficient attached to a variable. */
export const coef = (n: number, v = 'x'): string =>
  n === 1 ? v : n === -1 ? `−${v}` : `${num(n)}${v}`

/** Reduce a fraction, returning the pair. */
export const reduce = (n: number, d: number): [number, number] => {
  const g = (a: number, b: number): number => (b ? g(b, a % b) : Math.abs(a))
  const k = g(n, d) || 1
  const sign = d < 0 ? -1 : 1
  return [(sign * n) / k, (sign * d) / k]
}

/** Render a rational as the student would enter it: an integer, or "a/b". */
export const frac = (n: number, d: number): string => {
  const [a, b] = reduce(n, d)
  return (b === 1 ? String(a) : `${a}/${b}`).replace('-', '−')
}

/** Every accepted spelling of a rational answer: fraction plus exact decimal. */
export const acceptRational = (n: number, d: number): string[] => {
  const [a, b] = reduce(n, d)
  if (b === 1) return [String(a)]
  const out = [`${a}/${b}`]
  const dec = a / b
  // Only offer a decimal when it terminates within the grid's four slots.
  const s = String(Number(dec.toFixed(6)))
  if (s.replace('-', '').replace('.', '').length <= 5 && Number(s) === Number((a / b).toFixed(6))) {
    out.push(s)
  }
  return out
}
