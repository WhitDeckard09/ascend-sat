import type { Template } from './core'
import { mc, spr } from './core'
import { frac, num } from './rng'

/** Right triangles with integer sides, so answers stay exact. */
const TRIPLES = [
  [3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20], [15, 20, 25],
  [5, 12, 13], [10, 24, 26], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41],
]

export const geometryTemplates: Template[] = [
  {
    key: 'g-geo-area1', domain: 'geometry-trig', skill: 'area-volume', difficulty: 1,
    build: (r) => {
      const b = r.int(2, 20) * 2, h = r.int(2, 18)
      return spr({
        prompt: `A triangle has a base of ${b} and a height of ${h}. What is its area?`,
        accepted: [String((b * h) / 2)],
        explanation: `Area = (1/2)(base)(height) = (1/2)(${b})(${h}) = ${num((b * h) / 2)}.`,
        trap: 'Forgetting the one-half turns this into the area of a rectangle.',
      })
    },
  },
  {
    key: 'g-geo-area2', domain: 'geometry-trig', skill: 'area-volume', difficulty: 1,
    build: (r) => {
      const l = r.int(2, 12), w = r.int(2, 12), h = r.int(2, 12)
      return spr({
        prompt: `A rectangular prism has dimensions ${l}, ${w}, and ${h}. What is its volume?`,
        accepted: [String(l * w * h)],
        explanation: `Volume = length × width × height = ${l} × ${w} × ${h} = ${num(l * w * h)}.`,
      })
    },
  },
  {
    key: 'g-geo-area3', domain: 'geometry-trig', skill: 'area-volume', difficulty: 2,
    build: (r) => {
      const rad = r.int(2, 9), h = r.int(2, 12)
      return mc(r, {
        prompt: `What is the volume of a cylinder with radius ${rad} and height ${h}?`,
        correct: `${num(rad * rad * h)}π`,
        wrong: [`${num(rad * h)}π`, `${num(2 * rad * h)}π`, `${num(rad * rad)}π`, `${num(rad * rad * h * 2)}π`],
        explanation: `Volume = πr²h = π(${rad}²)(${h}) = π(${num(rad * rad)})(${h}) = ${num(rad * rad * h)}π.`,
        trap: 'The radius must be squared — multiplying it by the height only is the usual slip.',
      })
    },
  },
  {
    key: 'g-geo-area4', domain: 'geometry-trig', skill: 'area-volume', difficulty: 3,
    build: (r) => {
      const cylVol = r.int(2, 30) * 3
      return mc(r, {
        prompt: `A cone and a cylinder have the same radius and the same height. If the cylinder's volume is ${cylVol} cubic inches, what is the cone's volume, in cubic inches?`,
        correct: num(cylVol / 3),
        wrong: [num(cylVol * 3), num(cylVol / 2), num(cylVol / 6), num(cylVol)],
        explanation: `A cone's volume is (1/3)πr²h and a cylinder's is πr²h, so with matching radius and height the cone holds one-third as much: ${cylVol} ÷ 3 = ${num(cylVol / 3)}.`,
        trap: 'Multiplying by 3 instead of dividing points the relationship the wrong way.',
      })
    },
  },
  {
    key: 'g-geo-area5', domain: 'geometry-trig', skill: 'area-volume', difficulty: 3,
    build: (r) => {
      const edge = r.int(2, 9)
      const sa = 6 * edge * edge
      return mc(r, {
        prompt: `A cube has a surface area of ${num(sa)} square units. What is its volume?`,
        correct: num(edge ** 3),
        wrong: [num(edge * edge), num(sa), num(edge ** 3 * 6), num(edge * 6)],
        explanation: `A cube has 6 faces, so each face has area ${num(sa)} ÷ 6 = ${num(edge * edge)} and each edge is √${num(edge * edge)} = ${edge}. The volume is ${edge}³ = ${num(edge ** 3)}.`,
        trap: `${num(edge * edge)} is the area of one face, not the volume.`,
      })
    },
  },
  {
    key: 'g-geo-ang1', domain: 'geometry-trig', skill: 'lines-angles-triangles', difficulty: 1,
    build: (r) => {
      const a = r.int(20, 80), b = r.int(20, 170 - a)
      return spr({
        prompt: `Two angles of a triangle measure ${a}° and ${b}°. What is the measure, in degrees, of the third angle?`,
        accepted: [String(180 - a - b)],
        explanation: `The angles of a triangle sum to 180°, so the third is 180 − ${a} − ${b} = ${180 - a - b}°.`,
      })
    },
  },
  {
    key: 'g-geo-ang2', domain: 'geometry-trig', skill: 'lines-angles-triangles', difficulty: 1,
    build: (r) => {
      const a = r.int(15, 165)
      const kind = r.pick(['supplementary', 'complementary'] as const)
      if (kind === 'complementary' && a >= 90) return null
      const ans = kind === 'supplementary' ? 180 - a : 90 - a
      return spr({
        prompt: `Angles A and B are ${kind}. If angle A measures ${a}°, what is the measure, in degrees, of angle B?`,
        accepted: [String(ans)],
        explanation: `${kind[0].toUpperCase() + kind.slice(1)} angles sum to ${kind === 'supplementary' ? 180 : 90}°, so angle B = ${kind === 'supplementary' ? 180 : 90} − ${a} = ${ans}°.`,
      })
    },
  },
  {
    key: 'g-geo-ang3', domain: 'geometry-trig', skill: 'lines-angles-triangles', difficulty: 2,
    build: (r) => {
      const apex = r.int(20, 100) * 2 % 180
      if (apex < 20 || apex > 140) return null
      const base = (180 - apex) / 2
      if (!Number.isInteger(base)) return null
      return spr({
        prompt: `In isosceles triangle ABC, sides AB and AC are congruent and angle A measures ${apex}°. What is the measure, in degrees, of angle B?`,
        accepted: [String(base)],
        explanation: `The angles opposite the congruent sides are equal, so angles B and C share the remaining 180 − ${apex} = ${180 - apex}°. Each is ${base}°.`,
      })
    },
  },
  {
    key: 'g-geo-ang4', domain: 'geometry-trig', skill: 'lines-angles-triangles', difficulty: 2,
    build: (r) => {
      const k = r.int(2, 6), a = r.int(2, 9), b = r.int(2, 9)
      if (a === b) return null
      return spr({
        prompt: `Triangle ABC is similar to triangle DEF. Side AB has length ${a * 2} and corresponds to side DE, which has length ${a * 2 * k}. If side BC has length ${b * 3}, what is the length of side EF?`,
        accepted: [String(b * 3 * k)],
        explanation: `The scale factor is ${num(a * 2 * k)} ÷ ${num(a * 2)} = ${k}. Corresponding sides scale by the same factor, so EF = ${num(b * 3)} × ${k} = ${num(b * 3 * k)}.`,
      })
    },
  },
  {
    key: 'g-geo-ang5', domain: 'geometry-trig', skill: 'lines-angles-triangles', difficulty: 3,
    build: (r) => {
      const x1 = r.signed(1, 9), y1 = r.signed(1, 9)
      const t = r.pick(TRIPLES)
      const sx = r.pick([1, -1]), sy = r.pick([1, -1])
      const x2 = x1 + sx * t[0], y2 = y1 + sy * t[1]
      return spr({
        prompt: `What is the distance between the points (${num(x1)}, ${num(y1)}) and (${num(x2)}, ${num(y2)}) in the xy-plane?`,
        accepted: [String(t[2])],
        explanation: `The horizontal change is ${t[0]} and the vertical change is ${t[1]}. By the distance formula, d = √(${num(t[0] ** 2)} + ${num(t[1] ** 2)}) = √${num(t[2] ** 2)} = ${t[2]}.`,
      })
    },
  },
  {
    key: 'g-geo-tri1', domain: 'geometry-trig', skill: 'right-triangles-trig', difficulty: 1,
    build: (r) => {
      const t = r.pick(TRIPLES)
      return mc(r, {
        prompt: `A right triangle has legs of length ${t[0]} and ${t[1]}. What is the length of the hypotenuse?`,
        correct: num(t[2]),
        wrong: [num(t[0] + t[1]), num(t[2] + 1), num(t[1] - t[0]), num(t[2] - 1)],
        explanation: `By the Pythagorean theorem, c² = ${t[0]}² + ${t[1]}² = ${num(t[0] ** 2)} + ${num(t[1] ** 2)} = ${num(t[2] ** 2)}, so c = ${t[2]}.`,
        trap: `Adding the legs gives ${num(t[0] + t[1])}, which is always too long — the hypotenuse is less than the sum of the other two sides.`,
      })
    },
  },
  {
    key: 'g-geo-tri2', domain: 'geometry-trig', skill: 'right-triangles-trig', difficulty: 1,
    build: (r) => {
      const t = r.pick(TRIPLES)
      const fn = r.pick(['sin', 'cos', 'tan'] as const)
      const correct = fn === 'sin' ? frac(t[0], t[2]) : fn === 'cos' ? frac(t[1], t[2]) : frac(t[0], t[1])
      return mc(r, {
        prompt: `In right triangle ABC, the right angle is at C. The side opposite angle A has length ${t[0]}, the side adjacent to angle A has length ${t[1]}, and the hypotenuse has length ${t[2]}. What is ${fn} A?`,
        correct,
        wrong: [frac(t[1], t[2]), frac(t[0], t[2]), frac(t[0], t[1]), frac(t[1], t[0]), frac(t[2], t[0])],
        explanation: fn === 'sin'
          ? `Sine is opposite over hypotenuse: ${frac(t[0], t[2])}.`
          : fn === 'cos'
            ? `Cosine is adjacent over hypotenuse: ${frac(t[1], t[2])}.`
            : `Tangent is opposite over adjacent: ${frac(t[0], t[1])}.`,
        trap: 'SOH-CAH-TOA: the wrong choices are the other two ratios, which are always offered.',
      })
    },
  },
  {
    key: 'g-geo-tri3', domain: 'geometry-trig', skill: 'right-triangles-trig', difficulty: 2,
    build: (r) => {
      const s = r.int(2, 14)
      const which = r.pick(['30-60-90', '45-45-90'] as const)
      return which === '30-60-90'
        ? mc(r, {
            prompt: `In a 30-60-90 triangle, the side opposite the 30° angle has length ${s}. What is the length of the hypotenuse?`,
            correct: num(2 * s),
            wrong: [`${s}√3`, `${s}√2`, num(s * 3), `${num(2 * s)}√3`],
            explanation: `The sides are in ratio 1 : √3 : 2, with the hypotenuse twice the side opposite 30°. So the hypotenuse is ${num(2 * s)}.`,
            trap: `${s}√3 is the side opposite the 60° angle, not the hypotenuse.`,
          })
        : mc(r, {
            prompt: `A 45-45-90 triangle has legs of length ${s}. What is the length of the hypotenuse?`,
            correct: `${s}√2`,
            wrong: [`${s}√3`, num(2 * s), num(s), `${num(2 * s)}√2`],
            explanation: `The sides are in ratio 1 : 1 : √2, so the hypotenuse is ${s}√2.`,
            trap: '√3 belongs to the 30-60-90 triangle; the isosceles right triangle uses √2.',
          })
    },
  },
  {
    key: 'g-geo-tri4', domain: 'geometry-trig', skill: 'right-triangles-trig', difficulty: 3,
    build: (r) => {
      const v = r.int(1, 9) / 10
      return mc(r, {
        prompt: `If sin(x°) = ${num(v)}, what is cos((90 − x)°)?`,
        correct: num(v),
        wrong: [num(Math.round((1 - v) * 100) / 100), num(Math.round(Math.sqrt(1 - v * v) * 100) / 100), num(1 / v), 'It cannot be determined.'],
        explanation: `Sine and cosine are cofunctions: sin(x°) = cos((90 − x)°) for any angle, so the value is ${num(v)}.`,
        trap: 'Computing cos(x°) with the Pythagorean identity answers a different question — read which angle is asked for.',
      })
    },
  },
  {
    key: 'g-geo-circ1', domain: 'geometry-trig', skill: 'circles', difficulty: 1,
    build: (r) => {
      const rad = r.int(2, 15)
      const want = r.pick(['circumference', 'area'] as const)
      return mc(r, {
        prompt: `What is the ${want} of a circle with radius ${rad}?`,
        correct: want === 'circumference' ? `${num(2 * rad)}π` : `${num(rad * rad)}π`,
        wrong: [want === 'circumference' ? `${num(rad * rad)}π` : `${num(2 * rad)}π`, `${num(rad)}π`, `${num(4 * rad)}π`, `${num(rad * rad * 2)}π`],
        explanation: want === 'circumference'
          ? `Circumference = 2πr = 2π(${rad}) = ${num(2 * rad)}π.`
          : `Area = πr² = π(${rad}²) = ${num(rad * rad)}π.`,
        trap: 'The other formula is always offered — 2πr and πr² are easy to swap under time pressure.',
      })
    },
  },
  {
    key: 'g-geo-circ2', domain: 'geometry-trig', skill: 'circles', difficulty: 2,
    build: (r) => {
      const h = r.signed(1, 9), k = r.signed(1, 9), rad = r.int(2, 12)
      const sx = h < 0 ? `x + ${num(-h)}` : `x − ${num(h)}`
      const sy = k < 0 ? `y + ${num(-k)}` : `y − ${num(k)}`
      return mc(r, {
        prompt: `In the xy-plane, the equation (${sx})² + (${sy})² = ${num(rad * rad)} represents a circle. What are the centre and radius?`,
        correct: `Centre (${num(h)}, ${num(k)}), radius ${rad}`,
        wrong: [
          `Centre (${num(-h)}, ${num(-k)}), radius ${rad}`,
          `Centre (${num(h)}, ${num(k)}), radius ${num(rad * rad)}`,
          `Centre (${num(-h)}, ${num(-k)}), radius ${num(rad * rad)}`,
          `Centre (${num(k)}, ${num(h)}), radius ${rad}`,
        ],
        explanation: `In (x − h)² + (y − k)² = r² the centre is (h, k) and the radius is r. Here h = ${num(h)}, k = ${num(k)}, and r = √${num(rad * rad)} = ${rad}.`,
        trap: `The right side is r², not r — take the square root to get ${rad}.`,
      })
    },
  },
  {
    key: 'g-geo-circ3', domain: 'geometry-trig', skill: 'circles', difficulty: 3,
    build: (r) => {
      const h = r.signed(1, 7), k = r.signed(1, 7), rad = r.int(2, 9)
      const c = rad * rad - h * h - k * k
      const bx = -2 * h, by = -2 * k
      const term = (co: number, v: string) => (co === 0 ? '' : ` ${co < 0 ? '−' : '+'} ${Math.abs(co) === 1 ? v : `${Math.abs(co)}${v}`}`)
      if (bx === 0 || by === 0) return null
      return mc(r, {
        prompt: `In the xy-plane, the equation x² + y²${term(bx, 'x')}${term(by, 'y')} ${c < 0 ? '−' : '+'} ${num(Math.abs(c))} = 0 represents a circle. What is the radius?`,
        correct: num(rad),
        wrong: [num(rad * rad), num(Math.abs(c)), num(rad + 1), num(Math.round(Math.sqrt(Math.abs(c)) * 100) / 100)],
        explanation: `Complete the square in both variables: (x ${bx / 2 < 0 ? '−' : '+'} ${num(Math.abs(bx / 2))})² + (y ${by / 2 < 0 ? '−' : '+'} ${num(Math.abs(by / 2))})² = ${num(rad * rad)}. The radius is √${num(rad * rad)} = ${rad}.`,
        trap: `${num(rad * rad)} is r², not r — the last step is taking the square root.`,
      })
    },
  },
  {
    key: 'g-geo-circ4', domain: 'geometry-trig', skill: 'circles', difficulty: 2,
    build: (r) => {
      const rad = r.int(2, 12)
      const ang = r.pick([30, 45, 60, 90, 120, 180])
      const areaNum = (ang / 360) * rad * rad
      if (!Number.isInteger(areaNum)) return null
      return mc(r, {
        prompt: `A sector of a circle with radius ${rad} has a central angle of ${ang}°. What is the area of the sector?`,
        correct: `${num(areaNum)}π`,
        wrong: [`${num((ang / 360) * 2 * rad)}π`, `${num(rad * rad)}π`, `${num(areaNum * 2)}π`, `${num(ang)}π`],
        explanation: `The sector is ${ang}/360 = ${frac(ang, 360)} of the circle. The full area is π(${rad}²) = ${num(rad * rad)}π, so the sector is ${num(areaNum)}π.`,
        trap: 'Applying the fraction to the circumference rather than the area answers the wrong question.',
      })
    },
  },
]
