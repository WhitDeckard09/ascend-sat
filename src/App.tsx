import { useState } from 'react'
import type { PlannedLesson } from './engine/planner'
import { DOMAINS } from './data/types'
import { blendedRating, seedRatingForGoal } from './engine/rating'
import { Onboarding } from './screens/Onboarding'
import { Path } from './screens/Path'
import { Lesson } from './screens/Lesson'
import type { AnswerLog } from './screens/Lesson'
import { Recap } from './screens/Recap'
import { Stats } from './screens/Stats'
import { Review } from './screens/Review'
import { Settings } from './screens/Settings'
import { Book, Chart, Gear, Star } from './components/icons'
import { getState, useApp } from './store/store'

type Tab = 'path' | 'review' | 'stats' | 'settings'

interface Finished {
  log: AnswerLog[]
  xp: number
  routedUp: boolean
  elapsedMs: number
}

const TABS: { id: Tab; label: string; icon: typeof Star }[] = [
  { id: 'path', label: 'Learn', icon: Star },
  { id: 'review', label: 'Review', icon: Book },
  { id: 'stats', label: 'Stats', icon: Chart },
  { id: 'settings', label: 'You', icon: Gear },
]

const BottomNav = ({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) => (
  <nav className="shrink-0 border-t-2 border-swan bg-white pb-[env(safe-area-inset-bottom)]">
    <div className="flex">
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = tab === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-current={active ? 'page' : undefined}
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5"
            style={{ color: active ? 'var(--color-macaw)' : 'var(--color-hare)' }}
          >
            <span
              className="grid h-9 w-14 place-items-center rounded-xl"
              style={{ background: active ? 'var(--color-macaw-tint)' : 'transparent' }}
            >
              <Icon size={24} />
            </span>
            <span className="text-[10.5px] font-extrabold uppercase tracking-wide">{label}</span>
          </button>
        )
      })}
    </div>
  </nav>
)

/** Builds an off-path drill on whichever domain is currently weakest. */
const practiceLesson = (): PlannedLesson => {
  const s = getState()
  const seed = seedRatingForGoal(s.profile?.goalScore ?? 1300)
  const weakest = [...DOMAINS].sort(
    (a, b) =>
      blendedRating(s.ratings[a.id], seed, s.answeredByDomain[a.id] ?? 0) -
      blendedRating(s.ratings[b.id], seed, s.answeredByDomain[b.id] ?? 0),
  )[0]
  return {
    id: `practice-${weakest.id}-${Date.now()}`,
    domains: [weakest.id],
    kind: 'lesson',
    unitIndex: -1,
    indexInUnit: 0,
  }
}

export const App = () => {
  const app = useApp()
  const [tab, setTab] = useState<Tab>('path')
  const [lesson, setLesson] = useState<PlannedLesson | null>(null)
  const [finished, setFinished] = useState<Finished | null>(null)

  if (!app.profile || !app.plan) return <Onboarding />

  if (finished) {
    return (
      <Recap
        log={finished.log}
        xp={finished.xp}
        routedUp={finished.routedUp}
        elapsedMs={finished.elapsedMs}
        onDone={() => {
          setFinished(null)
          setLesson(null)
        }}
      />
    )
  }

  if (lesson) {
    return (
      <Lesson
        key={lesson.id}
        lesson={lesson}
        onQuit={() => setLesson(null)}
        onFinish={({ log, xp, routedUp, elapsedMs }) => setFinished({ log, xp, routedUp, elapsedMs })}
      />
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        {tab === 'path' && (
          <Path onStart={setLesson} onOpenTab={(t) => setTab(t as Tab)} />
        )}
        {tab === 'review' && <Review />}
        {tab === 'stats' && <Stats onPractice={() => setLesson(practiceLesson())} />}
        {tab === 'settings' && <Settings />}
      </div>
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  )
}
