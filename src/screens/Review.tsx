import { useMemo, useState } from 'react'
import { DOMAIN_BY_ID, SKILL_LABEL } from '../data/types'
import { QUESTION_BY_ID } from '../data/bank'
import { correctAnswerText } from '../engine/answers'
import { Cross } from '../components/icons'
import { Mascot } from '../components/Mascot'
import { Btn } from '../components/ui'
import { QuestionBody } from '../components/QuestionBody'
import { clearMissed, useApp } from '../store/store'

/**
 * Every question missed so far, newest first. Working through one and marking it
 * "got it" removes it from the list, which makes this a shrinking to-do rather
 * than a growing pile of failures.
 */
export const Review = () => {
  const app = useApp()
  const [openId, setOpenId] = useState<string | null>(null)

  const entries = useMemo(
    () =>
      app.missed
        .map((m) => ({ m, q: QUESTION_BY_ID.get(m.questionId) }))
        .filter((e): e is { m: (typeof app.missed)[number]; q: NonNullable<typeof e.q> } => !!e.q),
    [app.missed],
  )

  if (!entries.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-white px-10 text-center">
        <Mascot size={120} mood="happy" />
        <h2 className="text-[22px] font-extrabold">Nothing to review</h2>
        <p className="text-[15px] font-bold text-wolf">
          Questions you miss land here so you can come back to them. Clean slate for now.
        </p>
      </div>
    )
  }

  return (
    <div className="no-bar h-full overflow-y-auto bg-white px-5 pb-8 pt-[calc(1.25rem+env(safe-area-inset-top))]">
      <h1 className="text-[26px] font-extrabold">Review</h1>
      <p className="mb-4 mt-1 text-[14px] font-bold text-wolf">
        {entries.length} question{entries.length === 1 ? '' : 's'} you missed. Work through one and
        mark it off.
      </p>

      <div className="flex flex-col gap-2.5">
        {entries.map(({ m, q }) => {
          const open = openId === q.id
          return (
            <div key={q.id + m.at} className="card overflow-hidden p-0">
              <button
                onClick={() => setOpenId(open ? null : q.id)}
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
                    choice={typeof m.response === 'number' ? m.response : null}
                    typed={q.type === 'spr' ? String(m.response ?? '') : ''}
                    locked
                    revealCorrect
                    correctIndex={q.answer}
                    onChoose={() => {}}
                    onType={() => {}}
                  />
                  <div className="mt-4 space-y-2 rounded-2xl bg-polar p-3 text-[14px] font-bold leading-snug">
                    {q.type === 'spr' && (
                      <p>
                        <span className="text-hare">Answer:</span>{' '}
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
                  <Btn
                    full
                    variant="blue"
                    className="mt-4"
                    onClick={() => {
                      setOpenId(null)
                      clearMissed(q.id)
                    }}
                  >
                    Got it
                  </Btn>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
