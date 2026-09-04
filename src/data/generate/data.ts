import type { Template } from './core'
import { mc, spr } from './core'
import { frac, num } from './rng'

const NAMES = ['Maya', 'Devin', 'Priya', 'Omar', 'Elena', 'Jonas', 'Nia', 'Rafael', 'Ingrid', 'Tomas']

export const dataTemplates: Template[] = [
  {
    key: 'g-psd-pct1', domain: 'problem-solving-data', skill: 'percentages', difficulty: 1,
    build: (r) => {
      const pct = r.pick([5, 10, 15, 20, 25, 30, 40, 60, 75, 80])
      const base = r.int(4, 60) * 20
      const ans = (base * pct) / 100
      if (!Number.isInteger(ans)) return null
      return mc(r, {
        prompt: `What is ${pct}% of ${num(base)}?`,
        correct: num(ans),
        wrong: [num(ans / 10), num(ans * 10), num(base - ans), num((base * (100 - pct)) / 100)],
        explanation: `${pct}% means ${num(pct / 100)}, and ${num(pct / 100)} × ${num(base)} = ${num(ans)}.`,
        trap: 'Slipping a decimal place is the usual error — check the magnitude against a friendly benchmark like 10%.',
      })
    },
  },
  {
    key: 'g-psd-pct2', domain: 'problem-solving-data', skill: 'percentages', difficulty: 1,
    build: (r) => {
      const from = r.int(2, 25) * 4
      const pct = r.pick([10, 20, 25, 50, 75])
      const dir = r.pick(['increased', 'decreased'] as const)
      const to = dir === 'increased' ? from * (1 + pct / 100) : from * (1 - pct / 100)
      if (!Number.isInteger(to)) return null
      const thing = r.pick(['the price of a jacket', 'a club’s membership', 'a route’s ridership', 'a farm’s yield'])
      return mc(r, {
        prompt: `${thing[0].toUpperCase() + thing.slice(1)} ${dir} from ${num(from)} to ${num(to)}. What was the percent ${dir === 'increased' ? 'increase' : 'decrease'}?`,
        correct: `${pct}%`,
        wrong: [`${num(Math.round((Math.abs(to - from) / to) * 100))}%`, `${num(100 - pct)}%`, `${num(pct * 2)}%`, `${num(Math.abs(to - from))}%`],
        explanation: `Percent change = (change ÷ original) × 100 = (${num(Math.abs(to - from))} ÷ ${num(from)}) × 100 = ${pct}%.`,
        trap: 'Dividing by the new value instead of the original is the classic mistake.',
      })
    },
  },
  {
    key: 'g-psd-pct3', domain: 'problem-solving-data', skill: 'percentages', difficulty: 2,
    build: (r) => {
      const pct = r.pick([10, 20, 25, 30, 40])
      const after = r.int(3, 40) * 30
      const before = after / (1 - pct / 100)
      if (!Number.isInteger(before)) return null
      const thing = r.pick(['the population of a town', 'a store’s monthly orders', 'a lake’s fish count', 'a school’s enrolment'])
      return spr({
        prompt: `After a ${pct}% decrease, ${thing} is ${num(after)}. What was it before the decrease?`,
        accepted: [String(before)],
        explanation: `A ${pct}% decrease leaves ${100 - pct}% of the original, so ${num((100 - pct) / 100)}p = ${num(after)} and p = ${num(after)} ÷ ${num((100 - pct) / 100)} = ${num(before)}.`,
        trap: `Adding ${pct}% back to ${num(after)} does not undo the decrease, because the percentage applies to a different base.`,
      })
    },
  },
  {
    key: 'g-psd-pct4', domain: 'problem-solving-data', skill: 'percentages', difficulty: 3,
    build: (r) => {
      const up = r.pick([10, 20, 25, 30, 50])
      const down = r.pick([10, 20, 25, 30, 50])
      const net = Math.round((1 + up / 100) * (1 - down / 100) * 10000) / 100 - 100
      if (Math.abs(net) < 0.5) return null
      const word = net > 0 ? 'higher' : 'lower'
      return mc(r, {
        prompt: `A stock rises ${up}% one year and then falls ${down}% the next. Compared with its starting value, its value after two years is`,
        correct: `${num(Math.abs(Math.round(net * 100) / 100))}% ${word}.`,
        wrong: ['unchanged.', `${num(Math.abs(up - down))}% ${up > down ? 'higher' : 'lower'}.`, `${num(up + down)}% higher.`, `${num(Math.abs(Math.round(net * 100) / 100))}% ${net > 0 ? 'lower' : 'higher'}.`],
        explanation: `Multiply the factors: ${num(1 + up / 100)} × ${num(1 - down / 100)} = ${num(Math.round((1 + up / 100) * (1 - down / 100) * 10000) / 10000)}, which is ${num(Math.abs(Math.round(net * 100) / 100))}% ${word} than the start.`,
        trap: 'Percent changes multiply rather than add, because the second one applies to the already-changed value.',
      })
    },
  },
  {
    key: 'g-psd-ratio1', domain: 'problem-solving-data', skill: 'ratios-rates-units', difficulty: 1,
    build: (r) => {
      const a = r.int(1, 7), b = r.int(1, 7)
      if (a === b) return null
      const k = r.int(3, 15)
      const total = (a + b) * k
      const colors = r.shuffle(['red', 'blue', 'green', 'yellow', 'white'])
      return spr({
        prompt: `The ratio of ${colors[0]} marbles to ${colors[1]} marbles in a jar is ${a} to ${b}. If there are ${total} marbles in total and every marble is ${colors[0]} or ${colors[1]}, how many are ${colors[0]}?`,
        accepted: [String(a * k)],
        explanation: `The ratio has ${a} + ${b} = ${a + b} parts, so each part is ${total} ÷ ${a + b} = ${k} marbles. The ${colors[0]} share is ${a} parts: ${a} × ${k} = ${a * k}.`,
      })
    },
  },
  {
    key: 'g-psd-ratio2', domain: 'problem-solving-data', skill: 'ratios-rates-units', difficulty: 1,
    build: (r) => {
      const rate = r.int(2, 30) * 5, hours = r.int(2, 9)
      const dist = rate * hours
      return mc(r, {
        prompt: `A train travels ${num(dist)} kilometres in ${hours} hours at a constant speed. What is its speed, in kilometres per hour?`,
        correct: num(rate),
        wrong: [num(dist * hours), num(dist - hours), num(Math.round(dist / (hours + 1))), num(rate * 2)],
        explanation: `Speed = distance ÷ time = ${num(dist)} ÷ ${hours} = ${num(rate)} kilometres per hour.`,
        trap: 'Multiplying rather than dividing gives a number far too large to be a speed here.',
      })
    },
  },
  {
    key: 'g-psd-ratio3', domain: 'problem-solving-data', skill: 'ratios-rates-units', difficulty: 2,
    build: (r) => {
      const perMin = r.int(6, 40), mins = r.pick([90, 120, 150, 180, 210, 240])
      const total = perMin * mins
      const hrs = mins / 60
      return mc(r, {
        prompt: `A machine produces ${perMin} parts per minute. At this rate, how many parts does it produce in ${num(hrs)} hours?`,
        correct: num(total),
        wrong: [num(perMin * hrs), num(total / 10), num(perMin * 60), num(total * 10)],
        explanation: `${num(hrs)} hours is ${mins} minutes, and ${perMin} × ${mins} = ${num(total)} parts.`,
        trap: 'Multiplying by the hours instead of the minutes drops a factor of 60.',
      })
    },
  },
  {
    key: 'g-psd-ratio4', domain: 'problem-solving-data', skill: 'ratios-rates-units', difficulty: 2,
    build: (r) => {
      const a = r.int(2, 9), b = r.int(2, 12), k = r.int(2, 9)
      const x = a * k, d = b * k
      return spr({
        prompt: `If ${a}/${b} = x/${d}, what is the value of x?`,
        accepted: [String(x)],
        explanation: `Cross-multiply: ${a} × ${d} = ${b}x, so ${num(a * d)} = ${b}x and x = ${num(x)}.`,
      })
    },
  },
  {
    key: 'g-psd-data1', domain: 'problem-solving-data', skill: 'one-var-data', difficulty: 1,
    build: (r) => {
      const vals = Array.from({ length: 5 }, () => r.int(2, 40))
      const sorted = [...vals].sort((p, q) => p - q)
      if (new Set(vals).size !== 5) return null
      return spr({
        prompt: `What is the median of the data set ${vals.join(', ')}?`,
        accepted: [String(sorted[2])],
        explanation: `Order the values: ${sorted.join(', ')}. With five values the median is the third one, ${sorted[2]}.`,
        trap: 'The median is the middle of the *ordered* list — reading the middle of the list as given is the usual slip.',
      })
    },
  },
  {
    key: 'g-psd-data2', domain: 'problem-solving-data', skill: 'one-var-data', difficulty: 2,
    build: (r) => {
      const n = r.pick([4, 5, 6])
      const mean = r.int(5, 40)
      const others = Array.from({ length: n - 1 }, () => r.int(2, 60))
      const missing = mean * n - others.reduce((s, v) => s + v, 0)
      if (missing < 1 || missing > 99) return null
      return spr({
        prompt: `The mean of ${n} numbers is ${mean}. ${n - 1} of the numbers are ${others.join(', ')}. What is the remaining number?`,
        accepted: [String(missing)],
        explanation: `The ${n} numbers total ${n} × ${mean} = ${num(n * mean)}. The given numbers sum to ${num(others.reduce((s, v) => s + v, 0))}, so the last is ${num(n * mean)} − ${num(others.reduce((s, v) => s + v, 0))} = ${missing}.`,
      })
    },
  },
  {
    key: 'g-psd-data3', domain: 'problem-solving-data', skill: 'one-var-data', difficulty: 3,
    build: (r) => {
      const n1 = r.int(10, 30), n2 = r.int(10, 30)
      const m1 = r.int(60, 80), m2 = r.int(80, 95)
      const total = n1 * m1 + n2 * m2
      const combined = total / (n1 + n2)
      if (!Number.isInteger(combined)) return null
      return spr({
        prompt: `A class of ${n1} students has a mean score of ${m1}. A class of ${n2} students has a mean score of ${m2}. What is the mean score of all ${n1 + n2} students?`,
        accepted: [String(combined)],
        explanation: `Work with totals, not the average of the averages: ${n1}(${m1}) + ${n2}(${m2}) = ${num(n1 * m1)} + ${num(n2 * m2)} = ${num(total)}. Then ${num(total)} ÷ ${n1 + n2} = ${num(combined)}.`,
        trap: `Averaging ${m1} and ${m2} directly only works when the two groups are the same size.`,
      })
    },
  },
  {
    key: 'g-psd-prob1', domain: 'problem-solving-data', skill: 'probability', difficulty: 1,
    build: (r) => {
      const a = r.int(2, 12), b = r.int(2, 12), c = r.int(2, 12)
      const total = a + b + c
      const colors = r.shuffle(['green', 'yellow', 'white', 'black', 'orange'])
      return mc(r, {
        prompt: `A bag contains ${a} ${colors[0]} chips, ${b} ${colors[1]} chips, and ${c} ${colors[2]} chips. If one chip is selected at random, what is the probability that it is ${colors[1]}?`,
        correct: frac(b, total),
        wrong: [frac(b, a + b), frac(a, total), frac(c, total), frac(total, b)],
        explanation: `There are ${a} + ${b} + ${c} = ${total} chips in all, and ${b} are ${colors[1]}, so the probability is ${frac(b, total)}.`,
        trap: 'Using a partial count as the denominator is the most common error here.',
      })
    },
  },
  {
    key: 'g-psd-prob2', domain: 'problem-solving-data', skill: 'probability', difficulty: 2,
    build: (r) => {
      const aPass = r.int(20, 60), aFail = r.int(10, 40)
      const bPass = r.int(20, 60), bFail = r.int(10, 40)
      const aTot = aPass + aFail, bTot = bPass + bFail
      const passTot = aPass + bPass
      const given = r.pick(['group', 'outcome'] as const)
      const table = {
        headers: ['', 'Passed', 'Failed', 'Total'],
        rows: [
          ['Group A', String(aPass), String(aFail), String(aTot)],
          ['Group B', String(bPass), String(bFail), String(bTot)],
          ['Total', String(passTot), String(aFail + bFail), String(aTot + bTot)],
        ],
      }
      const v = given === 'group'
        ? mc(r, {
            prompt: 'The table shows results for a group of participants. If a participant is selected at random from Group A, what is the probability that they passed?',
            correct: frac(aPass, aTot),
            wrong: [frac(aPass, passTot), frac(passTot, aTot + bTot), frac(aFail, aTot), frac(aPass, aTot + bTot)],
            explanation: `The condition restricts you to Group A's ${aTot} participants, of whom ${aPass} passed: ${frac(aPass, aTot)}.`,
            trap: 'The overall pass rate ignores the condition and uses the wrong denominator.',
          })
        : mc(r, {
            prompt: 'The table shows results for a group of participants. If a participant who passed is selected at random, what is the probability that they were in Group A?',
            correct: frac(aPass, passTot),
            wrong: [frac(aPass, aTot), frac(passTot, aTot + bTot), frac(bPass, passTot), frac(aPass, aTot + bTot)],
            explanation: `Now the condition restricts you to the ${passTot} participants who passed, ${aPass} of whom were in Group A: ${frac(aPass, passTot)}.`,
            trap: '"Given Group A, passed" and "given passed, Group A" have different denominators — read which one is fixed.',
          })
      return v ? { ...v, table } : null
    },
  },
  {
    key: 'g-psd-two1', domain: 'problem-solving-data', skill: 'two-var-data', difficulty: 2,
    build: (r) => {
      const m = r.int(2, 9) + r.pick([0, 0.5]), b = r.int(30, 70)
      const xLabel = r.pick(['hours studied', 'weeks of training', 'minutes of practice'])
      const yLabel = r.pick(['test score', 'race time improvement', 'accuracy percentage'])
      return mc(r, {
        prompt: `A line of best fit for a scatterplot relating ${xLabel} x to ${yLabel} y is given by y = ${num(m)}x + ${b}. Which statement best interprets the slope?`,
        correct: `For each additional unit of ${xLabel}, the predicted ${yLabel} increases by about ${num(m)}.`,
        wrong: [
          `A value of zero for ${xLabel} predicts a ${yLabel} of about ${num(m)}.`,
          `For each additional unit of ${yLabel}, the predicted ${xLabel} increases by about ${num(m)}.`,
          `The average ${yLabel} in the data set is ${num(m)}.`,
          `The predicted ${yLabel} is always ${num(m)} times ${b}.`,
        ],
        explanation: `In y = mx + b the slope m is the predicted change in y per one-unit increase in x, so each extra unit predicts about ${num(m)} more.`,
        trap: `The intercept, ${b}, is what a value of zero predicts — not the slope.`,
      })
    },
  },
  {
    key: 'g-psd-inf1', domain: 'problem-solving-data', skill: 'inference-margin', difficulty: 2,
    build: (r) => {
      const n = r.pick([200, 300, 400, 500, 800, 1000])
      const pct = r.int(45, 75), moe = r.pick([2, 3, 4, 5])
      const topic = r.pick(['support a proposal', 'own a bicycle', 'read a newspaper weekly', 'commute by transit'])
      return mc(r, {
        prompt: `A random sample of ${n} residents found that ${pct}% ${topic}, with a margin of error of ${moe} percentage points at a 95% confidence level. Which conclusion is best supported?`,
        correct: `It is plausible that between ${pct - moe}% and ${pct + moe}% of all residents ${topic}.`,
        wrong: [
          `Exactly ${pct}% of all residents ${topic}.`,
          `Between ${pct - moe}% and ${pct + moe}% of the ${n} sampled residents ${topic}.`,
          `At least ${pct + moe}% of all residents ${topic}.`,
          `Fewer than ${pct - moe}% of all residents ${topic}.`,
        ],
        explanation: `A margin of error gives a plausible interval for the *population* value: ${pct}% ± ${moe}% is ${pct - moe}% to ${pct + moe}%.`,
        trap: `${pct}% is the exact figure for the sample; the interval describes the wider population.`,
      })
    },
  },
  {
    key: 'g-psd-inf2', domain: 'problem-solving-data', skill: 'inference-margin', difficulty: 3,
    build: (r) => {
      const place = r.pick([
        { at: 'leaving a public library', trait: 'read at least one book a month', skew: 'readers' },
        { at: 'leaving a gym', trait: 'exercise daily', skew: 'people who exercise' },
        { at: 'at a farmers market', trait: 'cook most meals at home', skew: 'people who cook' },
        { at: 'outside a concert hall', trait: 'attend live music monthly', skew: 'concertgoers' },
      ])
      const pct = r.int(60, 90)
      const who = r.pick(NAMES)
      return mc(r, {
        prompt: `${who} surveys people ${place.at} and finds that ${pct}% ${place.trait}. ${who} wants to generalize this to all adults in the city. What is the most serious problem with this design?`,
        correct: 'The sample was not randomly selected from the population the survey aims to describe.',
        wrong: [
          'The sample size is too small to support any conclusion.',
          'A margin of error was not reported alongside the result.',
          'The survey should have been conducted on more than one day.',
          'The percentage should have been reported as a fraction.',
        ],
        explanation: `People ${place.at} are far more likely to be ${place.skew} than the general adult population. No sample size or margin of error can repair a sample drawn from the wrong population.`,
        trap: 'The other options name real limitations, but each is secondary — fixing them still leaves you describing the wrong group.',
      })
    },
  },
]
