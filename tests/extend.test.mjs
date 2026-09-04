/** Adding lessons to an existing plan from Settings. */
const { buildPlan, extendPlan, trackLessons, LESSONS_PER_UNIT, MAX_PLAN_LESSONS } =
  await import('../src/engine/planner.ts')
const { DOMAINS, DOMAIN_BY_ID } = await import('../src/data/types.ts')

let fail = 0
const bad = m => { console.log('  FAIL ' + m); fail++ }
const ids = p => [...trackLessons(p, 'rw'), ...trackLessons(p, 'math')].map(l => l.id)

const base = buildPlan({ name: 'T', timeframe: '1-month', dailyMinutes: 15, goalScore: 1400 })
console.log(`base plan: ${trackLessons(base, 'rw').length} R&W + ${trackLessons(base, 'math').length} Math = ${base.totalLessons}`)

// --- exact counts, and only the requested trail grows ---
for (const [rw, math] of [[0,0],[1,0],[0,1],[5,0],[0,5],[3,7],[20,20]]) {
  const p = extendPlan(base, { rw, math }, 1400)
  const drw = trackLessons(p, 'rw').length - trackLessons(base, 'rw').length
  const dmath = trackLessons(p, 'math').length - trackLessons(base, 'math').length
  if (drw !== rw) bad(`+${rw}/${math}: R&W grew by ${drw}`)
  if (dmath !== math) bad(`+${rw}/${math}: Math grew by ${dmath}`)
  if (p.totalLessons !== base.totalLessons + rw + math) bad(`+${rw}/${math}: totalLessons wrong`)
}
console.log('  counts exact, trails independent')

// --- THE critical one: existing ids must survive untouched ---
const grown = extendPlan(base, { rw: 9, math: 9 }, 1400)
const beforeIds = ids(base)
const afterIds = ids(grown)
for (const id of beforeIds) if (!afterIds.includes(id)) bad(`extension dropped existing id ${id}`)
if (afterIds.slice(0, 0).length) bad('unreachable')
// order of the originals must be preserved too, so path position still reads right
const rwBefore = trackLessons(base, 'rw').map(l => l.id)
const rwAfter = trackLessons(grown, 'rw').map(l => l.id).slice(0, rwBefore.length)
if (JSON.stringify(rwBefore) !== JSON.stringify(rwAfter)) bad('existing R&W lessons were reordered')
if (new Set(afterIds).size !== afterIds.length) bad('duplicate ids after extending')
console.log('  existing lesson ids preserved, in order, no duplicates')

// --- the input plan must not be mutated ---
const snapshot = JSON.stringify(base)
extendPlan(base, { rw: 6, math: 6 }, 1400)
if (JSON.stringify(base) !== snapshot) bad('extendPlan mutated its input')
console.log('  input plan untouched')

// --- units fill before new ones open, and full units end in a review ---
for (let n = 1; n <= 25; n++) {
  const p = extendPlan(base, { rw: n, math: 0 }, 1400)
  for (const u of p.rw) {
    if (u.lessons.length > LESSONS_PER_UNIT) bad(`+${n}: unit ${u.index} has ${u.lessons.length} lessons`)
    if (u.lessons.length === LESSONS_PER_UNIT && u.lessons.at(-1).kind !== 'review')
      bad(`+${n}: full unit ${u.index} does not end in a review`)
    if (u.lessons.length < LESSONS_PER_UNIT && u.lessons.some(l => l.kind === 'review'))
      bad(`+${n}: partial unit ${u.index} contains a review`)
    u.lessons.forEach((l, i) => {
      if (l.indexInUnit !== i) bad(`+${n}: unit ${u.index} lesson ${i} has indexInUnit ${l.indexInUnit}`)
      if (l.id !== `rw-u${u.index}-l${i}`) bad(`+${n}: bad id ${l.id}`)
    })
  }
  // no gaps: only the last unit may be partial
  p.rw.slice(0, -1).forEach(u => {
    if (u.lessons.length !== LESSONS_PER_UNIT) bad(`+${n}: non-final unit ${u.index} is partial`)
  })
}
console.log('  units fill in order, reviews land correctly, ids stay consistent')

// --- extra lessons follow blueprint weighting ---
const big = extendPlan(base, { rw: 0, math: 60 }, 1400)
const mathDomains = trackLessons(big, 'math').flatMap(l => l.kind === 'lesson' ? l.domains : [])
const share = {}
for (const d of mathDomains) share[d] = (share[d] ?? 0) + 1
console.log('\n  math domain shares after +60 (blueprint in brackets):')
for (const d of DOMAINS.filter(x => x.section === 'math')) {
  const got = ((share[d.id] ?? 0) / mathDomains.length * 100)
  const want = DOMAIN_BY_ID[d.id].weight * 100
  console.log(`    ${d.short.padEnd(10)} ${got.toFixed(0).padStart(3)}%  [${want.toFixed(0)}%]`)
  if (Math.abs(got - want) > 6) bad(`${d.short}: ${got.toFixed(0)}% vs blueprint ${want.toFixed(0)}%`)
}

// --- repeated extensions behave like one big one ---
let step = base
for (let i = 0; i < 5; i++) step = extendPlan(step, { rw: 4, math: 4 }, 1400)
const once = extendPlan(base, { rw: 20, math: 20 }, 1400)
if (step.totalLessons !== once.totalLessons) bad(`5x(+4/+4) gave ${step.totalLessons}, one +20/+20 gave ${once.totalLessons}`)
if (new Set(ids(step)).size !== ids(step).length) bad('duplicate ids after repeated extension')
console.log(`\n  five successive extensions -> ${step.totalLessons} lessons, no duplicates`)

// --- the ceiling holds ---
let huge = base
for (let i = 0; i < 40; i++) huge = extendPlan(huge, { rw: 20, math: 20 }, 1400)
if (huge.totalLessons > MAX_PLAN_LESSONS) bad(`ceiling breached: ${huge.totalLessons} > ${MAX_PLAN_LESSONS}`)
if (new Set(ids(huge)).size !== ids(huge).length) bad('duplicate ids at the ceiling')
console.log(`  ceiling holds at ${huge.totalLessons}/${MAX_PLAN_LESSONS}`)

// --- negative / silly input is ignored rather than corrupting the plan ---
const weird = extendPlan(base, { rw: -5, math: -1 }, 1400)
if (weird.totalLessons !== base.totalLessons) bad('negative counts changed the plan')
console.log('  negative counts ignored')

console.log(fail ? `\n${fail} FAILING` : '\nAll extend checks pass')
process.exit(fail ? 1 : 0)
