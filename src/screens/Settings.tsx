import { useState } from 'react'
import { MAX_PLAN_LESSONS, TIMEFRAMES, trackLessons } from '../engine/planner'
import { Btn, Card } from '../components/ui'
import { Mascot } from '../components/Mascot'
import { Book, Sqrt } from '../components/icons'
import {
  MAX_HEARTS,
  addLessons,
  currentHearts,
  msUntilNextHeart,
  resetEverything,
  setSound,
  setUnlimitedHearts,
  useApp,
} from '../store/store'

const Toggle = ({
  on,
  onChange,
  label,
  sub,
}: {
  on: boolean
  onChange: (v: boolean) => void
  label: string
  sub: string
}) => (
  <button
    onClick={() => onChange(!on)}
    className="flex w-full items-center gap-3 py-3 text-left"
    role="switch"
    aria-checked={on}
  >
    <span className="min-w-0 flex-1">
      <span className="block text-[15.5px] font-extrabold">{label}</span>
      <span className="block text-[13px] font-bold text-hare">{sub}</span>
    </span>
    <span
      className="relative h-[30px] w-[52px] shrink-0 rounded-full transition-colors"
      style={{ background: on ? 'var(--color-grass)' : 'var(--color-swan)' }}
    >
      <span
        className="absolute top-[3px] h-6 w-6 rounded-full bg-white transition-[left] duration-150"
        style={{ left: on ? 25 : 3, boxShadow: '0 1px 3px rgba(0,0,0,.25)' }}
      />
    </span>
  </button>
)


