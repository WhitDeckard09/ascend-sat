import { useMemo, useRef, useState } from 'react'
import type { Difficulty, Question } from '../data/types'
import { DOMAIN_BY_ID } from '../data/types'
import type { PlannedLesson } from '../engine/planner'
import { HALF_MODULE, routeTier, selectHalf } from '../engine/selection'
import { correctAnswerText, isCorrect } from '../engine/answers'
import { tierForRating, updateRating } from '../engine/rating'
import type { Ratings } from '../engine/rating'
import { Bar, Btn, Sheet } from '../components/ui'
import { Check, Cross, Heart } from '../components/icons'
import { Mascot } from '../components/Mascot'
import { commitLesson, currentHearts, loseHeart, useApp } from '../store/store'
import { playCorrect, playWrong } from '../engine/sound'
import type { LessonResult } from '../store/store'
import { QuestionBody } from '../components/QuestionBody'

type Phase = 'question' | 'feedback' | 'routing' | 'out-of-hearts'

export interface AnswerLog {
  question: Question
  response: number | string | null
  correct: boolean
}

export const Lesson = ({
  lesson,
  onQuit,
  onFinish,
}: {
  lesson: PlannedLesson
  onQuit: () => void
  onFinish: (result: { log: AnswerLog[]; routedUp: boolean; xp: number; lessonId: string }) => void
}) => {
  const app = useApp()

  // The starting tier is the average of the current ratings for this lesson's
  // domains, so the lesson meets you where you actually are.
  const startTier = useMemo<Difficulty>(() => {
    const avg =
      lesson.domains.reduce((s, d) => s + app.ratings[d], 0) / lesson.domains.length
    return tierForRating(avg)
    // Recomputed only when the lesson changes; mid-lesson rating drift shouldn't
    // re-roll the questions underneath the student.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id])

  const [firstHalf] = useState<Question[]>(() =>
    selectHalf(lesson.domains, startTier, { seen: app.seen }, new Set()),
  )
  const [secondHalf, setSecondHalf] = useState<Question[] | null>(null)
  const [routeDirection, setRouteDirection] = useState<'up' | 'down'>('up')

  const [half, setHalf] = useState(0)
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('question')
  const [choice, setChoice] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const [log, setLog] = useState<AnswerLog[]>([])

  // Ratings are updated question by question but only written to the store once
  // the lesson is committed, so quitting midway doesn't half-apply a lesson.
  const workingRatings = useRef<Ratings>({ ...app.ratings })

  const questions = half === 0 ? firstHalf : (secondHalf ?? [])
  const q = questions[idx] as Question | undefined
  const total = HALF_MODULE * 2
  const answeredCount = log.length

  const hearts = currentHearts(app)
  const answered = q?.type === 'mc' ? choice !== null : typed.trim().length > 0

  const check = () => {
    if (!q || !answered) return
    const response = q.type === 'mc' ? choice : typed
    const ok = isCorrect(q, response)

    workingRatings.current = {
      ...workingRatings.current,
      [q.domain]: updateRating(workingRatings.current[q.domain], q.difficulty, ok),
    }
    setLog((l) => [...l, { question: q, response, correct: ok }])
    if (!ok) loseHeart()
    if (app.soundOn) (ok ? playCorrect : playWrong)()
    setPhase('feedback')
  }

  const advance = () => {
    setChoice(null)
    setTyped('')

    const nextIdx = idx + 1
    const moreInThisHalf = nextIdx < questions.length
    const lessonComplete = !moreInThisHalf && half === 1

    // Finish a lesson you've already answered through, even on an empty tank.
    if (lessonComplete) {
      finish()
      return
    }

    if (!app.unlimitedHearts && currentHearts(app) <= 0) {
      setPhase('out-of-hearts')
      return
    }

    if (moreInThisHalf) {
      setIdx(nextIdx)
      setPhase('question')
      return
    }

    {
      // Route into the second module the way the real test does.
      const correctFirst = log.filter((a) => a.correct).length
      const { tier, direction } = routeTier(startTier, correctFirst)
      const used = new Set(firstHalf.map((x) => x.id))
      setSecondHalf(selectHalf(lesson.domains, tier, { seen: app.seen }, used))
      setRouteDirection(direction)
      setPhase('routing')
    }
  }

  const finish = () => {
    const correct = log.filter((a) => a.correct).length
    const perfect = correct === total
    const xp = 10 + (perfect ? 5 : 0) + (routeDirection === 'up' ? 3 : 0)

    const result: LessonResult = {
      lessonId: lesson.id,
      answers: log.map((a) => ({
        questionId: a.question.id,
        domain: a.question.domain,
        difficulty: a.question.difficulty,
        correct: a.correct,
        response: a.response,
      })),
      ratingsAfter: workingRatings.current,
      xpEarned: xp,
    }
    commitLesson(result)
    onFinish({ log, routedUp: routeDirection === 'up', xp, lessonId: lesson.id })
  }

  // ------------------------------------------------------------ interstitials

  if (phase === 'out-of-hearts') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 bg-white px-8 text-center">
        <Mascot size={130} mood="sad" />
        <h2 className="text-[24px] font-extrabold">You're out of hearts</h2>
        <p className="text-[15px] font-bold text-wolf">
          Hearts come back over time, or you can switch on unlimited hearts in Settings — this is
          your app, after all.
        </p>
        <Btn full variant="blue" onClick={onQuit}>
          Back to path
        </Btn>
      </div>
    )
  }

  if (phase === 'routing') {
    const up = routeDirection === 'up'
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-white px-8 text-center">
        <Mascot size={130} mood={up ? 'cheer' : 'think'} />
        <p className="text-[13px] font-extrabold uppercase tracking-widest text-hare">Module 2 of 2</p>
        <h2 className={`text-[26px] font-extrabold ${up ? 'text-[#3f8c00]' : 'text-macaw'}`}>
          {up ? 'Stepping up' : 'Rebuilding'}
        </h2>
        <p className="text-[15px] font-bold text-wolf">
          {up
            ? `You got ${log.filter((a) => a.correct).length} of ${HALF_MODULE} — the next six questions get harder, just like the real test.`
            : `The next six ease off so you can lock in the fundamentals first.`}
        </p>
        <Btn
          full
          variant={up ? 'green' : 'blue'}
          onClick={() => {
            setHalf(1)
            setIdx(0)
            setPhase('question')
          }}
        >
          Continue
        </Btn>
      </div>
    )
  }

  if (!q) {
    // The bank ran dry for this combination — bail out cleanly rather than hang.
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
        <Mascot size={110} mood="think" />
        <p className="text-[15px] font-bold text-wolf">No questions available for this lesson.</p>
        <Btn variant="blue" onClick={onQuit}>
          Back to path
        </Btn>
      </div>
    )
  }

  // ---------------------------------------------------------------- question

  const last = log[log.length - 1]
  const showing = phase === 'feedback' && last
  const meta = DOMAIN_BY_ID[q.domain]

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <button onClick={onQuit} aria-label="Quit lesson" className="text-[26px] font-black leading-none text-hare">
          ✕
        </button>
        <Bar value={answeredCount / total} />
        <span className={`pill ${hearts === 0 && !app.unlimitedHearts ? 'text-hare' : 'text-cardinal'}`}>
          <Heart size={20} />
          {app.unlimitedHearts ? '∞' : hearts}
        </span>
      </div>

      <div className="no-bar flex-1 overflow-y-auto px-5 pb-52">
        <p className="mb-1 text-[12px] font-extrabold uppercase tracking-widest text-hare">
          Module {half + 1} of 2 · {meta.short}
        </p>

        <QuestionBody
          q={q}
          choice={choice}
          typed={typed}
          locked={phase === 'feedback'}
          correctIndex={q.answer}
          onChoose={setChoice}
          onType={setTyped}
        />
      </div>

      {!showing && (
        <div className="shrink-0 border-t-2 border-swan bg-white px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
          <Btn full disabled={!answered} onClick={check}>
            Check
          </Btn>
        </div>
      )}

      {showing && last && (
        <Sheet tone={last.correct ? 'correct' : 'wrong'}>
          <div className="mb-3 flex items-start gap-3">
            <div
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white"
              style={{ color: last.correct ? 'var(--color-grass)' : 'var(--color-cardinal)' }}
            >
              {last.correct ? <Check size={22} /> : <Cross size={20} />}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-[19px] font-extrabold"
                style={{ color: last.correct ? '#3f8c00' : '#d33' }}
              >
                {last.correct ? 'Correct' : 'Not quite'}
              </p>
              {!last.correct && (
                <p className="mt-0.5 text-[15px] font-bold text-eel">
                  Answer: <span className="font-extrabold">{correctAnswerText(q)}</span>
                </p>
              )}
              <p className="mt-1.5 text-[14px] font-bold leading-snug text-wolf">{q.explanation}</p>
            </div>
          </div>
          <Btn full variant={last.correct ? 'green' : 'red'} onClick={advance}>
            Continue
          </Btn>
        </Sheet>
      )}
    </div>
  )
}
