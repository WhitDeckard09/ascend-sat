import type { Template } from './core'
import { mc, spr } from './core'
import { num, signed } from './rng'

/** "x² + 5x − 6", with 1 and −1 coefficients written the way a person would. */
const quad = (a: number, b: number, c: number): string => {
  const head = a === 1 ? 'x²' : a === -1 ? '−x²' : `${num(a)}x²`
  const mid = b === 0 ? '' : ` ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? 'x' : `${num(Math.abs(b))}x`}`
  const tail = c === 0 ? '' : ` ${signed(c)}`
  return head + mid + tail
}

const binom = (p: number): string => (p < 0 ? `(x − ${num(-p)})` : `(x + ${num(p)})`)

export const advancedTemplates: Template[] = [
  // ------------------------------------------------------ equivalent expressions
  {
    key: 'g-adv-exp1', domain: 'advanced-math', skill: 'equivalent-expressions', difficulty: 1,
    build: (r) => {
      const p = r.signed(2, 9), q = r.signed(2, 9)
      if (p === q) return null
      return mc(r, {
        prompt: `Which expression is equivalent to ${binom(p)}${binom(q)}?`,
        correct: quad(1, p + q, p * q),
        wrong: [quad(1, p + q, -p * q), quad(1, -(p + q), p * q), quad(1, p * q, p + q), quad(1, 0, p * q)],
        explanation: `Multiply out: x·x = x², the middle terms give (${num(p)} + ${num(q)})x = ${num(p + q)}x, and the constants give (${num(p)})(${num(q)}) = ${num(p * q)}.`,
        trap: 'Adding the constants and multiplying the middle terms — the two operations swapped — produces one of the wrong choices.',
      })
    },
  },
  {
    key: 'g-adv-exp2', domain: 'advanced-math', skill: 'equivalent-expressions', difficulty: 1,
    build: (r) => {
      const p = r.signed(2, 9), q = r.signed(2, 9)
      if (p === q) return null
      const other = r.signed(2, 9)
      if (other === p || other === q) return null
      return mc(r, {
        prompt: `Which of the following is the factored form of ${quad(1, p + q, p * q)}?`,
        correct: `${binom(p)}${binom(q)}`,
        wrong: [`${binom(-p)}${binom(-q)}`, `${binom(p)}${binom(other)}`, `${binom(p * q)}${binom(1)}`, `${binom(-p)}${binom(q)}`],
        explanation: `You need two numbers that multiply to ${num(p * q)} and add to ${num(p + q)}. Those are ${num(p)} and ${num(q)}, giving ${binom(p)}${binom(q)}.`,
        trap: 'Check both conditions — a pair with the right product often has the wrong sum.',
      })
    },
  },
  {
    key: 'g-adv-exp3', domain: 'advanced-math', skill: 'equivalent-expressions', difficulty: 2,
    build: (r) => {
      const a = r.int(2, 9), b = r.int(2, 9), m = r.int(2, 6), n = r.int(2, 6)
      return mc(r, {
        prompt: `Which expression is equivalent to (${num(a)}x${sup(m)})(${num(b)}x${sup(n)})?`,
        correct: `${num(a * b)}x${sup(m + n)}`,
        wrong: [`${num(a * b)}x${sup(m * n)}`, `${num(a + b)}x${sup(m + n)}`, `${num(a + b)}x${sup(m * n)}`, `${num(a * b)}x${sup(Math.abs(m - n))}`],
        explanation: `Multiply the coefficients (${a} · ${b} = ${a * b}) and add the exponents (${m} + ${n} = ${m + n}), giving ${num(a * b)}x${sup(m + n)}.`,
        trap: 'Exponents add when you multiply powers of the same base; multiplying them is the standard error.',
      })
    },
  },
  {
    key: 'g-adv-exp4', domain: 'advanced-math', skill: 'equivalent-expressions', difficulty: 2,
    build: (r) => {
      const k = r.int(2, 8), b = r.int(2, 7)
      const a = k * b, m = r.int(4, 9), n = r.int(1, 3)
      if (m <= n) return null
      return mc(r, {
        prompt: `Which expression is equivalent to (${num(a)}x${sup(m)})/(${num(b)}x${sup(n)}), where x ≠ 0?`,
        correct: `${num(k)}x${sup(m - n)}`,
        wrong: [`${num(k)}x${sup(m + n)}`, `${num(a - b)}x${sup(m - n)}`, `${num(k)}x${sup(Math.round(m / n))}`, `${num(a * b)}x${sup(m - n)}`],
        explanation: `Divide the coefficients (${a} ÷ ${b} = ${k}) and subtract the exponents (${m} − ${n} = ${m - n}), giving ${num(k)}x${sup(m - n)}.`,
        trap: 'Subtracting the coefficients instead of dividing them produces a tempting near-miss.',
      })
    },
  },
  {
    key: 'g-adv-exp5', domain: 'advanced-math', skill: 'equivalent-expressions', difficulty: 3,
    build: (r) => {
      // Curated so the root is always exact.
      const bases = [
        { base: 8, root: 2, q: 3 }, { base: 27, root: 3, q: 3 }, { base: 64, root: 4, q: 3 },
        { base: 4, root: 2, q: 2 }, { base: 9, root: 3, q: 2 }, { base: 25, root: 5, q: 2 },
        { base: 16, root: 2, q: 4 }, { base: 16, root: 4, q: 2 },
      ]
      const b = r.pick(bases)
      const p = r.int(2, 3)
      const n = b.q * r.int(1, 3)
      const outCoef = Math.pow(b.root, p), outExp = (n * p) / b.q
      return mc(r, {
        prompt: `Which expression is equivalent to (${b.base}x${sup(n)})^(${p}/${b.q}), where x > 0?`,
        correct: `${num(outCoef)}x${sup(outExp)}`,
        wrong: [`${num(b.base * p)}x${sup(outExp)}`, `${num(outCoef)}x${sup(n * p)}`, `${num(b.base)}x${sup(outExp)}`, `${num(b.root * p)}x${sup(outExp)}`],
        explanation: `Apply the exponent to each factor: ${b.base}^(${p}/${b.q}) means the ${b.q === 2 ? 'square' : b.q === 3 ? 'cube' : `${b.q}th`} root of ${b.base}, which is ${b.root}, raised to the ${p} — that is ${outCoef}. And (x${sup(n)})^(${p}/${b.q}) = x${sup(outExp)}.`,
        trap: 'A fractional exponent is a root, not a multiplication — treating it as one gives the large wrong coefficients.',
      })
    },
  },
  {
    key: 'g-adv-exp6', domain: 'advanced-math', skill: 'equivalent-expressions', difficulty: 2,
    build: (r) => {
      const a = r.int(2, 9)
      return mc(r, {
        prompt: `For x ≠ ${num(a)}, which expression is equivalent to (x² − ${num(a * a)})/(x − ${num(a)})?`,
        correct: `x + ${num(a)}`,
        wrong: [`x − ${num(a)}`, `x² − ${num(a)}`, `${num(a)}`, `x + ${num(a * a)}`],
        explanation: `The numerator is a difference of squares: x² − ${num(a * a)} = (x − ${num(a)})(x + ${num(a)}). Cancelling the common factor (x − ${num(a)}) leaves x + ${num(a)}.`,
        trap: 'Cancelling to the wrong factor flips the sign of the constant.',
      })
    },
  },
  {
    key: 'g-adv-exp7', domain: 'advanced-math', skill: 'equivalent-expressions', difficulty: 3,
    build: (r) => {
      const h = r.signed(1, 7), c = r.signed(2, 20)
      const b = 2 * h
      return mc(r, {
        prompt: `Which expression is equivalent to ${quad(1, b, c)}?`,
        correct: `(x ${signed(h)})² ${signed(c - h * h)}`,
        wrong: [`(x ${signed(h)})² ${signed(c + h * h)}`, `(x ${signed(b)})² ${signed(c - b * b)}`, `(x ${signed(h)})² ${signed(c)}`, `(x ${signed(-h)})² ${signed(c - h * h)}`],
        explanation: `Complete the square: half of ${num(b)} is ${num(h)}, and ${num(h)}² = ${num(h * h)}, so x² ${signed(b)}x = (x ${signed(h)})² − ${num(h * h)}. Adding the ${num(c)} back gives (x ${signed(h)})² ${signed(c - h * h)}.`,
        trap: `You must subtract the ${num(h * h)} that completing the square introduces, not add it.`,
      })
    },
  },

  // ------------------------------------------------------- nonlinear equations
  {
    key: 'g-adv-eq1', domain: 'advanced-math', skill: 'nonlinear-equations', difficulty: 1,
    build: (r) => {
      const x = r.int(2, 15)
      return spr({
        prompt: `If x² = ${num(x * x)} and x > 0, what is the value of x?`,
        accepted: [String(x)],
        explanation: `Taking the square root of both sides gives x = ${x} or x = −${x}. The condition x > 0 selects x = ${x}.`,
      })
    },
  },
  {
    key: 'g-adv-eq2', domain: 'advanced-math', skill: 'nonlinear-equations', difficulty: 2,
    build: (r) => {
      const p = r.signed(1, 9), q = r.signed(1, 9)
      if (p === q) return null
      return spr({
        prompt: `What is the sum of the solutions to ${quad(1, -(p + q), p * q)} = 0?`,
        accepted: [String(p + q)],
        explanation: `Factoring gives ${binom(-p)}${binom(-q)} = 0, so the solutions are ${num(p)} and ${num(q)} and their sum is ${num(p + q)}. (Shortcut: for x² + bx + c = 0 the roots sum to −b.)`,
      })
    },
  },
  {
    key: 'g-adv-eq3', domain: 'advanced-math', skill: 'nonlinear-equations', difficulty: 2,
    build: (r) => {
      const h = r.int(2, 9)
      return spr({
        prompt: `In the equation x² + ${num(2 * h)}x + c = 0, c is a constant and the equation has exactly one real solution. What is the value of c?`,
        accepted: [String(h * h)],
        explanation: `Exactly one solution means the discriminant is zero: ${num(2 * h)}² − 4c = 0, so ${num(4 * h * h)} = 4c and c = ${num(h * h)}. The equation becomes (x + ${h})² = 0.`,
      })
    },
  },
  {
    key: 'g-adv-eq4', domain: 'advanced-math', skill: 'nonlinear-equations', difficulty: 2,
    build: (r) => {
      const a = r.int(2, 6), c = r.int(3, 12), b = r.signed(2, 20)
      const x = (c * c - b) / a
      if (!Number.isInteger(x) || a * x + b < 0) return null
      return spr({
        prompt: `If √(${a}x ${signed(b)}) = ${c}, what is the value of x?`,
        accepted: [String(x)],
        explanation: `Square both sides: ${a}x ${signed(b)} = ${num(c * c)}. Then ${a}x = ${num(c * c - b)}, so x = ${num(x)}. Checking, √${num(c * c)} = ${c}. ✓`,
      })
    },
  },
  {
    key: 'g-adv-eq5', domain: 'advanced-math', skill: 'nonlinear-equations', difficulty: 3,
    build: (r) => {
      const b = r.signed(1, 8), c = r.int(2, 14)
      const disc = b * b - 4 * c
      if (disc >= 0) return null
      return mc(r, {
        prompt: `How many real solutions does the equation ${quad(1, b, c)} = 0 have?`,
        correct: 'Zero',
        wrong: ['Exactly one', 'Exactly two', 'Infinitely many'],
        explanation: `The discriminant is ${num(b)}² − 4(1)(${c}) = ${num(b * b)} − ${num(4 * c)} = ${num(disc)}. A negative discriminant means no real solutions.`,
        trap: 'Not every quadratic has two real roots — the discriminant decides.',
      })
    },
  },
  {
    key: 'g-adv-eq6', domain: 'advanced-math', skill: 'nonlinear-equations', difficulty: 3,
    build: (r) => {
      const p = r.signed(1, 7), q = r.signed(1, 7)
      if (p === q) return null
      const m = r.signed(1, 5)
      // y = x² + bx + c meets y = mx + d where the intersections are at p and q.
      const b = -(p + q) + m
      const c = p * q
      const d = 0
      return spr({
        prompt: `The system y = ${quad(1, b, c)} and y = ${m === 1 ? 'x' : m === -1 ? '−x' : `${num(m)}x`}${d ? ` ${signed(d)}` : ''} has two solutions. What is the sum of the two x-coordinates of those solutions?`,
        accepted: [String(p + q)],
        explanation: `Set them equal: ${quad(1, b, c)} = ${num(m)}x, so ${quad(1, b - m, c)} = 0. The roots sum to −(${num(b - m)}) = ${num(p + q)}.`,
      })
    },
  },

  // -------------------------------------------------------- nonlinear functions
  {
    key: 'g-adv-fn1', domain: 'advanced-math', skill: 'nonlinear-functions', difficulty: 1,
    build: (r) => {
      const a = r.int(1, 3), b = r.signed(1, 8), c = r.signed(1, 12), k = r.signed(1, 5)
      const y = a * k * k + b * k + c
      return spr({
        prompt: `The function f is defined by f(x) = ${quad(a, b, c)}. What is the value of f(${num(k)})?`,
        accepted: [String(y)],
        explanation: `Substitute: f(${num(k)}) = ${a === 1 ? '' : `${a}`}(${num(k)})² ${signed(b)}(${num(k)}) ${signed(c)} = ${num(a * k * k)} ${signed(b * k)} ${signed(c)} = ${num(y)}.`,
      })
    },
  },
  {
    key: 'g-adv-fn2', domain: 'advanced-math', skill: 'nonlinear-functions', difficulty: 1,
    build: (r) => {
      const p = r.signed(2, 9), q = r.signed(2, 9)
      if (p === q) return null
      return mc(r, {
        prompt: `What are the zeros of the function f(x) = ${binom(p)}${binom(q)}?`,
        correct: `${num(-p)} and ${num(-q)}`,
        wrong: [`${num(p)} and ${num(q)}`, `${num(p)} and ${num(-q)}`, `${num(-p)} and ${num(q)}`, `${num(p * q)} and ${num(p + q)}`],
        explanation: `A product is zero when a factor is zero: x ${signed(p)} = 0 gives x = ${num(-p)}, and x ${signed(q)} = 0 gives x = ${num(-q)}.`,
        trap: 'Reading the numbers straight out of the parentheses without flipping their signs is the usual slip.',
      })
    },
  },
  {
    key: 'g-adv-fn3', domain: 'advanced-math', skill: 'nonlinear-functions', difficulty: 2,
    build: (r) => {
      const h = r.signed(1, 8), k = r.signed(1, 12), a = r.pick([1, 1, 2, 3])
      const body = `${a === 1 ? '' : num(a)}(x ${signed(-h)})² ${signed(k)}`
      return mc(r, {
        prompt: `The graph of y = ${body} is a parabola in the xy-plane. What is its vertex?`,
        correct: `(${num(h)}, ${num(k)})`,
        wrong: [`(${num(-h)}, ${num(k)})`, `(${num(h)}, ${num(-k)})`, `(${num(k)}, ${num(h)})`, `(${num(-h)}, ${num(-k)})`],
        explanation: `In vertex form y = a(x − h)² + k the vertex is (h, k). Here x ${signed(-h)} means h = ${num(h)}, and k = ${num(k)}.`,
        trap: 'The sign inside the parentheses is already flipped — (x − 3) means h = +3.',
      })
    },
  },
  {
    key: 'g-adv-fn4', domain: 'advanced-math', skill: 'nonlinear-functions', difficulty: 2,
    build: (r) => {
      const start = r.int(2, 30) * 50
      const kind = r.pick(['growth', 'decay'] as const)
      const pct = r.pick([10, 15, 20, 25, 30, 40])
      const factor = kind === 'growth' ? 1 + pct / 100 : 1 - pct / 100
      const thing = r.pick(['a bacterial culture', 'a savings balance', 'a machine’s resale value', 'a herd population'])
      return mc(r, {
        prompt: `${thing[0].toUpperCase() + thing.slice(1)} starts at ${num(start)} and ${kind === 'growth' ? 'increases' : 'decreases'} by ${pct}% each year. Which function gives its value V after t years?`,
        correct: `V(t) = ${num(start)}(${num(factor)})^t`,
        wrong: [
          `V(t) = ${num(start)}(${num(pct / 100)})^t`,
          `V(t) = ${num(start)}(${num(kind === 'growth' ? 1 - pct / 100 : 1 + pct / 100)})^t`,
          `V(t) = ${num(start)} ${kind === 'growth' ? '+' : '−'} ${num((start * pct) / 100)}t`,
          `V(t) = ${num(start)}(${pct})^t`,
        ],
        explanation: `${kind === 'growth' ? `Growing by ${pct}% multiplies by 1 + ${num(pct / 100)}` : `Losing ${pct}% leaves ${100 - pct}%, a factor of ${num(factor)}`} each year, so V(t) = ${num(start)}(${num(factor)})^t.`,
        trap: `Using ${num(pct / 100)} as the factor would mean losing ${100 - pct}% every year, not ${pct}%.`,
      })
    },
  },
  {
    key: 'g-adv-fn5', domain: 'advanced-math', skill: 'nonlinear-functions', difficulty: 3,
    build: (r) => {
      const m = r.signed(1, 4), b = r.signed(1, 9), c = r.signed(1, 9), k = r.int(2, 6)
      const inner = k * k + c
      return spr({
        prompt: `The functions f and g are defined by f(x) = ${m === 1 ? 'x' : m === -1 ? '−x' : `${num(m)}x`} ${signed(b)} and g(x) = x² ${signed(c)}. What is the value of f(g(${k}))?`,
        accepted: [String(m * inner + b)],
        explanation: `Work from the inside out: g(${k}) = ${num(k * k)} ${signed(c)} = ${num(inner)}. Then f(${num(inner)}) = ${num(m)}(${num(inner)}) ${signed(b)} = ${num(m * inner + b)}.`,
      })
    },
  },
  {
    key: 'g-adv-fn6', domain: 'advanced-math', skill: 'nonlinear-functions', difficulty: 3,
    build: (r) => {
      const h = r.signed(1, 6), k = r.signed(1, 14), a = r.int(2, 4)
      const dx = r.int(1, 3)
      const px = h + dx, py = a * dx * dx + k
      return spr({
        prompt: `The graph of the quadratic function f has vertex (${num(h)}, ${num(k)}) and passes through (${num(px)}, ${num(py)}). If f(x) = a(x ${signed(-h)})² ${signed(k)}, what is the value of a?`,
        accepted: [String(a)],
        explanation: `Substitute the point: ${num(py)} = a(${num(px)} ${signed(-h)})² ${signed(k)}, so ${num(py)} = ${num(dx * dx)}a ${signed(k)}. Then ${num(dx * dx)}a = ${num(py - k)}, giving a = ${a}.`,
      })
    },
  },
  {
    key: 'g-adv-fn7', domain: 'advanced-math', skill: 'nonlinear-functions', difficulty: 3,
    build: (r) => {
      const h = r.signed(1, 6), k = r.signed(1, 12)
      const dir = r.pick(['right', 'left'] as const)
      const vert = r.pick(['up', 'down'] as const)
      const hh = dir === 'right' ? Math.abs(h) : -Math.abs(h)
      const kk = vert === 'up' ? Math.abs(k) : -Math.abs(k)
      return mc(r, {
        prompt: `The function f is defined by f(x) = x². The function g is defined by g(x) = f(x ${signed(-hh)}) ${signed(kk)}. Which statement describes the graph of g compared with the graph of f?`,
        correct: `Shifted ${Math.abs(hh)} units ${dir} and ${Math.abs(kk)} units ${vert}`,
        wrong: [
          `Shifted ${Math.abs(hh)} units ${dir === 'right' ? 'left' : 'right'} and ${Math.abs(kk)} units ${vert}`,
          `Shifted ${Math.abs(hh)} units ${dir} and ${Math.abs(kk)} units ${vert === 'up' ? 'down' : 'up'}`,
          `Shifted ${Math.abs(hh)} units ${dir === 'right' ? 'left' : 'right'} and ${Math.abs(kk)} units ${vert === 'up' ? 'down' : 'up'}`,
          `Shifted ${Math.abs(kk)} units ${dir} and ${Math.abs(hh)} units ${vert}`,
        ],
        explanation: `Replacing x with x ${signed(-hh)} shifts the graph ${Math.abs(hh)} units ${dir}; adding ${num(kk)} outside the function shifts it ${Math.abs(kk)} units ${vert}.`,
        trap: 'Horizontal shifts move opposite to the sign inside the parentheses, which is the counterintuitive half.',
      })
    },
  },
  {
    key: 'g-adv-fn8', domain: 'advanced-math', skill: 'nonlinear-functions', difficulty: 2,
    build: (r) => {
      const h = r.signed(1, 6), k = r.signed(1, 14)
      return spr({
        prompt: `The function f is defined by f(x) = ${quad(1, -2 * h, h * h + k)}. What is the minimum value of f(x)?`,
        accepted: [String(k)],
        explanation: `The vertex sits at x = −b/(2a) = ${num(2 * h)}/2 = ${num(h)}. Then f(${num(h)}) = ${num(h * h)} ${signed(-2 * h * h)} ${signed(h * h + k)} = ${num(k)}. The parabola opens upward, so that is the minimum.`,
      })
    },
  },
  {
    key: 'g-adv-fn9', domain: 'advanced-math', skill: 'nonlinear-functions', difficulty: 3,
    build: (r) => {
      const a = r.signed(1, 3), b = r.signed(1, 5), c = r.signed(1, 6), d = r.signed(1, 9), k = r.int(2, 4)
      const y = a * k ** 3 + b * k * k + c * k + d
      const poly = `${a === 1 ? '' : a === -1 ? '−' : num(a)}x³ ${signed(b)}x² ${signed(c)}x ${signed(d)}`
      return spr({
        prompt: `The polynomial p is defined by p(x) = ${poly}. What is the value of p(${k})?`,
        accepted: [String(y)],
        explanation: `p(${k}) = ${num(a)}(${num(k ** 3)}) ${signed(b)}(${num(k * k)}) ${signed(c)}(${k}) ${signed(d)} = ${num(a * k ** 3)} ${signed(b * k * k)} ${signed(c * k)} ${signed(d)} = ${num(y)}.`,
      })
    },
  },
  {
    key: 'g-adv-fn10', domain: 'advanced-math', skill: 'nonlinear-functions', difficulty: 2,
    build: (r) => {
      const b = r.pick([2, 3, 5, 10])
      const p = r.int(2, 5)
      return mc(r, {
        prompt: `Which expression is equivalent to ${b}^(${p}x)?`,
        correct: `${num(Math.pow(b, p))}^x`,
        wrong: [`${num(b * p)}^x`, `${num(b + p)}^x`, `${b}^x + ${b}^x`, `${num(Math.pow(b, p))}^(${p}x)`],
        explanation: `Use the power rule in reverse: ${b}^(${p}x) = (${b}^${p})^x = ${num(Math.pow(b, p))}^x.`,
        trap: 'Multiplying the base by the exponent’s coefficient is not a valid exponent rule.',
      })
    },
  },
]

/** Superscript digits, so exponents read as exponents without markup. */
function sup(n: number): string {
  const map: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' }
  return String(n).split('').map((c) => map[c] ?? c).join('')
}
