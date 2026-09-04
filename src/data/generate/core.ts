import type { Difficulty, Domain, Question, Section } from '../types'
import { makeRng, type Rng } from './rng'

/** A single generated question, before identity is attached. */
export interface Variant {
  type: 'mc' | 'spr'
  prompt: string
  passage?: string
  table?: { headers: string[]; rows: string[][] }
  choices?: string[]
  answer?: number
  accepted?: string[]
  explanation: string
  trap?: string
}

export interface Template {
  /** Stable prefix for every id this template produces. Never reuse one. */
  key: string
  domain: Domain
  skill: string
  difficulty: Difficulty
  /** Return null to reject a draw (e.g. it produced duplicate choices). */
  build: (r: Rng) => Variant | null
}

/**
 * Assemble a multiple-choice variant. Distractors are supplied in preference
 * order and the first three distinct ones are used, so a template can offer
 * more than it needs and let collisions fall away.
 */
export const mc = (
  r: Rng,
  opts: { prompt: string; correct: string; wrong: string[]; explanation: string; trap?: string; passage?: string },
): Variant | null => {
  const wrong: string[] = []
  for (const w of opts.wrong) {
    if (w !== opts.correct && !wrong.includes(w)) wrong.push(w)
    if (wrong.length === 3) break
  }
  if (wrong.length < 3) return null

  const choices = r.shuffle([opts.correct, ...wrong])
  return {
    type: 'mc',
    prompt: opts.prompt,
    passage: opts.passage,
    choices,
    answer: choices.indexOf(opts.correct),
    explanation: opts.explanation,
    trap: opts.trap,
  }
}

/** Assemble a student-produced-response variant. */
export const spr = (opts: {
  prompt: string
  accepted: string[]
  explanation: string
  trap?: string
}): Variant => ({
  type: 'spr',
  prompt: opts.prompt,
  accepted: opts.accepted,
  explanation: opts.explanation,
  trap: opts.trap,
})

const hash = (s: string): number => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Expand templates into questions. Ids are `<template key>-<n>`, and both the
 * id and its content are fully determined by the template key and index, so the
 * bank is byte-stable across builds.
 */
export const expand = (templates: Template[], perTemplate: number, section: Section): Question[] => {
  const out: Question[] = []

  for (const t of templates) {
    const seen = new Set<string>()
    let made = 0
    // Generous attempt budget: a draw is cheap and collisions are common once a
    // template's parameter space starts filling up.
    for (let attempt = 0; made < perTemplate && attempt < perTemplate * 60; attempt++) {
      const v = t.build(makeRng(hash(t.key) + attempt * 7919))
      if (!v) continue

      // Reject anything that repeats an earlier variant's wording.
      const sig = `${v.prompt}||${v.passage ?? ''}||${v.choices?.join('|') ?? v.accepted?.join('|') ?? ''}`
      if (seen.has(sig)) continue
      seen.add(sig)

      out.push({
        id: `${t.key}-${made + 1}`,
        section,
        domain: t.domain,
        skill: t.skill,
        difficulty: t.difficulty,
        ...v,
      })
      made++
    }
  }
  return out
}
