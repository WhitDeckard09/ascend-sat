import { DOMAINS, DOMAIN_BY_ID } from '../data/types'
import type { Section } from '../data/types'
import { blendedRating, projectScore, seedRatingForGoal, tierForRating } from '../engine/rating'
import { Bar, Btn, Card } from '../components/ui'
import { Bolt, Flame, Target, Trophy } from '../components/icons'
import { localDay, useApp } from '../store/store'

const TIER_LABEL = { 1: 'Foundations', 2: 'On level', 3: 'Advanced' } as const

/** Last 14 days, so a streak is something you can actually see. */
const StreakStrip = ({ days }: { days: string[] }) => {
  const set = new Set(days)
  const cells = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    return { key: localDay(d), letter: 'SMTWTFS'[d.getDay()], active: set.has(localDay(d)) }
  })
  return (
    <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
      {cells.map((c, i) => (
        <div key={c.key + i} className="flex flex-col items-center gap-1">
          <span className="text-[9.5px] font-extrabold text-hare">{c.letter}</span>
          <span
            className="grid aspect-square w-full place-items-center rounded-full"
            style={{
              background: c.active ? 'var(--color-fox)' : 'var(--color-swan)',
              color: '#fff',
            }}
          >
            {c.active && <Flame size={12} />}
          </span>
        </div>
      ))}
    </div>
  )
}

const SectionBlock = ({ section, title }: { section: Section; title: string }) => {
  const app = useApp()
  const seed = seedRatingForGoal(app.profile?.goalScore ?? 1300)
  const domains = DOMAINS.filter((d) => d.section === section)

  return (
    <>
      <h3 className="mb-2 mt-5 text-[13px] font-extrabold uppercase tracking-widest text-hare">
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        {domains.map((d) => {
          const answered = app.answeredByDomain[d.id] ?? 0
          const r = blendedRating(app.ratings[d.id], seed, answered)
          const started = answered > 0
          return (
            <div key={d.id} style={{ opacity: started ? 1 : 0.55 }}>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="min-w-0 truncate text-[14.5px] font-extrabold">{d.label}</span>
                <span className="shrink-0 text-[12px] font-extrabold text-hare">
                  {started ? `${TIER_LABEL[tierForRating(r)]} · ${answered} q` : 'Not started'}
                </span>
              </div>
              <Bar
                value={r / 100}
                color={started ? `var(--color-${d.color})` : 'var(--color-hare)'}
                height={12}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}

export const Stats = ({ onPractice }: { onPractice: () => void }) => {
  const app = useApp()
  const goal = app.profile?.goalScore ?? 1400
  const projected = projectScore(app.ratings, goal, app.answeredByDomain)
  const seed = seedRatingForGoal(goal)

  const weakest = [...DOMAINS]
    .map((d) => ({
      d,
      r: blendedRating(app.ratings[d.id], seed, app.answeredByDomain[d.id] ?? 0),
    }))
    .sort((a, b) => a.r - b.r)[0]

  const totalAnswered = Object.values(app.answeredByDomain).reduce((s, n) => s + (n ?? 0), 0)

  return (
    <div className="no-bar h-full overflow-y-auto bg-white px-5 pb-8 pt-[calc(1.25rem+env(safe-area-inset-top))]">
      <h1 className="mb-4 text-[26px] font-extrabold">
        {app.profile?.name ? `${app.profile.name}'s progress` : 'Progress'}
      </h1>

      <Card className="mb-3">
        <div className="mb-2 flex items-center gap-2 text-macaw">
          <Target size={20} />
          <span className="text-[13px] font-extrabold uppercase tracking-wider">Projected score</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-[42px] font-extrabold leading-none">{projected.total}</span>
          <span className="pb-1 text-[15px] font-extrabold text-hare">goal {goal}</span>
        </div>
        <Bar
          value={(projected.total - 400) / (goal - 400)}
          color="var(--color-macaw)"
          className="mt-3"
        />
        <div className="mt-2 flex justify-between text-[13px] font-extrabold text-wolf">
          <span>Reading &amp; Writing {projected.rw}</span>
          <span>Math {projected.math}</span>
        </div>
        <p className="mt-2 text-[12px] font-bold leading-snug text-hare">
          Estimated from {totalAnswered} answered question{totalAnswered === 1 ? '' : 's'}. Early on
          this leans on your goal; it sharpens as you go.
        </p>
      </Card>

      <div className="mb-3 flex gap-3">
        <Card className="flex-1 text-center">
          <div className="mb-1 flex justify-center text-fox">
            <Flame size={26} />
          </div>
          <p className="text-[24px] font-extrabold leading-none">{app.streak}</p>
          <p className="text-[12px] font-extrabold text-hare">day streak</p>
        </Card>
        <Card className="flex-1 text-center">
          <div className="mb-1 flex justify-center text-bee">
            <Bolt size={26} />
          </div>
          <p className="text-[24px] font-extrabold leading-none">{app.xp}</p>
          <p className="text-[12px] font-extrabold text-hare">total XP</p>
        </Card>
        <Card className="flex-1 text-center">
          <div className="mb-1 flex justify-center text-beetle">
            <Trophy size={26} />
          </div>
          <p className="text-[24px] font-extrabold leading-none">{app.completedLessons.length}</p>
          <p className="text-[12px] font-extrabold text-hare">lessons</p>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] font-extrabold uppercase tracking-wider text-hare">
            Last 14 days
          </span>
          {app.freezes > 0 && (
            <span className="rounded-lg bg-macaw-tint px-2 py-1 text-[11px] font-extrabold text-macaw">
              {app.freezes} streak freeze{app.freezes > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <StreakStrip days={app.daysActive} />
      </Card>

      <SectionBlock section="rw" title="Reading &amp; Writing" />
      <SectionBlock section="math" title="Math" />

      <Card className="mt-5">
        <p className="text-[13px] font-extrabold uppercase tracking-wider text-hare">Weakest area</p>
        <p className="mb-3 mt-1 text-[17px] font-extrabold">{DOMAIN_BY_ID[weakest.d.id].label}</p>
        <p className="mb-3 text-[13.5px] font-bold leading-snug text-wolf">
          {DOMAIN_BY_ID[weakest.d.id].blurb}
        </p>
        <Btn full variant="purple" onClick={onPractice}>
          Practice this — 12 questions
        </Btn>
      </Card>
    </div>
  )
}
