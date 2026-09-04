import { useEffect, useMemo, useState } from 'react'
import { DOMAIN_BY_ID, SKILL_LABEL } from '../data/types'
import type { Domain } from '../data/types'
import { correctAnswerText } from '../engine/answers'
import { projectScore } from '../engine/rating'
import { budgetMs, comparePace, formatDuration, formatPace } from '../engine/pace'
import { Bolt, Check, Clock, Cross, Star, Target } from '../components/icons'
import { Mascot } from '../components/Mascot'
import { Btn } from '../components/ui'
import { QuestionBody } from '../components/QuestionBody'
import { useApp } from '../store/store'
import { playComplete } from '../engine/sound'
import type { AnswerLog } from './Lesson'

const Tile = ({
  label,
  value,
  color,
  icon,
}: {
  label: string
  value: string
  color: string
  icon: React.ReactNode
}) => (
  <div
    className="flex-1 rounded-2xl border-2 p-[2px]"
    style={{ borderColor: `var(--color-${color})` }}
  >
    <div
      className="rounded-[13px] px-2 py-1 text-center text-[11px] font-extrabold uppercase tracking-wider text-white"
      style={{ background: `var(--color-${color})` }}
    >
      {label}
    </div>
    <div
      className="flex items-center justify-center gap-1 py-2 text-[20px] font-extrabold"
      style={{ color: `var(--color-${color})` }}
    >
      {icon}
      {value}
    </div>
  </div>
)

