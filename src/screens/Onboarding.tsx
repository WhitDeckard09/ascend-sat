import { useMemo, useState } from 'react'
import { Mascot } from '../components/Mascot'
import { Btn, Bar } from '../components/ui'
import { DAILY_GOALS, TIMEFRAMES, buildPlan, lessonCountFor } from '../engine/planner'
import type { Timeframe } from '../engine/planner'
import { startPlan } from '../store/store'

const GOAL_MIN = 1000
const GOAL_MAX = 1600
const GOAL_STEP = 50

/** A short read on what a target implies, so the number means something. */
const goalBlurb = (score: number): string =>
  score <= 1150
    ? 'Locking in the fundamentals'
    : score <= 1300
      ? 'A strong, well-rounded score'
      : score <= 1450
        ? 'Competitive at selective schools'
        : 'Top tier — every question counts'

/** Mascot with a speech bubble — the conversational frame for every step. */
const Says = ({ children, mood = 'happy' }: { children: React.ReactNode; mood?: 'happy' | 'cheer' }) => (
  <div className="mb-7 flex items-end gap-3">
    <Mascot size={86} mood={mood} className="anim-bob shrink-0" />
    <div className="card relative mb-2 flex-1 p-3 text-[17px] leading-snug">
      {children}
      <span
        className="absolute -left-[9px] bottom-4 block h-4 w-4 rotate-45 border-b-2 border-l-2 border-swan bg-white"
        aria-hidden
      />
    </div>
  </div>
)

const Choice = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <button onClick={onClick} className={`choice ${selected ? 'choice-selected' : ''}`}>
    {children}
  </button>
)

export const Onboarding = () => {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [timeframe, setTimeframe] = useState<Timeframe | null>(null)
  const [dailyMinutes, setDailyMinutes] = useState<number | null>(null)
  const [goalScore, setGoalScore] = useState(1400)

  const TOTAL = 5
  const preview = useMemo(
    () =>
      timeframe && dailyMinutes
        ? buildPlan({ name: name || 'you', timeframe, dailyMinutes, goalScore })
        : null,
    [name, timeframe, dailyMinutes, goalScore],
  )

  const canAdvance =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && timeframe !== null) ||
    (step === 2 && dailyMinutes !== null) ||
    step === 3 ||
    step === 4

  const next = () => {
    if (step < TOTAL - 1) setStep(step + 1)
    else if (timeframe && dailyMinutes) startPlan({ name, timeframe, dailyMinutes, goalScore })
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex shrink-0 items-center gap-3 px-5 pb-2 pt-[calc(1.25rem+env(safe-area-inset-top))]">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="-ml-1 text-2xl font-black text-hare"
            aria-label="Back"
          >
            ‹
          </button>
        )}
        <Bar value={(step + 1) / TOTAL} height={14} />
      </div>

      <div className="no-bar flex-1 overflow-y-auto px-5 pt-5">
        {step === 0 && (
          <>
            <Says mood="cheer">
              Hi! I'm <b>Ace</b>. I'll build you an SAT plan that fits your actual schedule. What
              should I call you?
            </Says>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              onKeyDown={(e) => e.key === 'Enter' && canAdvance && next()}
              placeholder="Your name"
              className="w-full rounded-2xl border-2 border-swan bg-polar px-4 py-4 text-[18px] font-bold outline-none placeholder:text-hare focus:border-macaw focus:bg-white"
            />
          </>
        )}

        {step === 1 && (
          <>
            <Says>How long do you have to study?</Says>
            <div className="flex flex-col gap-3">
              {TIMEFRAMES.map((t) => (
                <Choice key={t.id} selected={timeframe === t.id} onClick={() => setTimeframe(t.id)}>
                  <span className="keycap">{t.weeks}w</span>
                  <span className="flex-1">{t.label}</span>
                </Choice>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Says>How much can you study each day?</Says>
            <div className="flex flex-col gap-3">
              {DAILY_GOALS.map((g) => (
                <Choice
                  key={g.minutes}
                  selected={dailyMinutes === g.minutes}
                  onClick={() => setDailyMinutes(g.minutes)}
                >
                  <span className="flex-1">
                    {g.label}
                    <span className="block text-[13px] font-bold text-hare">{g.sub}</span>
                  </span>
                </Choice>
              ))}
            </div>
            {timeframe && dailyMinutes && (
              <p className="mt-4 text-center text-[13px] font-bold text-hare">
                That's about {lessonCountFor(timeframe, dailyMinutes)} lessons.
              </p>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <Says>What score are you aiming for?</Says>

            <div className="text-center">
              <span className="text-[60px] font-extrabold leading-none tabular-nums text-grass">
                {goalScore}
              </span>
              <p className="mt-2 text-[14px] font-extrabold text-wolf">{goalBlurb(goalScore)}</p>
            </div>

            <div className="mt-9 px-2">
              <input
                type="range"
                className="slider"
                min={GOAL_MIN}
                max={GOAL_MAX}
                step={GOAL_STEP}
                value={goalScore}
                onChange={(e) => setGoalScore(Number(e.target.value))}
                style={{ '--pct': `${((goalScore - GOAL_MIN) / (GOAL_MAX - GOAL_MIN)) * 100}%` } as React.CSSProperties}
                aria-label="Goal score"
                aria-valuetext={`${goalScore} out of 1600`}
              />
              <div className="mt-3 flex justify-between text-[12px] font-extrabold text-hare">
                <span>{GOAL_MIN}</span>
                <span>{GOAL_MAX}</span>
              </div>
            </div>

            <p className="mt-8 text-center text-[13px] font-bold text-hare">
              This sets your starting difficulty and which topics get the most lessons.
            </p>
          </>
        )}

        {step === 4 && preview && (
          <>
            <Says mood="cheer">
              Here's your plan, {name.trim() || 'friend'}. You can always start a new one later.
            </Says>
            <div className="card divide-y-2 divide-swan p-0">
              {[
                ['Goal score', String(goalScore)],
                [
                  'Reading & Writing',
                  `${preview.rw.reduce((n, u) => n + u.lessons.length, 0)} lessons`,
                ],
                ['Math', `${preview.math.reduce((n, u) => n + u.lessons.length, 0)} lessons`],
                [
                  'Estimated time',
                  `${Math.floor(preview.estimatedMinutes / 60)}h ${preview.estimatedMinutes % 60}m total`,
                ],
                ['Per lesson', '12 questions, adaptive'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-4 py-3">
                  <span className="text-[15px] font-bold text-wolf">{k}</span>
                  <span className="text-[15px] font-extrabold">{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[13px] font-bold text-hare">
              Reading &amp; Writing and Math are separate trails, so you can spend a day on
              either one. Every lesson splits into two modules — do well on the first and the
              second gets harder, exactly how the real digital SAT works.
            </p>
          </>
        )}
      </div>

      <div className="shrink-0 border-t-2 border-swan px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
        <Btn full disabled={!canAdvance} onClick={next}>
          {step === TOTAL - 1 ? "Let's go" : 'Continue'}
        </Btn>
      </div>
    </div>
  )
}
