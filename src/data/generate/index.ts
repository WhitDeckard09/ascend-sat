import type { Question } from '../types'
import { expand } from './core'
import { algebraTemplates } from './algebra'
import { advancedTemplates } from './advanced'
import { dataTemplates } from './data'
import { geometryTemplates } from './geometry'

/**
 * Generated math questions.
 *
 * Every answer here is computed by the code that builds the question, so the
 * arithmetic cannot drift the way it can in hand-written items. Variant counts
 * are tuned so each domain has enough depth for its blueprint share of the
 * longest plan the app will build.
 */
export const GENERATED_MATH: Question[] = [
  ...expand(algebraTemplates, 11, 'math'),
  ...expand(advancedTemplates, 11, 'math'),
  ...expand(dataTemplates, 9, 'math'),
  ...expand(geometryTemplates, 8, 'math'),
]
