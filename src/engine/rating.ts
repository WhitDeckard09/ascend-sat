import type { Difficulty, Domain, Section } from '../data/types'
import { DOMAINS } from '../data/types'

/**
 * Skill is tracked as a 0–100 rating per domain, updated question by question
 * with an Elo-style rule. This is what drives both the adaptive routing and the
 * projected score, and it is why repeatedly acing easy questions produces only
 * small gains — mirroring the real test, where an easier second module caps how
 * high you can score.
 */

/** Where each difficulty band sits on the rating scale. */
export const DIFFICULTY_RATING: Record<Difficulty, number> = { 1: 35, 2: 60, 3: 82 }

const K = 3.6
const SPREAD = 22

/** Probability a student at `rating` answers a question of `qRating` correctly. */
export const expectedScore = (rating: number, qRating: number): number =>
  1 / (1 + Math.pow(10, (qRating - rating) / SPREAD))

export const updateRating = (rating: number, difficulty: Difficulty, correct: boolean): number => {
  const q = DIFFICULTY_RATING[difficulty]
  const next = rating + K * ((correct ? 1 : 0) - expectedScore(rating, q))
  return Math.max(5, Math.min(98, next))
}

/** Which difficulty band a student at this rating should be working in. */
export const tierForRating = (rating: number): Difficulty =>
  rating < 45 ? 1 : rating < 72 ? 2 : 3

/** Goal score → the starting rating we seed every domain with. */
export const seedRatingForGoal = (goal: number): number => {
  const clamped = Math.max(900, Math.min(1600, goal))
  return Math.round(28 + ((clamped - 900) * 57) / 700)
}

export type Ratings = Record<Domain, number>

export const seedRatings = (goal: number): Ratings => {
  const seed = seedRatingForGoal(goal)
  return Object.fromEntries(DOMAINS.map((d) => [d.id, seed])) as Ratings
}

/**
 * Blend the live rating toward the goal-derived seed until enough questions have
 * been answered. Without this the projected score swings wildly on day one.
 */
const PRIOR_WEIGHT = 14

export const blendedRating = (rating: number, seed: number, answered: number): number =>
  (rating * answered + seed * PRIOR_WEIGHT) / (answered + PRIOR_WEIGHT)

/** Weighted section rating, using each domain's real share of its section. */
export const sectionRating = (
  section: Section,
  ratings: Ratings,
  seed: number,
  answeredByDomain: Partial<Record<Domain, number>>,
): number => {
  const domains = DOMAINS.filter((d) => d.section === section)
  const total = domains.reduce((sum, d) => sum + d.weight, 0)
  return domains.reduce((sum, d) => {
    const r = blendedRating(ratings[d.id], seed, answeredByDomain[d.id] ?? 0)
    return sum + (r * d.weight) / total
  }, 0)
}

/** Rating → a 200–800 section score, rounded to the nearest 10 as the SAT does. */
export const ratingToSectionScore = (rating: number): number => {
  const raw = 200 + (rating / 100) * 620
  return Math.max(200, Math.min(800, Math.round(raw / 10) * 10))
}

export const projectScore = (
  ratings: Ratings,
  goal: number,
  answeredByDomain: Partial<Record<Domain, number>>,
): { rw: number; math: number; total: number } => {
  const seed = seedRatingForGoal(goal)
  const rw = ratingToSectionScore(sectionRating('rw', ratings, seed, answeredByDomain))
  const math = ratingToSectionScore(sectionRating('math', ratings, seed, answeredByDomain))
  return { rw, math, total: rw + math }
}
