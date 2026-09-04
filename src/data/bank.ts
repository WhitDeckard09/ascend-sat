import type { Question, Domain, Difficulty, Section } from './types'
import { standardEnglish } from './questions/rw-standard-english'
import { informationIdeas } from './questions/rw-information-ideas'
import { craftStructure } from './questions/rw-craft-structure'
import { expressionOfIdeas } from './questions/rw-expression'
import { algebra } from './questions/math-algebra'
import { advancedMath } from './questions/math-advanced'
import { problemSolvingData } from './questions/math-data'
import { geometryTrig } from './questions/math-geometry'

export const ALL_QUESTIONS: Question[] = [
  ...standardEnglish,
  ...informationIdeas,
  ...craftStructure,
  ...expressionOfIdeas,
  ...algebra,
  ...advancedMath,
  ...problemSolvingData,
  ...geometryTrig,
]

export const QUESTION_BY_ID = new Map(ALL_QUESTIONS.map((q) => [q.id, q]))

/** Pre-built index so selection never scans the whole bank. */
const index = new Map<string, Question[]>()
for (const q of ALL_QUESTIONS) {
  const key = `${q.domain}|${q.difficulty}`
  const list = index.get(key)
  if (list) list.push(q)
  else index.set(key, [q])
}

export const byDomainDifficulty = (domain: Domain, difficulty: Difficulty): Question[] =>
  index.get(`${domain}|${difficulty}`) ?? []

export const bySection = (section: Section): Question[] =>
  ALL_QUESTIONS.filter((q) => q.section === section)

/** How many questions exist for each domain/difficulty pair. Used by the planner
 *  to avoid promising more modules than the bank can fill without heavy repeats. */
export const bankCounts = (): Record<string, number> =>
  Object.fromEntries([...index.entries()].map(([k, v]) => [k, v.length]))
