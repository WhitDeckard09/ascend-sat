/** Structural validation of the whole question bank, hand-written and generated. */
const { ALL_QUESTIONS } = await import('../src/data/bank.ts')
const { DOMAINS } = await import('../src/data/types.ts')

let fail = 0
const bad = m => { console.log('  FAIL ' + m); fail++ }
// Drafting phrases are matched loosely; broken values need word boundaries and
// case sensitivity, or "discriminant" trips the NaN check.
const draftText = /let us recheck|recompute|which is not offered|not among choices|TODO|FIXME/i
const brokenValue = /\bNaN\b|\bundefined\b|\[object Object\]/

const ids = new Set()
for (const q of ALL_QUESTIONS) {
  const at = q.id ?? '(missing id)'
  if (!q.id) bad('question with no id')
  if (ids.has(q.id)) bad(`${at}: duplicate id`)
  ids.add(q.id)

  for (const f of ['section', 'domain', 'skill', 'difficulty', 'type', 'prompt', 'explanation'])
    if (q[f] === undefined) bad(`${at}: missing "${f}"`)

  if (![1, 2, 3].includes(q.difficulty)) bad(`${at}: bad difficulty ${q.difficulty}`)
  if (!['rw', 'math'].includes(q.section)) bad(`${at}: bad section`)
  if (!DOMAINS.some(d => d.id === q.domain)) bad(`${at}: unknown domain ${q.domain}`)
  if (!DOMAINS.find(d => d.id === q.domain)?.skills.some(s => s.id === q.skill))
    bad(`${at}: skill "${q.skill}" not declared for ${q.domain}`)
  if (DOMAINS.find(d => d.id === q.domain)?.section !== q.section)
    bad(`${at}: domain ${q.domain} does not belong to section ${q.section}`)

  if (q.type === 'mc') {
    if (!Array.isArray(q.choices) || q.choices.length !== 4)
      bad(`${at}: mc needs exactly 4 choices, has ${q.choices?.length}`)
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3)
      bad(`${at}: mc answer index out of range (${q.answer})`)
    if (q.accepted) bad(`${at}: mc should not have "accepted"`)
    if (q.choices && new Set(q.choices).size !== q.choices.length) bad(`${at}: duplicate choice text`)
    if (q.choices?.some(c => c == null || String(c).trim() === '')) bad(`${at}: blank choice`)
  } else if (q.type === 'spr') {
    if (!Array.isArray(q.accepted) || q.accepted.length === 0) bad(`${at}: spr needs "accepted"`)
    if (q.accepted?.some(a => a == null || String(a).trim() === '')) bad(`${at}: blank accepted value`)
    if (q.choices) bad(`${at}: spr should not have choices`)
    if (q.answer !== undefined) bad(`${at}: spr should not have "answer"`)
  } else bad(`${at}: bad type ${q.type}`)

  for (const f of ['explanation', 'trap', 'prompt']) {
    if (!q[f]) continue
    if (draftText.test(q[f])) bad(`${at}: leftover drafting text in "${f}"`)
    if (brokenValue.test(q[f])) bad(`${at}: unrendered value in "${f}"`)
  }
  for (const c of q.choices ?? []) if (brokenValue.test(c)) bad(`${at}: unrendered value in a choice`)
  for (const a of q.accepted ?? []) if (brokenValue.test(a)) bad(`${at}: unrendered value in "accepted"`)
  if (q.section === 'rw' && q.type !== 'mc') bad(`${at}: R&W questions must be multiple choice`)
  if (q.table && (!q.table.headers?.length || !q.table.rows?.length)) bad(`${at}: malformed table`)
}

const by = {}
for (const q of ALL_QUESTIONS) {
  by[q.domain] ??= { total: 0, 1: 0, 2: 0, 3: 0, spr: 0, gen: 0 }
  by[q.domain].total++; by[q.domain][q.difficulty]++
  if (q.type === 'spr') by[q.domain].spr++
  if (q.id.startsWith('g-')) by[q.domain].gen++
}
console.log(`Validated ${ALL_QUESTIONS.length} questions\n`)
console.log('domain'.padEnd(24), 'total  easy   med  hard   spr   gen')
for (const d of DOMAINS) {
  const c = by[d.id] ?? { total: 0, 1: 0, 2: 0, 3: 0, spr: 0, gen: 0 }
  console.log(d.label.slice(0, 23).padEnd(24), String(c.total).padStart(4), String(c[1]).padStart(5),
    String(c[2]).padStart(5), String(c[3]).padStart(5), String(c.spr).padStart(5), String(c.gen).padStart(5))
  if (!c.total) bad(`${d.id}: no questions at all`)
  for (const diff of [1, 2, 3]) if (c[diff] < 4) bad(`${d.id}: only ${c[diff]} questions at difficulty ${diff}`)
}

const mathQ = ALL_QUESTIONS.filter(q => q.section === 'math')
console.log(`\nMath grid-in share: ${(mathQ.filter(q => q.type === 'spr').length / mathQ.length * 100).toFixed(0)}% in the bank; selection caps each module at 33%`)

console.log(fail ? `\n${fail} FAILING` : '\nAll structural checks pass')
process.exit(fail ? 1 : 0)
