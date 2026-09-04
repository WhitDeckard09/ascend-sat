import type { Question, Domain, Difficulty, Section } from './types'
import { DOMAINS } from './types'
import { standardEnglish } from './questions/rw-standard-english'
import { standardEnglish2 } from './questions/rw-standard-english-2'
import { standardEnglish3 } from './questions/rw-standard-english-3'
import { informationIdeas } from './questions/rw-information-ideas'
import { informationIdeas2 } from './questions/rw-information-ideas-2'
import { informationIdeas3 } from './questions/rw-information-ideas-3'
import { informationIdeas4 } from './questions/rw-information-ideas-4'
import { craftStructure } from './questions/rw-craft-structure'
import { craftStructure2 } from './questions/rw-craft-structure-2'
import { craftStructure3 } from './questions/rw-craft-structure-3'
import { expressionOfIdeas } from './questions/rw-expression'
import { expressionOfIdeas2 } from './questions/rw-expression-2'
import { expressionOfIdeas3 } from './questions/rw-expression-3'
import { algebra } from './questions/math-algebra'
import { advancedMath } from './questions/math-advanced'
import { problemSolvingData } from './questions/math-data'
import { geometryTrig } from './questions/math-geometry'
import { GENERATED_MATH } from './generate'

export const ALL_QUESTIONS: Question[] = [
  ...standardEnglish,
  ...standardEnglish2,
  ...standardEnglish3,
  ...informationIdeas,
  ...informationIdeas2,
  ...informationIdeas3,
  ...informationIdeas4,
  ...craftStructure,
  ...craftStructure2,
  ...craftStructure3,
  ...expressionOfIdeas,
  ...expressionOfIdeas2,
  ...expressionOfIdeas3,
  ...algebra,
  ...advancedMath,
  ...problemSolvingData,
  ...geometryTrig,
  ...GENERATED_MATH,
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

/** Questions held per domain, for the planner's capacity calculation. */
export const questionCounts = (): Record<Domain, number> => {
  const counts = Object.fromEntries(DOMAINS.map((d) => [d.id, 0])) as Record<Domain, number>
  for (const q of ALL_QUESTIONS) counts[q.domain]++
  return counts
}
