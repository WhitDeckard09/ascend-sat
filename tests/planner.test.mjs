/** Plan generation across every onboarding combination, in two-track form. */
const { buildPlan, TIMEFRAMES, DAILY_GOALS, LESSONS_PER_UNIT, trackLessons, lessonCountFor } =
  await import('../src/engine/planner.ts')
const { ALL_QUESTIONS } = await import('../src/data/bank.ts')
const { trailCapacity } = await import('../src/engine/planner.ts')
const { DOMAINS } = await import('../src/data/types.ts')

let fail = 0
const bad = m => { console.log('  FAIL ' + m); fail++ }

const GOALS = []
for (let g = 1000; g <= 1600; g += 50) GOALS.push(g)

let n = 0
for (const t of TIMEFRAMES) {
  for (const d of DAILY_GOALS) {
    for (const goal of GOALS) {
      const p = buildPlan({ name: 'T', timeframe: t.id, dailyMinutes: d.minutes, goalScore: goal })
      const tag = `${t.id}/${d.minutes}m/${goal}`
      const rw = trackLessons(p, 'rw')
      const math = trackLessons(p, 'math')

      // The split moves lessons between trails; it must not create or lose any.
      const allocSum = Object.values(p.allocation).reduce((a, b) => a + b, 0)
      if (rw.length + math.length !== allocSum) bad(`${tag}: ${rw.length}+${math.length} != allocation ${allocSum}`)
      if (p.totalLessons !== rw.length + math.length) bad(`${tag}: totalLessons mismatch`)
      if (!rw.length || !math.length) bad(`${tag}: an empty trail`)

      // The two sections are weighted equally, so the trails stay within one
      // lesson of each other -- unless one has hit its own bank ceiling, in
      // which case the other is allowed to run longer rather than repeat.
      // Capacity depends on the goal, since emphasis reweights the domains.
      const rwCap = trailCapacity('rw', goal)
      const mathCap = trailCapacity('math', goal)
      const capped = rw.length >= rwCap || math.length >= mathCap
      if (!capped && Math.abs(rw.length - math.length) > 1)
        bad(`${tag}: trails uneven, ${rw.length} R&W vs ${math.length} Math`)

      // A plan must never promise more lessons than its bank can fill.
      if (rw.length > rwCap) bad(`${tag}: R&W trail ${rw.length} exceeds capacity ${rwCap}`)
      if (math.length > mathCap) bad(`${tag}: Math trail ${math.length} exceeds capacity ${mathCap}`)
      if (p.cappedByBank !== (p.totalLessons < p.requestedLessons))
        bad(`${tag}: cappedByBank flag disagrees with the counts`)

      // Ids must be unique across BOTH trails — completion is keyed by id.
      const ids = [...rw, ...math].map(l => l.id)
      if (new Set(ids).size !== ids.length) bad(`${tag}: duplicate lesson ids across trails`)

      // Each trail may only contain its own section's domains.
      for (const [section, lessons] of [['rw', rw], ['math', math]]) {
        for (const l of lessons) {
          for (const dom of l.domains) {
            if (DOMAINS.find(x => x.id === dom).section !== section)
              bad(`${tag}: ${section} trail contains ${dom}`)
          }
        }
      }

      for (const u of [...p.rw, ...p.math]) {
        if (u.lessons.length > LESSONS_PER_UNIT) bad(`${tag}: oversized unit`)
        if (u.lessons.length === LESSONS_PER_UNIT && u.lessons.at(-1).kind !== 'review')
          bad(`${tag}: unit ${u.index} does not end in a review`)
        if (u.color === 'bee') bad(`${tag}: gold banner would be unreadable`)
      }
      n++
    }
  }
}
console.log(`checked ${n} plans (${TIMEFRAMES.length} timeframes x ${DAILY_GOALS.length} daily goals x ${GOALS.length} slider stops)`)

// A trail should rotate its domains, not run one domain to exhaustion first.
const p = buildPlan({ name: 'T', timeframe: '2-months', dailyMinutes: 15, goalScore: 1400 })
for (const section of ['rw', 'math']) {
  const seq = trackLessons(p, section).filter(l => l.kind === 'lesson').map(l => l.domains[0])
  let maxRun = 1, run = 1
  for (let i = 1; i < seq.length; i++) { run = seq[i] === seq[i - 1] ? run + 1 : 1; maxRun = Math.max(maxRun, run) }
  console.log(`  ${section} rotation, longest same-domain run: ${maxRun}`)
  if (maxRun > 2) bad(`${section}: ran the same domain ${maxRun} times in a row`)
}

// Splitting must not change how many lessons a plan has overall.
for (const t of TIMEFRAMES) {
  for (const d of DAILY_GOALS) {
    const plan = buildPlan({ name: 'T', timeframe: t.id, dailyMinutes: d.minutes, goalScore: 1400 })
    const expected = Object.values(plan.allocation).reduce((a, b) => a + b, 0)
    if (plan.totalLessons !== expected) bad(`${t.id}/${d.minutes}m: total ${plan.totalLessons} != ${expected}`)
  }
}

const sample = buildPlan({ name: 'T', timeframe: '1-month', dailyMinutes: 15, goalScore: 1400 })
console.log(`\nsample (1 month, 15 min/day, goal 1400): ${sample.totalLessons} lessons`)
console.log(`  Reading & Writing: ${trackLessons(sample, 'rw').length} across ${sample.rw.length} units`)
console.log(`  Math:              ${trackLessons(sample, 'math').length} across ${sample.math.length} units`)

// The whole point of the exercise: a day of study per day available.
console.log('\n=== lessons vs days available (goal 1400, 10 min/day) ===')
for (const t of TIMEFRAMES) {
  const p = buildPlan({ name: 'T', timeframe: t.id, dailyMinutes: 10, goalScore: 1400 })
  const flag = p.cappedByBank ? `  (capped from ${p.requestedLessons})` : ''
  console.log(`  ${t.label.padEnd(10)} ${String(t.days).padStart(3)} days -> ${String(p.totalLessons).padStart(3)} lessons, ${String(p.totalLessons * 12).padStart(4)} questions${flag}`)
  if (!p.cappedByBank && p.totalLessons < t.days)
    bad(`${t.id}: ${p.totalLessons} lessons for ${t.days} days, short of one a day`)
}

// No plan may ever be asked to serve more questions than the bank holds.
const rwQ = ALL_QUESTIONS.filter(q => q.section === 'rw').length
const mathQ = ALL_QUESTIONS.length - rwQ
console.log(`\n  bank ${ALL_QUESTIONS.length} questions (R&W ${rwQ}, Math ${mathQ})`)
console.log(`  capacity: ${trailCapacity('rw', 1400)} R&W + ${trailCapacity('math', 1400)} Math lessons`)

console.log(fail ? `\n${fail} FAILING` : '\nAll planner checks pass')
process.exit(fail ? 1 : 0)
