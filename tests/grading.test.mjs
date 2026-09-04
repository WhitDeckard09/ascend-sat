/** Student-produced-response grading: every form the real test accepts. */
const { isSprCorrect } = await import('../src/engine/answers.ts')

const cases = [
  ['13', ['13'], true],
  [' 13 ', ['13'], true],
  ['+13', ['13'], true],
  ['13.0', ['13'], true],
  ['1/2', ['1/2', '0.5'], true],
  ['0.5', ['1/2'], true],
  ['.5', ['1/2'], true],
  ['2/4', ['1/2'], true],
  ['-3', ['-3'], true],
  ['−3', ['-3'], true],            // unicode minus, as a phone keyboard emits
  ['-3', ['−3'], true],            // accepted list written with unicode minus
  ['2/245', ['2/245'], true],
  ['0.0081632', ['2/245'], true],  // decimal form of the fraction
  ['-1', ['−1'], true],
  ['14', ['13'], false],
  ['', ['13'], false],
  ['   ', ['13'], false],
  ['abc', ['13'], false],
  ['1/0', ['13'], false],
  ['0.6', ['1/2'], false],
  ['13', ['-13'], false],
]

let fail = 0
for (const [input, accepted, expected] of cases) {
  const got = isSprCorrect(input, accepted)
  const ok = got === expected
  if (!ok) fail++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${JSON.stringify(input).padEnd(13)} vs ${JSON.stringify(accepted).padEnd(16)} => ${String(got).padEnd(5)}${ok ? '' : ` EXPECTED ${expected}`}`)
}
console.log(fail ? `\n${fail} FAILING` : '\nAll grading cases pass')
process.exit(fail ? 1 : 0)
