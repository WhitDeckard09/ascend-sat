/** Streak transitions, including freezes and calendar edge cases. */
const { advanceStreak, localDay, MAX_FREEZES } = await import('../src/engine/streak.ts')

const day = n => { const d = new Date(); d.setDate(d.getDate() + n); return localDay(d) }
const today = day(0)
const st = (streak, freezes, lastActiveDay, bestStreak = streak) =>
  ({ streak, bestStreak, freezes, lastActiveDay, daysActive: lastActiveDay ? [lastActiveDay] : [] })

let fail = 0
const check = (label, got, wantStreak, wantFreezes) => {
  const ok = got.streak === wantStreak && got.freezes === wantFreezes
  if (!ok) fail++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(44)} streak=${got.streak} freeze=${got.freezes}${ok ? '' : `   WANT ${wantStreak}/${wantFreezes}`}`)
}
const plain = (label, ok) => { if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}`) }

check('first ever lesson',                  advanceStreak(st(0, 0, null), today), 1, 0)
check('second day in a row',                advanceStreak(st(1, 0, day(-1)), today), 2, 0)
check('same day twice does not double',     advanceStreak(st(4, 0, day(0)), today), 4, 0)
check('missed one day, no freeze: reset',   advanceStreak(st(9, 0, day(-2)), today), 1, 0)
check('freeze rescues, milestone refunds',  advanceStreak(st(9, 1, day(-2)), today), 10, 1)
check('freeze rescues to a non-milestone',  advanceStreak(st(6, 1, day(-2)), today), 7, 0)
check('missed two days: reset',             advanceStreak(st(12, 2, day(-3)), today), 1, 2)
check('day 5 earns a freeze',               advanceStreak(st(4, 0, day(-1)), today), 5, 1)
check('day 10 earns another',               advanceStreak(st(9, 1, day(-1)), today), 10, 2)
check('freezes cap at 2',                   advanceStreak(st(14, 2, day(-1)), today), 15, 2)
check('rescue landing on day 5 still earns',advanceStreak(st(4, 1, day(-2)), today), 5, 1)
check('reset on day 1 does not earn',       advanceStreak(st(30, 0, day(-9)), today), 1, 0)

const broke = advanceStreak(st(12, 0, day(-5), 30), today)
plain('best streak survives a reset', broke.bestStreak === 30 && broke.streak === 1)
const same = st(3, 0, today)
plain('same-day call returns identical object', advanceStreak(same, today) === same)
plain('Feb 28 -> Mar 1 (2026) is one day', advanceStreak(st(6, 0, '2026-02-28'), '2026-03-01').streak === 7)
plain('New Year crossing is one day', advanceStreak(st(6, 0, '2025-12-31'), '2026-01-01').streak === 7)
plain('DST spring-forward night is one day', advanceStreak(st(2, 0, '2026-03-07'), '2026-03-08').streak === 3)

console.log(fail ? `\n${fail} FAILING` : `\nAll streak transitions correct (freeze cap ${MAX_FREEZES})`)
process.exit(fail ? 1 : 0)
