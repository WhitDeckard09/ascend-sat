/** The lesson clock: formatting, the real test's budget, and the verdict bands. */
const { budgetMs, comparePace, formatDuration, formatPace, makeLessonClock, SECONDS_PER_QUESTION } =
  await import('../src/engine/pace.ts')

let fail = 0
const check = (name, got, expected) => {
  const ok = JSON.stringify(got) === JSON.stringify(expected)
  if (!ok) fail++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(46)} ${JSON.stringify(got)}${ok ? '' : ` EXPECTED ${JSON.stringify(expected)}`}`)
}

// ------------------------------------------------------------------ formatting
check('0 ms', formatDuration(0), '0:00')
check('under a minute pads the seconds', formatDuration(9_000), '0:09')
check('exactly a minute', formatDuration(60_000), '1:00')
check('9:42', formatDuration(582_000), '9:42')
check('rounds to the nearest second', formatDuration(9_600), '0:10')
check('past an hour widens to h:mm:ss', formatDuration(3_725_000), '1:02:05')
check('negative clamps rather than printing -0:05', formatDuration(-5_000), '0:00')
check('NaN is survivable', formatDuration(NaN), '0:00')

check('a pace under a minute reads as seconds', formatPace(48_000), '48s')
check('a pace over a minute reads as m:ss', formatPace(72_000), '1:12')
check('exactly a minute crosses over', formatPace(60_000), '1:00')

// --------------------------------------------------------------- the budget
// R&W: 64 minutes for 54 questions. Math: 70 for 44.
check('R&W seconds a question', Math.round(SECONDS_PER_QUESTION.rw * 10) / 10, 71.1)
check('Math seconds a question', Math.round(SECONDS_PER_QUESTION.math * 10) / 10, 95.5)
check('an empty set has no budget', budgetMs([]), 0)
check('12 R&W questions', formatDuration(budgetMs(Array(12).fill('rw'))), '14:13')
check('12 Math questions', formatDuration(budgetMs(Array(12).fill('math'))), '19:05')
check(
  'a mixed set sums per question',
  budgetMs(['rw', 'math']),
  SECONDS_PER_QUESTION.rw * 1000 + SECONDS_PER_QUESTION.math * 1000,
)

// --------------------------------------------------------------- the verdict
const budget = 600_000 // 10 minutes, so the 10% band is a minute either way
check('well under budget is ahead', comparePace(400_000, budget).label, 'ahead')
check('well over budget is over', comparePace(800_000, budget).label, 'over')
check('dead on is on', comparePace(600_000, budget).label, 'on')
check('30s under is still on pace', comparePace(570_000, budget).label, 'on')
check('30s over is still on pace', comparePace(630_000, budget).label, 'on')
check('the band is exclusive at its edge', comparePace(540_000, budget).label, 'on')
check('just past the band tips over', comparePace(539_000, budget).label, 'ahead')
check('spare time is positive when you beat it', comparePace(400_000, budget).spareMs, 200_000)
check('spare time is negative when it beats you', comparePace(800_000, budget).spareMs, -200_000)

// ------------------------------------------------------------- the clock
// A fake clock and a fake visibility flag, so the pausing rules are tested
// rather than hoped for.
let t = 0
let hidden = false
const clock = () => makeLessonClock(() => t, () => hidden)

{
  const c = clock()
  c.start()
  t += 4_000
  check('a plain run banks its elapsed time', c.take(), 4_000)
}

{
  const c = clock()
  c.start()
  t += 3_000
  check('take() resets, so the next question starts at zero', c.take(), 3_000)
  t += 9_999
  check('time between questions is not charged', c.take(), 0)
}

{
  // Answer, then linger on the explanation: only the answering counts.
  const c = clock()
  c.start()
  t += 5_000
  const answering = c.take()
  t += 30_000 // reading the explanation
  c.start()   // next question appears
  t += 2_000
  check('reading the explanation is excluded', [answering, c.take()], [5_000, 2_000])
}

{
  const c = clock()
  c.start()
  t += 1_000
  c.start() // a redundant start must not restart the segment
  t += 1_000
  check('start() is idempotent while running', c.take(), 2_000)
}

{
  const c = clock()
  c.stop()
  check('stop() before any start is harmless', c.take(), 0)
}

{
  // The phone locks mid-question and comes back four hours later.
  const c = clock()
  c.start()
  t += 6_000
  hidden = true
  c.stop()
  t += 4 * 60 * 60 * 1000
  c.start() // refused while hidden
  t += 1_000
  hidden = false
  c.start()
  t += 2_000
  check('a backgrounded lesson banks only the visible time', c.take(), 8_000)
}

{
  // Twelve questions at eight seconds each, four of them interrupted.
  const c = clock()
  let totalMs = 0
  for (let i = 0; i < 12; i++) {
    c.start()
    t += 8_000
    if (i % 3 === 0) {
      hidden = true
      c.stop()
      t += 120_000 // put the phone down
      hidden = false
      c.start()
      t += 2_000
    }
    totalMs += c.take()
    t += 20_000 // reading the explanation
  }
  check('a full lesson sums to the time actually spent', totalMs, 12 * 8_000 + 4 * 2_000)
  check('and reads as a duration', formatDuration(totalMs), '1:44')
}

console.log(fail ? `\n${fail} FAILING` : '\nAll pace cases pass')
process.exit(fail ? 1 : 0)
