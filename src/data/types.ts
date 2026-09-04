/** Core domain model. Mirrors the College Board digital SAT blueprint. */

export type Section = 'rw' | 'math'

export type Domain =
  // Reading & Writing
  | 'information-ideas'
  | 'craft-structure'
  | 'expression-of-ideas'
  | 'standard-english'
  // Math
  | 'algebra'
  | 'advanced-math'
  | 'problem-solving-data'
  | 'geometry-trig'

/** 1 = easy, 2 = medium, 3 = hard. Matches the test's own three-tier banding. */
export type Difficulty = 1 | 2 | 3

/** Multiple choice, or student-produced response (the math "grid-in"). */
export type QuestionType = 'mc' | 'spr'

export interface Question {
  id: string
  section: Section
  domain: Domain
  /** Sub-skill slug, e.g. 'transitions'. Drives the "what to work on" recap. */
  skill: string
  difficulty: Difficulty
  type: QuestionType
  /** R&W stimulus, 25–150 words, as on the real test. Math uses it for setup text. */
  passage?: string
  /** Pre-formatted data table rendered above the prompt. */
  table?: { headers: string[]; rows: string[][] }
  prompt: string
  /** Exactly 4 for `mc`; omitted for `spr`. */
  choices?: string[]
  /** Index into `choices` for `mc`. */
  answer?: number
  /** Every accepted string form for `spr`, e.g. ['1.5', '3/2']. */
  accepted?: string[]
  explanation: string
  /** Why the most seductive wrong answer is wrong. Shown in review. */
  trap?: string
}

export interface DomainMeta {
  id: Domain
  section: Section
  label: string
  short: string
  /** Share of its section on the real test, as a fraction. */
  weight: number
  color: 'grass' | 'macaw' | 'bee' | 'beetle' | 'fox' | 'cardinal'
  blurb: string
  skills: { id: string; label: string }[]
}

export const DOMAINS: DomainMeta[] = [
  {
    id: 'standard-english',
    section: 'rw',
    label: 'Standard English Conventions',
    short: 'Grammar',
    weight: 0.26,
    color: 'macaw',
    blurb: 'Punctuation, sentence boundaries, verbs, and agreement.',
    skills: [
      { id: 'boundaries', label: 'Sentence Boundaries' },
      { id: 'form-structure-sense', label: 'Form, Structure & Sense' },
    ],
  },
  {
    id: 'information-ideas',
    section: 'rw',
    label: 'Information and Ideas',
    short: 'Info & Ideas',
    weight: 0.26,
    color: 'grass',
    blurb: 'Main ideas, evidence, and logical inferences.',
    skills: [
      { id: 'central-ideas', label: 'Central Ideas & Details' },
      { id: 'command-textual', label: 'Command of Evidence: Textual' },
      { id: 'command-quantitative', label: 'Command of Evidence: Quantitative' },
      { id: 'inferences', label: 'Inferences' },
    ],
  },
  {
    id: 'craft-structure',
    section: 'rw',
    label: 'Craft and Structure',
    short: 'Craft',
    weight: 0.28,
    color: 'beetle',
    blurb: 'Vocabulary in context, text purpose, and paired passages.',
    skills: [
      { id: 'words-in-context', label: 'Words in Context' },
      { id: 'text-structure-purpose', label: 'Text Structure & Purpose' },
      { id: 'cross-text', label: 'Cross-Text Connections' },
    ],
  },
  {
    id: 'expression-of-ideas',
    section: 'rw',
    label: 'Expression of Ideas',
    short: 'Expression',
    weight: 0.2,
    color: 'fox',
    blurb: 'Transitions and synthesizing notes into a sentence.',
    skills: [
      { id: 'transitions', label: 'Transitions' },
      { id: 'rhetorical-synthesis', label: 'Rhetorical Synthesis' },
    ],
  },
  {
    id: 'algebra',
    section: 'math',
    label: 'Algebra',
    short: 'Algebra',
    weight: 0.35,
    color: 'grass',
    blurb: 'Linear equations, functions, systems, and inequalities.',
    skills: [
      { id: 'linear-one-var', label: 'Linear Equations (1 variable)' },
      { id: 'linear-two-var', label: 'Linear Equations (2 variables)' },
      { id: 'linear-functions', label: 'Linear Functions' },
      { id: 'systems', label: 'Systems of Equations' },
      { id: 'inequalities', label: 'Linear Inequalities' },
    ],
  },
  {
    id: 'advanced-math',
    section: 'math',
    label: 'Advanced Math',
    short: 'Advanced',
    weight: 0.35,
    color: 'beetle',
    blurb: 'Quadratics, exponentials, polynomials, and nonlinear functions.',
    skills: [
      { id: 'equivalent-expressions', label: 'Equivalent Expressions' },
      { id: 'nonlinear-equations', label: 'Nonlinear Equations' },
      { id: 'nonlinear-functions', label: 'Nonlinear Functions' },
    ],
  },
  {
    id: 'problem-solving-data',
    section: 'math',
    label: 'Problem-Solving and Data Analysis',
    short: 'Data',
    weight: 0.15,
    color: 'macaw',
    blurb: 'Ratios, percentages, statistics, and probability.',
    skills: [
      { id: 'ratios-rates-units', label: 'Ratios, Rates & Units' },
      { id: 'percentages', label: 'Percentages' },
      { id: 'one-var-data', label: 'One-Variable Data' },
      { id: 'two-var-data', label: 'Two-Variable Data' },
      { id: 'probability', label: 'Probability' },
      { id: 'inference-margin', label: 'Inference & Margin of Error' },
    ],
  },
  {
    id: 'geometry-trig',
    section: 'math',
    label: 'Geometry and Trigonometry',
    short: 'Geometry',
    weight: 0.15,
    color: 'bee',
    blurb: 'Angles, triangles, circles, area, volume, and trig.',
    skills: [
      { id: 'area-volume', label: 'Area & Volume' },
      { id: 'lines-angles-triangles', label: 'Lines, Angles & Triangles' },
      { id: 'right-triangles-trig', label: 'Right Triangles & Trig' },
      { id: 'circles', label: 'Circles' },
    ],
  },
]

export const DOMAIN_BY_ID: Record<Domain, DomainMeta> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
) as Record<Domain, DomainMeta>

export const SKILL_LABEL: Record<string, string> = Object.fromEntries(
  DOMAINS.flatMap((d) => d.skills.map((s) => [s.id, s.label])),
)

export const skillDomain = (skillId: string): Domain =>
  DOMAINS.find((d) => d.skills.some((s) => s.id === skillId))!.id
