import { readFileSync, readdirSync } from 'node:fs'

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'src/data/questions')
let src = ''
for (const f of readdirSync(dir)) src += readFileSync(join(dir, f), 'utf8')

// Strip imports/exports and eval the array literals to get real objects.
const arrays = [...src.matchAll(/export const \w+: Question\[\] = (\[[\s\S]*?\n\])\n/g)]
const qs = arrays.flatMap(m => eval(m[1]))

const errs = []
const ids = new Set()
const badWords = /let us recheck|recompute|which is not offered|not among choices|TODO|FIXME/i

for (const q of qs) {
  const at = q.id ?? '(missing id)'
  if (!q.id) errs.push('question with no id')
  if (ids.has(q.id)) errs.push(`${at}: duplicate id`)
  ids.add(q.id)

  for (const f of ['section','domain','skill','difficulty','type','prompt','explanation'])
    if (q[f] === undefined) errs.push(`${at}: missing "${f}"`)

  if (![1,2,3].includes(q.difficulty)) errs.push(`${at}: bad difficulty ${q.difficulty}`)
  if (!['rw','math'].includes(q.section)) errs.push(`${at}: bad section`)

  if (q.type === 'mc') {
    if (!Array.isArray(q.choices) || q.choices.length !== 4)
      errs.push(`${at}: mc needs exactly 4 choices, has ${q.choices?.length}`)
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3)
      errs.push(`${at}: mc answer index out of range (${q.answer})`)
    if (q.accepted) errs.push(`${at}: mc should not have "accepted"`)
    if (q.choices && new Set(q.choices).size !== q.choices.length)
      errs.push(`${at}: duplicate choice text`)
  } else if (q.type === 'spr') {
    if (!Array.isArray(q.accepted) || q.accepted.length === 0)
      errs.push(`${at}: spr needs "accepted"`)
    if (q.choices) errs.push(`${at}: spr should not have choices`)
    if (q.answer !== undefined) errs.push(`${at}: spr should not have "answer"`)
  } else errs.push(`${at}: bad type ${q.type}`)

  for (const f of ['explanation','trap','prompt'])
    if (q[f] && badWords.test(q[f])) errs.push(`${at}: leftover drafting text in "${f}"`)

  if (q.section === 'rw' && q.type !== 'mc') errs.push(`${at}: R&W questions must be multiple choice`)
}

// Blueprint coverage report
const byDomain = {}
for (const q of qs) {
  byDomain[q.domain] ??= { total: 0, 1: 0, 2: 0, 3: 0, spr: 0 }
  byDomain[q.domain].total++
  byDomain[q.domain][q.difficulty]++
  if (q.type === 'spr') byDomain[q.domain].spr++
}
console.log(`Parsed ${qs.length} questions from ${arrays.length} files\n`)
console.log('domain'.padEnd(24), 'total  easy  med  hard  spr')
for (const [d, c] of Object.entries(byDomain))
  console.log(d.padEnd(24), String(c.total).padStart(4), String(c[1]).padStart(5), String(c[2]).padStart(5), String(c[3]).padStart(5), String(c.spr).padStart(5))

const mathQ = qs.filter(q => q.section === 'math')
console.log(`\nMath SPR share: ${(mathQ.filter(q=>q.type==='spr').length/mathQ.length*100).toFixed(0)}% (real SAT: ~25%)`)

if (errs.length) { console.log('\n❌ ERRORS:'); errs.forEach(e => console.log('  ', e)); process.exit(1) }
console.log('\n✅ All structural checks passed')
