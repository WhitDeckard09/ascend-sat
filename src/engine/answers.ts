import type { Question } from '../data/types'

/**
 * Grading. Multiple choice is an index comparison; student-produced response
 * has to accept every form the real test would — 1/2, 0.5, and .5 are all the
 * same answer, and a stray space or a leading + should not cost a point.
 */

const normalize = (raw: string): string =>
  raw
    .trim()
    .replace(/\s+/g, '')
    .replace(/^\+/, '')
    // The test accepts the minus sign in either form.
    .replace(/[−–—]/g, '-')
    .replace(/^\./, '0.')
    .replace(/^-\./, '-0.')

/** Parse "3/4", "-1.5", "12" into a number, or null if it is not a value. */
const toNumber = (raw: string): number | null => {
  const s = normalize(raw)
  const frac = s.match(/^(-?\d+)\/(\d+)$/)
  if (frac) {
    const denom = Number(frac[2])
    return denom === 0 ? null : Number(frac[1]) / denom
  }
  if (/^-?\d*\.?\d+$/.test(s)) return Number(s)
  return null
}

export const isSprCorrect = (input: string, accepted: string[]): boolean => {
  const norm = normalize(input)
  if (!norm) return false
  if (accepted.some((a) => normalize(a) === norm)) return true

  const value = toNumber(input)
  if (value === null) return false
  return accepted.some((a) => {
    const target = toNumber(a)
    if (target === null) return false
    // The SAT accepts any answer that matches to at least three decimal places.
    return Math.abs(value - target) < 1e-4
  })
}

export const isCorrect = (q: Question, response: number | string | null): boolean => {
  if (response === null) return false
  if (q.type === 'mc') return response === q.answer
  return isSprCorrect(String(response), q.accepted ?? [])
}

/** How the answer should read in the recap when it was wrong. */
export const correctAnswerText = (q: Question): string =>
  q.type === 'mc' ? (q.choices?.[q.answer ?? 0] ?? '') : (q.accepted?.[0] ?? '')