/** A -/value/+ row for choosing how many lessons to add to one trail. */
const Stepper = ({
  icon,
  label,
  sub,
  color,
  value,
  onChange,
  max,
}: {
  icon: React.ReactNode
  label: string
  sub: string
  color: string
  value: number
  onChange: (v: number) => void
  max: number
}) => (
  <div className="flex items-center gap-3 py-3">
    <span
      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white"
      style={{ background: `var(--color-${color})` }}
    >
      {icon}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate whitespace-nowrap text-[14.5px] font-extrabold">{label}</span>
      <span className="block text-[12.5px] font-bold text-hare">{sub}</span>
    </span>
    <span className="flex shrink-0 items-center gap-1.5">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value <= 0}
        aria-label={`Remove a ${label} lesson`}
        className="grid h-8 w-8 place-items-center rounded-lg border-2 border-b-4 border-swan bg-white text-[18px] font-black leading-none text-wolf disabled:text-swan"
      >
        −
      </button>
      <span className="w-6 text-center text-[18px] font-extrabold tabular-nums">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Add a ${label} lesson`}
        className="grid h-8 w-8 place-items-center rounded-lg border-2 border-b-4 border-swan bg-white text-[18px] font-black leading-none text-wolf disabled:text-swan"
      >
        +
      </button>
    </span>
  </div>
)

export const Settings = () => {
  const app = useApp()
  const [confirming, setConfirming] = useState(false)
  const [addRw, setAddRw] = useState(0)
  const [addMath, setAddMath] = useState(0)
  const [added, setAdded] = useState<number | null>(null)
  const hearts = currentHearts(app)
  const nextMin = Math.ceil(msUntilNextHeart(app) / 60000)
  const timeframe = TIMEFRAMES.find((t) => t.id === app.profile?.timeframe)
  const room = Math.max(0, MAX_PLAN_LESSONS - (app.plan?.totalLessons ?? 0))

  return (
    <div className="no-bar h-full overflow-y-auto bg-white px-5 pb-8 pt-[calc(1.25rem+env(safe-area-inset-top))]">
      <div className="mb-5 flex items-center gap-3">
        <Mascot size={70} mood="happy" />
        <div>
          <h1 className="text-[24px] font-extrabold">{app.profile?.name || 'You'}</h1>
          <p className="text-[13px] font-bold text-hare">
            Goal {app.profile?.goalScore} · {timeframe?.label}
          </p>
        </div>
      </div>

      <Card className="mb-3">
        <p className="mb-1 text-[13px] font-extrabold uppercase tracking-wider text-hare">Hearts</p>
        <p className="mb-2 text-[15px] font-bold text-wolf">
          {app.unlimitedHearts
            ? 'Unlimited — wrong answers cost you nothing.'
            : hearts >= MAX_HEARTS
              ? 'Full.'
              : `${hearts} of ${MAX_HEARTS}. Next one in about ${nextMin} min.`}
        </p>
        <div className="border-t-2 border-swan">
          <Toggle
            on={app.unlimitedHearts}
            onChange={setUnlimitedHearts}
            label="Unlimited hearts"
            sub="Keep going after a wrong answer. Less pressure, less urgency."
          />
        </div>
      </Card>

      <Card className="mb-3">
        <Toggle
          on={app.soundOn}
          onChange={setSound}
          label="Sound effects"
          sub="Short tones on correct and incorrect answers."
        />
      </Card>

      <Card className="mb-3">
        <p className="mb-1 text-[13px] font-extrabold uppercase tracking-wider text-hare">
          How the adaptive part works
        </p>
        <p className="text-[14px] font-bold leading-snug text-wolf">
          Each lesson is two six-question modules. Get at least four right in the first and the
          second gets harder; miss more than that and it eases off. Your rating per topic moves with
          every answer, and a hard question you get right moves it much further than an easy one —
          the same reason an easier second module caps your score on the real test.
        </p>
      </Card>

      {app.plan && (
        <Card className="mb-3">
          <p className="text-[13px] font-extrabold uppercase tracking-wider text-hare">
            Add more lessons
          </p>
          <p className="mb-1 mt-1 text-[14px] font-bold leading-snug text-wolf">
            Run out of path but still want to drill? Add lessons to either trail. They follow the
            same blueprint weighting as the rest of your plan.
          </p>

          <div className="divide-y-2 divide-swan border-t-2 border-swan">
            <Stepper
              icon={<Book size={20} />}
              label="Reading &amp; Writing"
              sub={`${trackLessons(app.plan, 'rw').length} lessons now`}
              color="macaw"
              value={addRw}
              onChange={(v) => {
                setAddRw(v)
                setAdded(null)
              }}
              max={Math.min(20, room)}
            />
            <Stepper
              icon={<Sqrt size={20} />}
              label="Math"
              sub={`${trackLessons(app.plan, 'math').length} lessons now`}
              color="grass"
              value={addMath}
              onChange={(v) => {
                setAddMath(v)
                setAdded(null)
              }}
              max={Math.min(20, room - addRw)}
            />
          </div>

          <Btn
            full
            className="mt-4"
            disabled={addRw + addMath === 0}
            onClick={() => {
              const n = addLessons({ rw: addRw, math: addMath })
              setAdded(n)
              setAddRw(0)
              setAddMath(0)
            }}
          >
            {addRw + addMath === 0
              ? 'Add lessons'
              : `Add ${addRw + addMath} lesson${addRw + addMath === 1 ? '' : 's'}`}
          </Btn>

          {added !== null && (
            <p className="anim-pop mt-3 text-center text-[13.5px] font-extrabold text-[#3f8c00]">
              Added {added} lesson{added === 1 ? '' : 's'} — they're waiting at the end of your
              trail.
            </p>
          )}
          {room === 0 && (
            <p className="mt-3 text-center text-[12.5px] font-bold text-hare">
              Your plan is at its {MAX_PLAN_LESSONS}-lesson ceiling.
            </p>
          )}
          <p className="mt-3 text-[12px] font-bold leading-snug text-hare">
            The bank holds 258 questions, so a long plan will revisit some. Lessons always serve
            the ones you have seen least recently first.
          </p>
        </Card>
      )}

      <Card>
        <p className="mb-1 text-[13px] font-extrabold uppercase tracking-wider text-cardinal">
          Danger zone
        </p>
        <p className="mb-3 text-[14px] font-bold text-wolf">
          Wipe your plan, streak, XP, and progress, and start onboarding again.
        </p>
        {confirming ? (
          <div className="flex gap-2">
            <button
              onClick={resetEverything}
              className="btn3d btn3d-red flex-1 !text-[13px]"
            >
              Yes, erase it
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="btn3d btn3d-ghost flex-1 !text-[13px]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)} className="btn3d btn3d-ghost w-full !text-cardinal">
            Reset everything
          </button>
        )}
      </Card>

      <p className="mt-6 text-center text-[12px] font-bold text-hare">
        Ascend · built for one very specific student
      </p>
    </div>
  )
}
