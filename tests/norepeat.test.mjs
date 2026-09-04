/**
 * The guarantee that matters: working a whole plan end to end must never serve
 * the same question twice. This drives the real selection engine, lesson by
 * lesson, exactly as the app does.
 */
const { buildPlan, TIMEFRAMES, DAILY_GOALS, trackLessons } = await import('../src/engine/planner.ts')
const { selectHalf, routeTier, HALF_MODULE } = await import('../src/engine/selection.ts')
const { tierForRating, seedRatings, updateRating } = await import('../src/engine/rating.ts')

let fail = 0
const bad = m => { console.log('  FAIL ' + m); fail++ }

/** Play a whole plan, one trail at a time, and report any repeated question. */
const playPlan = (plan, goal, accuracy) => {
  const seen = []
  const repeats = []
  let ratings = seedRatings(goal)

  for (const section of ['rw', 'math']) {
    for (const lesson of trackLessons(plan, section)) {
      const avg = lesson.domains.reduce((s, d) => s + ratings[d], 0) / lesson.domains.length
      const startTier = tierForRating(avg)

      const first = selectHalf(lesson.domains, startTier, { seen }, new Set())
      let correct = 0
      for (const q of first) {
        const ok = Math.random() < accuracy
        if (ok) correct++
        ratings = { ...ratings, [q.domain]: updateRating(ratings[q.domain], q.difficulty, ok) }
      }
      const { tier } = routeTier(startTier, correct)
      const second = selectHalf(lesson.domains, tier, { seen }, new Set(first.map(q => q.id)))
      for (const q of second) ratings = { ...ratings, [q.domain]: updateRating(ratings[q.domain], q.difficulty, Math.random() < accuracy) }

      const lessonQs = [...first, ...second]
      if (lessonQs.length !== HALF_MODULE * 2) bad(`${lesson.id}: served ${lessonQs.length} questions, expected 12`)
      if (new Set(lessonQs.map(q => q.id)).size !== lessonQs.length) bad(`${lesson.id}: a question repeated within the lesson`)
      for (const q of lessonQs) {
        if (seen.includes(q.id)) repeats.push({ lesson: lesson.id, id: q.id })
        seen.push(q.id)
      }
    }
  }
  return { seen, repeats }
}

console.log('Playing full plans through the real selection engine...\n')
for (const t of TIMEFRAMES) {
  for (const minutes of [10, 20]) {
    const plan = buildPlan({ name: 'T', timeframe: t.id, dailyMinutes: minutes, goalScore: 1400 })
    // A weak student routes down and a strong one routes up, which pulls from
    // different difficulty pools -- run both, since either could exhaust one.
    for (const [label, acc] of [['struggling', 0.35], ['strong', 0.9]]) {
      const { seen, repeats } = playPlan(plan, 1400, acc)
      const tag = `${t.label}/${minutes}m/${label}`
      if (repeats.length) bad(`${tag}: ${repeats.length} repeated questions, first at lesson ${repeats[0].lesson}`)
      if (seen.length !== plan.totalLessons * 12) bad(`${tag}: served ${seen.length}, expected ${plan.totalLessons * 12}`)
      if (minutes === 10 && acc === 0.9)
        console.log(`  ${t.label.padEnd(10)} ${String(plan.totalLessons).padStart(3)} lessons -> ${String(seen.length).padStart(4)} questions, ${new Set(seen).size} distinct`)
    }
  }
}

// And the hardest case: the largest plan the app will build.
const biggest = buildPlan({ name: 'T', timeframe: '3-months', dailyMinutes: 20, goalScore: 1600 })
const { seen, repeats } = playPlan(biggest, 1600, 0.75)
console.log(`\n  largest plan: ${biggest.totalLessons} lessons -> ${seen.length} questions, ${new Set(seen).size} distinct`)
if (repeats.length) bad(`largest plan repeated ${repeats.length} questions`)

console.log(fail ? `\n${fail} FAILING` : '\nNo question is ever served twice in a plan')
process.exit(fail ? 1 : 0)
