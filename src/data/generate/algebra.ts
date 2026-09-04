import type { Template } from './core'
import { mc, spr } from './core'
import { coef, frac, num, signed } from './rng'

const NAMES = ['Maya', 'Devin', 'Priya', 'Omar', 'Elena', 'Jonas', 'Nia', 'Rafael', 'Ingrid', 'Tomas', 'Aisha', 'Hugo']
const ITEMS = [
  { thing: 'notebook', plural: 'notebooks' },
  { thing: 'ticket', plural: 'tickets' },
  { thing: 'poster', plural: 'posters' },
  { thing: 'sticker sheet', plural: 'sticker sheets' },
  { thing: 'seedling', plural: 'seedlings' },
  { thing: 'zine', plural: 'zines' },
]

export const algebraTemplates: Template[] = [
  // ------------------------------------------------ linear equations, one variable
  {
    key: 'g-alg-lin1', domain: 'algebra', skill: 'linear-one-var', difficulty: 1,
    build: (r) => {
      const a = r.int(2, 9), x = r.signed(2, 12), b = r.signed(3, 20)
      const c = a * x + b
      return mc(r, {
        prompt: `If ${coef(a)} ${signed(b)} = ${num(c)}, what is the value of x?`,
        correct: num(x),
        wrong: [num(c - b), num((c + b) / a), num(c / a), num(x + 1), num(-x)],
        explanation: `Subtract ${num(b)} from both sides to get ${coef(a)} = ${num(c - b)}, then divide by ${a}: x = ${num(x)}.`,
        trap: `Dividing before undoing the ${num(b)} is the usual slip — isolate the x-term first.`,
      })
    },
  },
  {
    key: 'g-alg-lin2', domain: 'algebra', skill: 'linear-one-var', difficulty: 1,
    build: (r) => {
      const a = r.int(2, 8), x = r.signed(2, 14), b = r.signed(2, 12)
      const c = a * (x + b)
      return spr({
        prompt: `If ${a}(x ${signed(b)}) = ${num(c)}, what is the value of x?`,
        accepted: [String(x)],
        explanation: `Divide both sides by ${a}: x ${signed(b)} = ${num(c / a)}. Then x = ${num(c / a)} ${signed(-b)} = ${num(x)}.`,
      })
    },
  },
  {
    key: 'g-alg-lin3', domain: 'algebra', skill: 'linear-one-var', difficulty: 2,
    build: (r) => {
      const a = r.int(3, 9), c = r.int(2, 8)
      if (a === c) return null
      const x = r.signed(2, 11), b = r.signed(2, 15)
      const d = (a - c) * x + b
      return spr({
        prompt: `If ${coef(a)} ${signed(b)} = ${coef(c)} ${signed(d)}, what is the value of x?`,
        accepted: [String(x)],
        explanation: `Subtract ${coef(c)} from both sides: ${coef(a - c)} ${signed(b)} = ${num(d)}. Then ${coef(a - c)} = ${num(d - b)}, so x = ${num(x)}.`,
      })
    },
  },
  {
    key: 'g-alg-lin4', domain: 'algebra', skill: 'linear-one-var', difficulty: 1,
    build: (r) => {
      const a = r.int(2, 9), k = r.signed(2, 12), b = r.signed(2, 15)
      const x = a * k, c = k + b
      return spr({
        prompt: `If x/${a} ${signed(b)} = ${num(c)}, what is the value of x?`,
        accepted: [String(x)],
        explanation: `Subtract ${num(b)}: x/${a} = ${num(k)}. Multiply both sides by ${a}: x = ${num(x)}.`,
      })
    },
  },
  {
    key: 'g-alg-lin5', domain: 'algebra', skill: 'linear-one-var', difficulty: 2,
    build: (r) => {
      const forms = [
        { eq: 'P = 2l + 2w', target: 'w', sol: 'w = (P − 2l)/2', bad: ['w = P − 2l', 'w = P/2 − l/2', 'w = 2P − l'] },
        { eq: 'A = (1/2)bh', target: 'b', sol: 'b = 2A/h', bad: ['b = A/(2h)', 'b = 2Ah', 'b = h/(2A)'] },
        { eq: 'C = 2πr', target: 'r', sol: 'r = C/(2π)', bad: ['r = 2πC', 'r = C/π', 'r = 2C/π'] },
        { eq: 'V = lwh', target: 'h', sol: 'h = V/(lw)', bad: ['h = Vlw', 'h = V/l − w', 'h = lw/V'] },
        { eq: 'y = mx + b', target: 'm', sol: 'm = (y − b)/x', bad: ['m = y − b − x', 'm = (y + b)/x', 'm = x/(y − b)'] },
        { eq: 'F = (9/5)C + 32', target: 'C', sol: 'C = (5/9)(F − 32)', bad: ['C = (9/5)(F − 32)', 'C = (5/9)F − 32', 'C = (F − 32)/32'] },
      ]
      const f = r.pick(forms)
      return mc(r, {
        prompt: `The equation ${f.eq} is given. Which equation correctly gives ${f.target} in terms of the other variables?`,
        correct: f.sol,
        wrong: f.bad,
        explanation: `Undo the operations applied to ${f.target}, one at a time and in reverse order, doing the same thing to both sides. That gives ${f.sol}.`,
        trap: 'Watch for choices that divide where they should multiply, or that only partly undo the arithmetic.',
      })
    },
  },

  // ---------------------------------------------------------- linear functions
  {
    key: 'g-alg-fn1', domain: 'algebra', skill: 'linear-functions', difficulty: 1,
    build: (r) => {
      const m = r.signed(2, 9), b = r.signed(2, 15), k = r.signed(2, 8)
      const y = m * k + b
      return mc(r, {
        prompt: `The function f is defined by f(x) = ${coef(m)} ${signed(b)}. What is the value of f(${num(k)})?`,
        correct: num(y),
        wrong: [num(m * k), num(m + k + b), num(m * (k + b)), num(y + b), num(-y)],
        explanation: `Substitute ${num(k)} for x: f(${num(k)}) = ${num(m)}(${num(k)}) ${signed(b)} = ${num(m * k)} ${signed(b)} = ${num(y)}.`,
        trap: `Choice ${num(m * k)} stops before adding the constant term.`,
      })
    },
  },
  {
    key: 'g-alg-fn2', domain: 'algebra', skill: 'linear-functions', difficulty: 1,
    build: (r) => {
      const fee = r.int(2, 12) * 5, rate = r.int(2, 15), n = r.pick(['n', 't', 'h'])
      const ctx = r.pick([
        { setup: `A studio charges a $${fee} registration fee plus $${rate} for each class`, unit: 'classes', v: n },
        { setup: `A tool library charges a $${fee} membership plus $${rate} per rental`, unit: 'rentals', v: n },
        { setup: `A kiln charges a $${fee} firing fee plus $${rate} per piece`, unit: 'pieces', v: n },
      ])
      return mc(r, {
        prompt: `${ctx.setup}. Which function gives the total cost C, in dollars, for ${ctx.unit} ${ctx.v}?`,
        correct: `C(${ctx.v}) = ${rate}${ctx.v} + ${fee}`,
        wrong: [`C(${ctx.v}) = ${fee}${ctx.v} + ${rate}`, `C(${ctx.v}) = ${fee + rate}${ctx.v}`, `C(${ctx.v}) = ${fee} + ${rate}`, `C(${ctx.v}) = ${rate}${ctx.v} − ${fee}`],
        explanation: `The $${rate} charge repeats once per unit, so it multiplies ${ctx.v}; the $${fee} is charged once, so it is the constant. That gives C(${ctx.v}) = ${rate}${ctx.v} + ${fee}.`,
        trap: `Attaching the one-time fee to ${ctx.v} is the standard error — ask which number repeats.`,
      })
    },
  },
  {
    key: 'g-alg-fn3', domain: 'algebra', skill: 'linear-functions', difficulty: 2,
    build: (r) => {
      const m = r.signed(2, 7), b = r.signed(1, 12)
      const x0 = r.int(1, 4), step = r.int(2, 4)
      const xs = [x0, x0 + step, x0 + 2 * step]
      const ys = xs.map((x) => m * x + b)
      const v = mc(r, {
        prompt: 'The table gives values of the linear function h. What is the value of h(0)?',
        correct: num(b),
        wrong: [num(ys[0] - m), num(b + m), num(m), num(ys[0]), num(-b)],
        explanation: `The slope is (${num(ys[1])} − ${num(ys[0])})/(${xs[1]} − ${xs[0]}) = ${num(m)}. Stepping back from x = ${xs[0]} to x = 0 removes ${xs[0]} slopes: ${num(ys[0])} − ${num(m * x0)} = ${num(b)}.`,
        trap: 'Stepping back a single slope instead of all the way to x = 0 is the common miss.',
      })
      if (!v) return null
      return { ...v, table: { headers: ['x', 'h(x)'], rows: xs.map((x, i) => [String(x), num(ys[i])]) } }
    },
  },
  {
    key: 'g-alg-fn4', domain: 'algebra', skill: 'linear-functions', difficulty: 3,
    build: (r) => {
      const m = r.signed(2, 6), b = r.signed(1, 10)
      const p = r.int(1, 5), q = p + r.int(2, 5), t = q + r.int(2, 6)
      return spr({
        prompt: `The function f is linear. If f(${p}) = ${num(m * p + b)} and f(${q}) = ${num(m * q + b)}, what is the value of f(${t})?`,
        accepted: [String(m * t + b)],
        explanation: `The slope is (${num(m * q + b)} − ${num(m * p + b)})/(${q} − ${p}) = ${num(m)}. From x = ${q} to x = ${t} is ${t - q} more steps, so f(${t}) = ${num(m * q + b)} + ${t - q}(${num(m)}) = ${num(m * t + b)}.`,
      })
    },
  },

  // ------------------------------------------------ linear equations, two variables
  {
    key: 'g-alg-2v1', domain: 'algebra', skill: 'linear-two-var', difficulty: 1,
    build: (r) => {
      const x1 = r.signed(1, 8), y1 = r.signed(1, 10)
      const dx = r.int(2, 6), m = r.signed(1, 5)
      const x2 = x1 + dx, y2 = y1 + m * dx
      return mc(r, {
        prompt: `What is the slope of the line passing through the points (${num(x1)}, ${num(y1)}) and (${num(x2)}, ${num(y2)})?`,
        correct: num(m),
        wrong: [num(-m), frac(dx, m * dx || 1), num(m * dx), num(y2 - y1), num(m + 1)],
        explanation: `Slope = (${num(y2)} − ${num(y1)})/(${num(x2)} − ${num(x1)}) = ${num(y2 - y1)}/${num(dx)} = ${num(m)}.`,
        trap: 'Subtracting the coordinates in a different order on the top and the bottom flips the sign.',
      })
    },
  },
  {
    key: 'g-alg-2v2', domain: 'algebra', skill: 'linear-two-var', difficulty: 2,
    build: (r) => {
      const m = r.signed(2, 5), x1 = r.signed(1, 6), y1 = r.signed(1, 9)
      const b = y1 - m * x1
      const line = (mm: number, bb: number) => `y = ${coef(mm)} ${signed(bb)}`
      return mc(r, {
        prompt: `Line k has slope ${num(m)} and passes through the point (${num(x1)}, ${num(y1)}). Which equation represents line k?`,
        correct: line(m, b),
        wrong: [line(m, y1 + m * x1), line(-m, b), line(m, y1), line(m, -b)],
        explanation: `Use point-slope: y − ${num(y1)} = ${num(m)}(x − ${num(x1)}). Distributing gives y = ${coef(m)} ${signed(-m * x1)} ${signed(y1)}, so y = ${coef(m)} ${signed(b)}.`,
        trap: `Sign errors when distributing ${num(m)} over (x − ${num(x1)}) produce most of the wrong intercepts here.`,
      })
    },
  },
  {
    key: 'g-alg-2v3', domain: 'algebra', skill: 'linear-two-var', difficulty: 2,
    build: (r) => {
      const a = r.int(2, 7), b = r.signed(2, 7), k = r.int(1, 6)
      const c = a * k * b === 0 ? null : a * b * k
      if (c === null) return null
      const which = r.pick(['x', 'y'] as const)
      const xInt = frac(c, a), yInt = frac(c, b)
      return mc(r, {
        prompt: `In the xy-plane, what is the ${which}-intercept of the graph of ${coef(a)} ${signed(b)}y = ${num(c)}?`,
        correct: which === 'x' ? `(${xInt}, 0)` : `(0, ${yInt})`,
        wrong: [
          which === 'x' ? `(0, ${yInt})` : `(${xInt}, 0)`,
          which === 'x' ? `(${frac(-c, a)}, 0)` : `(0, ${frac(-c, b)})`,
          which === 'x' ? `(${frac(c, b)}, 0)` : `(0, ${frac(c, a)})`,
          `(${num(a)}, ${num(b)})`,
        ],
        explanation: `Set ${which === 'x' ? 'y' : 'x'} = 0. That leaves ${which === 'x' ? `${coef(a)} = ${num(c)}, so x = ${xInt}` : `${coef(b, 'y')} = ${num(c)}, so y = ${yInt}`}.`,
        trap: 'Setting the wrong variable to zero gives the other intercept, which is always among the choices.',
      })
    },
  },
  {
    key: 'g-alg-2v4', domain: 'algebra', skill: 'linear-two-var', difficulty: 2,
    build: (r) => {
      const p = r.int(2, 6), q = r.int(2, 6)
      if (p === q) return null
      const rel = r.pick(['parallel', 'perpendicular'] as const)
      const slope = `${p}/${q}`
      const par = `${p}/${q}`, perp = `−${q}/${p}`
      return mc(r, {
        prompt: `Line m has slope ${slope}. What is the slope of a line ${rel} to line m?`,
        correct: rel === 'parallel' ? par : perp,
        wrong: [rel === 'parallel' ? perp : par, `${q}/${p}`, `−${p}/${q}`, `${p * q}`],
        explanation: rel === 'parallel'
          ? `Parallel lines have equal slopes, so the slope is ${par}.`
          : `Perpendicular slopes are negative reciprocals: flip ${slope} to ${q}/${p} and change the sign, giving ${perp}.`,
        trap: rel === 'perpendicular'
          ? 'Flipping the fraction without changing the sign is the classic miss.'
          : 'The negative reciprocal belongs to a perpendicular line, not a parallel one.',
      })
    },
  },
  {
    key: 'g-alg-2v5', domain: 'algebra', skill: 'linear-two-var', difficulty: 3,
    build: (r) => {
      const a = r.int(2, 6), b = r.signed(2, 6), v = r.signed(3, 15), k = r.int(2, 5)
      return spr({
        prompt: `If ${coef(a)} ${signed(b)}y = ${num(v)}, what is the value of ${coef(a * k)} ${signed(b * k)}y?`,
        accepted: [String(v * k)],
        explanation: `Notice that ${coef(a * k)} ${signed(b * k)}y is exactly ${k} times ${coef(a)} ${signed(b)}y. Since that expression equals ${num(v)}, the value is ${k}(${num(v)}) = ${num(v * k)}. You never need x or y separately.`,
      })
    },
  },
  {
    key: 'g-alg-2v6', domain: 'algebra', skill: 'linear-two-var', difficulty: 3,
    build: (r) => {
      const x1 = r.signed(2, 7), y1 = r.signed(2, 10)
      const dx = r.int(2, 5), m = r.signed(1, 4)
      const x2 = x1 + 2 * dx, y2 = y1 + m * 2 * dx
      const xq = x1 + dx, yq = y1 + m * dx
      return spr({
        prompt: `Line ℓ passes through (${num(x1)}, ${num(y1)}) and (${num(x2)}, ${num(y2)}). What is the y-coordinate of the point on line ℓ where x = ${num(xq)}?`,
        accepted: [String(yq)],
        explanation: `The slope is (${num(y2)} − ${num(y1)})/(${num(x2)} − ${num(x1)}) = ${num(m)}. Moving ${dx} units right from x = ${num(x1)} changes y by ${dx}(${num(m)}) = ${num(m * dx)}, so y = ${num(y1)} ${signed(m * dx)} = ${num(yq)}.`,
      })
    },
  },

  // ----------------------------------------------------------------- systems
  {
    key: 'g-alg-sys1', domain: 'algebra', skill: 'systems', difficulty: 1,
    build: (r) => {
      const x = r.signed(1, 9), y = r.signed(1, 9)
      const s = x + y, d = x - y
      const want = r.pick(['x', 'y'] as const)
      return mc(r, {
        prompt: `If x + y = ${num(s)} and x − y = ${num(d)}, what is the value of ${want}?`,
        correct: num(want === 'x' ? x : y),
        wrong: [num(want === 'x' ? y : x), num(s), num(d), num(s + d), num(-(want === 'x' ? x : y))],
        explanation: `Adding the two equations gives 2x = ${num(s + d)}, so x = ${num(x)}; substituting back gives y = ${num(y)}. The question asks for ${want} = ${num(want === 'x' ? x : y)}.`,
        trap: 'Solving correctly and then reporting the other variable is the most common way to lose this one.',
      })
    },
  },
  {
    key: 'g-alg-sys2', domain: 'algebra', skill: 'systems', difficulty: 2,
    build: (r) => {
      const m = r.signed(2, 4), c = r.signed(1, 6)
      const x = r.signed(1, 6), y = m * x + c
      const p = r.int(2, 5), q = p * x + y
      return spr({
        prompt: `If y = ${coef(m)} ${signed(c)} and ${coef(p)} + y = ${num(q)}, what is the value of x + y?`,
        accepted: [String(x + y)],
        explanation: `Substitute the first equation into the second: ${coef(p)} + ${coef(m)} ${signed(c)} = ${num(q)}, so ${coef(p + m)} = ${num(q - c)} and x = ${num(x)}. Then y = ${num(y)}, and x + y = ${num(x + y)}.`,
      })
    },
  },
  {
    key: 'g-alg-sys3', domain: 'algebra', skill: 'systems', difficulty: 3,
    build: (r) => {
      const cheap = r.int(2, 6), dear = cheap + r.int(2, 7)
      const nCheap = r.int(4, 20), nDear = r.int(4, 20)
      const total = nCheap + nDear, money = cheap * nCheap + dear * nDear
      const item = r.pick(ITEMS)
      const who = r.pick(NAMES)
      return mc(r, {
        prompt: `${who} sells small ${item.plural} for $${cheap} and large ${item.plural} for $${dear}. In one day ${who} sold ${total} ${item.plural} in total and collected $${money}. How many large ${item.plural} were sold?`,
        correct: String(nDear),
        wrong: [String(nCheap), String(total - nDear - 1), String(Math.round(money / dear)), String(nDear + 2)],
        explanation: `Let L be the number of large ${item.plural}, so small ones number ${total} − L. Then ${cheap}(${total} − L) + ${dear}L = ${money}, giving ${num(cheap * total)} + ${num(dear - cheap)}L = ${money}, so L = ${nDear}.`,
        trap: `Choice ${nCheap} is the number of small ${item.plural} — solve for the one the question actually asks about.`,
      })
    },
  },
  {
    key: 'g-alg-sys4', domain: 'algebra', skill: 'systems', difficulty: 3,
    build: (r) => {
      const a = r.int(2, 6), b = r.int(2, 6), k = r.int(2, 4)
      const c = r.int(3, 20)
      const kind = r.pick(['none', 'infinite'] as const)
      return spr({
        prompt: kind === 'infinite'
          ? `The system ${coef(a)} + ${coef(b, 'y')} = ${c} and ${coef(a * k)} + ${coef(b * k, 'y')} = m has infinitely many solutions. What is the value of m?`
          : `The system ${coef(a)} + ${coef(b, 'y')} = ${c} and ${coef(a * k)} + ${coef(b, 'y')}·n = ${c * k + 1} has no solution, where n is a constant. What is the value of n?`,
        accepted: [String(kind === 'infinite' ? c * k : k)],
        explanation: kind === 'infinite'
          ? `Infinitely many solutions means the two equations describe the same line. The second left side is exactly ${k} times the first, so the right side must be too: m = ${k}(${c}) = ${c * k}.`
          : `No solution means the lines are parallel: the coefficients are proportional but the constants are not. The x-coefficients scale by ${a * k}/${a} = ${k}, so the y-coefficients must as well, giving n = ${k}.`,
      })
    },
  },

  // ------------------------------------------------------------- inequalities
  {
    key: 'g-alg-ineq1', domain: 'algebra', skill: 'inequalities', difficulty: 1,
    build: (r) => {
      const a = r.int(2, 8), x = r.signed(2, 10), b = r.signed(2, 15)
      const c = a * x + b
      const op = r.pick(['>', '≥', '<', '≤'] as const)
      const flip = { '>': '<', '≥': '≤', '<': '>', '≤': '≥' } as const
      return mc(r, {
        prompt: `Which of the following describes all values of x for which ${coef(a)} ${signed(b)} ${op} ${num(c)}?`,
        correct: `x ${op} ${num(x)}`,
        wrong: [`x ${flip[op]} ${num(x)}`, `x ${op} ${num(c - b)}`, `x ${op} ${num(c)}`, `x ${op} ${num(-x)}`],
        explanation: `Subtract ${num(b)} to get ${coef(a)} ${op} ${num(c - b)}, then divide by ${a}. Dividing by a positive number keeps the inequality pointing the same way, so x ${op} ${num(x)}.`,
        trap: 'The sign only flips when you multiply or divide by a negative — it does not flip here.',
      })
    },
  },
  {
    key: 'g-alg-ineq2', domain: 'algebra', skill: 'inequalities', difficulty: 2,
    build: (r) => {
      const a = r.int(2, 9), x = r.signed(2, 10), b = r.signed(2, 15)
      const c = -a * x + b
      const op = r.pick(['>', '≥', '<', '≤'] as const)
      const flip = { '>': '<', '≥': '≤', '<': '>', '≤': '≥' } as const
      return mc(r, {
        prompt: `Which of the following describes all values of x for which ${coef(-a)} ${signed(b)} ${op} ${num(c)}?`,
        correct: `x ${flip[op]} ${num(x)}`,
        wrong: [`x ${op} ${num(x)}`, `x ${flip[op]} ${num(-x)}`, `x ${op} ${num(c - b)}`, `x ${flip[op]} ${num(c)}`],
        explanation: `Subtract ${num(b)}: ${coef(-a)} ${op} ${num(c - b)}. Dividing by ${num(-a)} — a negative — reverses the inequality, giving x ${flip[op]} ${num(x)}.`,
        trap: 'Forgetting to reverse the sign when dividing by a negative is the single most common error on these.',
      })
    },
  },
  {
    key: 'g-alg-ineq3', domain: 'algebra', skill: 'inequalities', difficulty: 2,
    build: (r) => {
      const fee = r.int(3, 12) * 5, rate = r.int(4, 18), n = r.int(4, 16)
      const budget = fee + rate * n + r.int(0, rate - 1)
      const who = r.pick(NAMES)
      return mc(r, {
        prompt: `A workshop charges a $${fee} registration fee plus $${rate} per session. If ${who} can spend at most $${budget}, what is the greatest number of sessions ${who} can attend?`,
        correct: String(n),
        wrong: [String(n + 1), String(Math.floor(budget / rate)), String(n - 1), String(Math.floor((budget - fee) / rate) + 1)],
        explanation: `Solve ${fee} + ${rate}s ≤ ${budget}: ${rate}s ≤ ${budget - fee}, so s ≤ ${num((budget - fee) / rate)}. Sessions come whole, so the greatest is ${n}.`,
        trap: `Choice ${Math.floor(budget / rate)} divides the whole budget by the per-session rate and forgets the registration fee.`,
      })
    },
  },
]