/** One missed question, collapsed to a summary until tapped. */
const MissCard = ({ entry }: { entry: AnswerLog }) => {
  const [open, setOpen] = useState(false)
  const q = entry.question
  const yours =
    q.type === 'mc'
      ? typeof entry.response === 'number'
        ? (q.choices?.[entry.response] ?? '—')
        : 'Skipped'
      : String(entry.response ?? '').trim() || 'Skipped'

  return (
    <div className="card overflow-hidden p-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cardinal-tint text-cardinal">
          <Cross size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-extrabold uppercase tracking-wider text-hare">
            {SKILL_LABEL[q.skill] ?? DOMAIN_BY_ID[q.domain].short}
          </span>
          <span className="block truncate text-[14.5px] font-bold">{q.prompt}</span>
        </span>
        <span className={`text-[18px] font-black text-hare transition-transform ${open ? 'rotate-90' : ''}`}>
          ›
        </span>
      </button>

      {open && (
        <div className="border-t-2 border-swan p-4">
          <QuestionBody
            q={q}
            choice={typeof entry.response === 'number' ? entry.response : null}
            typed={q.type === 'spr' ? String(entry.response ?? '') : ''}
            locked
            revealCorrect
            correctIndex={q.answer}
            onChoose={() => {}}
            onType={() => {}}
          />
          <div className="mt-4 space-y-2 rounded-2xl bg-polar p-3 text-[14px] font-bold leading-snug">
            {q.type === 'spr' && (
              <p>
                <span className="text-hare">You put</span> {yours} ·{' '}
                <span className="text-hare">answer</span>{' '}
                <span className="text-[#3f8c00]">{correctAnswerText(q)}</span>
              </p>
            )}
            <p className="text-wolf">{q.explanation}</p>
            {q.trap && (
              <p className="text-wolf">
                <span className="text-cardinal">Why the trap works: </span>
                {q.trap}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export const Recap = ({
  log,
  xp,
  routedUp,
  elapsedMs,
  onDone,
}: {
  log: AnswerLog[]
  xp: number
  routedUp: boolean
  /** Time on questions. The clock ran during the lesson without showing itself. */
  elapsedMs: number
  onDone: () => void
}) => {
  const app = useApp()
  const correct = log.filter((a) => a.correct).length
  const accuracy = log.length ? Math.round((correct / log.length) * 100) : 0
  const misses = log.filter((a) => !a.correct)
  const projected = projectScore(app.ratings, app.profile?.goalScore ?? 1300, app.answeredByDomain)

  // Pace. The budget is built from the sections actually answered, since Math
  // gets about 24 more seconds a question than Reading & Writing.
  const perQuestion = log.length ? elapsedMs / log.length : 0
  const pace = comparePace(elapsedMs, budgetMs(log.map((a) => a.question.section)))
  const paceColor =
    pace.label === 'ahead' ? '#3f8c00' : pace.label === 'on' ? 'var(--color-macaw)' : 'var(--color-fox)'

  // `lessonTimes[0]` is the lesson that just committed, so the one before it is
  // the comparison. A couple of seconds either way is noise, not a trend.
  const previous = app.lessonTimes[1]
  const priorPerQuestion = previous?.questions ? previous.ms / previous.questions : null
  const swing = priorPerQuestion === null ? 0 : priorPerQuestion - perQuestion
  const swingLine =
    Math.abs(swing) < 2000
      ? null
      : ` ${formatPace(Math.abs(swing))} ${swing > 0 ? 'faster' : 'slower'} a question than last lesson.`

  /** Rank the skills touched by this lesson by how badly they went. */
  const focus = useMemo(() => {
    const bySkill = new Map<string, { right: number; total: number; domain: Domain }>()
    for (const a of log) {
      const k = a.question.skill
      const cur = bySkill.get(k) ?? { right: 0, total: 0, domain: a.question.domain }
      cur.total++
      if (a.correct) cur.right++
      bySkill.set(k, cur)
    }
    return [...bySkill.entries()]
      .map(([skill, v]) => ({ skill, ...v, rate: v.right / v.total }))
      .filter((s) => s.rate < 1)
      .sort((a, b) => a.rate - b.rate || b.total - a.total)
      .slice(0, 3)
  }, [log])

  const perfect = misses.length === 0

  useEffect(() => {
    if (app.soundOn) playComplete()
    // Fires once when the recap opens, not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="no-bar flex-1 overflow-y-auto px-5 pb-6 pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <div className="flex flex-col items-center text-center">
          <Mascot size={116} mood={perfect ? 'cheer' : accuracy >= 60 ? 'happy' : 'think'} className="anim-pop" />
          <h1 className="mt-2 text-[26px] font-extrabold text-[#3f8c00]">
            {perfect ? 'Perfect lesson!' : accuracy >= 60 ? 'Lesson complete!' : 'Lesson done'}
          </h1>
          <p className="mt-1 text-[14px] font-bold text-wolf">
            {perfect
              ? 'Twelve for twelve. That is not luck.'
              : `You got ${correct} of ${log.length}. The misses are below.`}
          </p>
        </div>

        <div className="mt-5 flex gap-2.5">
          <Tile label="XP" value={`+${xp}`} color="bee" icon={<Bolt size={18} />} />
          <Tile label="Accuracy" value={`${accuracy}%`} color="grass" icon={<Check size={18} />} />
          <Tile
            label="Module 2"
            value={routedUp ? 'Harder' : 'Easier'}
            color={routedUp ? 'beetle' : 'macaw'}
            icon={<Star size={16} />}
          />
        </div>

        {elapsedMs > 0 && (
          <div className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-swan bg-polar p-3">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white"
              style={{ background: paceColor }}
            >
              <Clock size={18} />
            </span>
            <p className="text-[14px] font-bold leading-snug text-wolf">
              Finished in <b className="text-[15px] text-eel">{formatDuration(elapsedMs)}</b>{' '}
              <span className="text-hare">· {formatPace(perQuestion)} a question</span>
              <br />
              <span style={{ color: paceColor }}>
                {pace.label === 'on'
                  ? `Right on the real test's pace for these ${log.length}.`
                  : pace.label === 'ahead'
                    ? `${formatDuration(pace.spareMs)} inside the real test's clock for these ${log.length}.`
                    : `${formatDuration(-pace.spareMs)} over the real test's clock for these ${log.length}.`}
              </span>
              {swingLine && <span className="text-hare">{swingLine}</span>}
            </p>
          </div>
        )}

        <div className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-swan bg-polar p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-macaw text-white">
            <Target size={18} />
          </span>
          <p className="text-[14px] font-bold leading-snug text-wolf">
            Projected score now{' '}
            <b className="text-[15px] text-eel">{projected.total}</b>{' '}
            <span className="text-hare">
              ({projected.rw} R&amp;W / {projected.math} Math)
            </span>
          </p>
        </div>

        {focus.length > 0 && (
          <>
            <h2 className="mb-2 mt-6 text-[13px] font-extrabold uppercase tracking-widest text-hare">
              What to work on
            </h2>
            <div className="flex flex-col gap-2.5">
              {focus.map((f) => {
                const meta = DOMAIN_BY_ID[f.domain]
                return (
                  <div key={f.skill} className="card flex items-center gap-3 p-3">
                    <span
                      className="h-10 w-1.5 shrink-0 rounded-full"
                      style={{ background: `var(--color-${meta.color})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-extrabold">
                        {SKILL_LABEL[f.skill] ?? f.skill}
                      </p>
                      <p className="text-[13px] font-bold text-hare">
                        {f.right}/{f.total} correct · {meta.label}
                      </p>
                    </div>
                    <span
                      className="rounded-lg px-2 py-1 text-[12px] font-extrabold"
                      style={{
                        background: f.rate === 0 ? 'var(--color-cardinal-tint)' : 'var(--color-bee-tint)',
                        color: f.rate === 0 ? '#d33' : '#a07800',
                      }}
                    >
                      {f.rate === 0 ? 'Weak' : 'Shaky'}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {misses.length > 0 && (
          <>
            <h2 className="mb-2 mt-6 text-[13px] font-extrabold uppercase tracking-widest text-hare">
              Review your misses ({misses.length})
            </h2>
            <div className="flex flex-col gap-2.5">
              {misses.map((m) => (
                <MissCard key={m.question.id} entry={m} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="shrink-0 border-t-2 border-swan px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
        <Btn full onClick={onDone}>
          Continue
        </Btn>
      </div>
    </div>
  )
}
