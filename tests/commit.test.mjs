/**
 * Committing lessons. The case that matters is the *second* lesson of a day:
 * `advanceStreak` returns its argument unchanged once today has counted, so a
 * call site that spreads the whole result back over the patch quietly reverts
 * everything the lesson earned.
 */
globalThis.localStorage = {
  store: new Map(),
  getItem(k) { return this.store.has(k) ? this.store.get(k) : null },
  setItem(k, v) { this.store.set(k, String(v)) },
  removeItem(k) { this.store.delete(k) },
}

const store = await import('../src/store/store.ts')

let fail = 0
const check = (name, got, expected) => {
  const ok = JSON.stringify(got) === JSON.stringify(expected)
  if (!ok) fail++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(52)} ${JSON.stringify(got)}${ok ? '' : ` EXPECTED ${JSON.stringify(expected)}`}`)
}

store.startPlan({ name: 'Test', timeframe: '1-month', dailyMinutes: 30, goalScore: 1400 })

const lesson = (lessonId, xpEarned, durationMs, correct) => ({
  lessonId,
  answers: Array.from({ length: 12 }, (_, i) => ({
    questionId: `${lessonId}-q${i}`,
    domain: 'algebra',
    difficulty: 2,
    correct,
    response: 0,
    ms: durationMs / 12,
  })),
  ratingsAfter: store.getState().ratings,
  xpEarned,
  durationMs,
})

// First lesson of the day: this one always worked.
store.commitLesson(lesson('l1', 10, 60_000, true))
check('first lesson banks its XP', store.getState().xp, 10)
check('first lesson is marked complete', store.getState().completedLessons, ['l1'])
check('first lesson records its time', store.getState().lessonTimes.length, 1)
check('the streak starts', store.getState().streak, 1)

// Second lesson, same day. Everything above must still accumulate.
store.commitLesson(lesson('l2', 15, 90_000, false))
const s = store.getState()
check('a second same-day lesson adds its XP', s.xp, 25)
check('...and is marked complete', s.completedLessons, ['l1', 'l2'])
check('...and records its time, newest first', s.lessonTimes.map((t) => t.lessonId), ['l2', 'l1'])
check('...with the duration it was given', s.lessonTimes[0].ms, 90_000)
check('...and its misses', s.missed.length, 12)
check('...and counts its questions', s.answeredByDomain.algebra, 24)
check('...without double-counting the streak', s.streak, 1)
check('...and the day is listed once', s.daysActive.length, 1)

// A third, to be sure it is not an off-by-one that survives exactly twice.
store.commitLesson(lesson('l3', 10, 30_000, true))
check('a third same-day lesson still accumulates', store.getState().xp, 35)
check('...and its time', store.getState().lessonTimes.length, 3)

// What was persisted must match what is in memory.
const saved = JSON.parse(globalThis.localStorage.getItem('ascend-sat-v1'))
check('the save matches memory', [saved.xp, saved.lessonTimes.length], [35, 3])

console.log(fail ? `\n${fail} FAILING` : '\nAll commit cases pass')
process.exit(fail ? 1 : 0)
