import { useEffect, useMemo, useRef } from 'react'
import { DOMAIN_BY_ID } from '../data/types'
import type { PlannedLesson, PlannedUnit } from '../engine/planner'
import { trackLessons, trackUnits } from '../engine/planner'
import type { Section } from '../data/types'
import { TrackToggle } from '../components/TrackToggle'
import { projectScore } from '../engine/rating'
import { Book, Check, Lock, Star, Trophy } from '../components/icons'
import { Mascot } from '../components/Mascot'
import { useApp, currentHearts, setTrack } from '../store/store'
import { TopBar } from '../components/TopBar'

/** Horizontal offsets that give the path its wandering, hand-laid feel. */
const OFFSETS = [0, -38, -62, -38, 0, 38, 62, 38]

const NodeButton = ({
  state,
  color,
  onClick,
  isReview,
}: {
  state: 'done' | 'current' | 'locked'
  color: string
  onClick: () => void
  isReview: boolean
}) => {
  const fill =
    state === 'locked' ? 'var(--color-swan)' : `var(--color-${color})`
  const edge =
    state === 'locked' ? '#cfcfcf' : `var(--color-${color}-edge)`

  return (
    <button
      onClick={onClick}
      disabled={state === 'locked'}
      aria-label={isReview ? 'Unit review' : 'Lesson'}
      className="relative z-10 grid h-[68px] w-[68px] place-items-center rounded-full transition-transform active:translate-y-[6px]"
      style={{
        background: fill,
        boxShadow: `0 6px 0 ${edge}`,
        color: state === 'locked' ? 'var(--color-hare)' : '#fff',
      }}
    >
      {state === 'done' ? (
        <Check size={32} />
      ) : state === 'locked' ? (
        <Lock size={28} />
      ) : isReview ? (
        <Trophy size={32} />
      ) : (
        <Star size={32} />
      )}
    </button>
  )
}

const UnitBanner = ({ unit, done, total }: { unit: PlannedUnit; done: number; total: number }) => {
  const meta = DOMAIN_BY_ID[unit.primaryDomain]
  return (
    <div
      className="mx-4 mb-6 mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-white"
      style={{
        background: `var(--color-${unit.color})`,
        boxShadow: `0 4px 0 var(--color-${unit.color}-edge)`,
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-extrabold uppercase tracking-wider opacity-90">
          {unit.title} · {done}/{total}
        </p>
        <p className="truncate text-[17px] font-extrabold">{meta.label}</p>
      </div>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/25">
        <Book size={20} />
      </div>
    </div>
  )
}

export const Path = ({ onStart, onOpenTab }: { onStart: (lesson: PlannedLesson) => void; onOpenTab: (t: string) => void }) => {
  const app = useApp()
  const currentRef = useRef<HTMLDivElement>(null)

  const plan = app.plan!
  const track: Section = app.activeTrack
  const done = useMemo(() => new Set(app.completedLessons), [app.completedLessons])

  const units = useMemo(() => trackUnits(plan, track), [plan, track])
  const flat = useMemo(() => trackLessons(plan, track), [plan, track])
  const currentId = flat.find((l) => !done.has(l.id))?.id ?? null

  /** Lessons finished per trail, for the toggle's counters. */
  const summary = useMemo(() => {
    const count = (s: Section) => {
      const all = trackLessons(plan, s)
      return { done: all.filter((l) => done.has(l.id)).length, total: all.length }
    }
    return { rw: count('rw'), math: count('math') }
  }, [plan, done])

  const projected = projectScore(app.ratings, app.profile?.goalScore ?? 1300, app.answeredByDomain)
  const hearts = currentHearts(app)

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [currentId, track])

  const allDone = currentId === null

  return (
    <div className="flex h-full flex-col bg-white">
      <TopBar
        streak={app.streak}
        xp={app.xp}
        hearts={hearts}
        unlimited={app.unlimitedHearts}
        projected={projected.total}
        goal={app.profile?.goalScore ?? 1400}
        onOpenTab={onOpenTab}
      />

      <div className="shrink-0 border-b-2 border-swan bg-white px-4 py-2.5">
        <TrackToggle value={track} onChange={setTrack} rw={summary.rw} math={summary.math} />
      </div>

      <div className="no-bar flex-1 overflow-y-auto pb-8">
        {allDone && (
          <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl bg-grass-tint p-4">
            <Mascot size={64} mood="cheer" />
            <div>
              <p className="text-[16px] font-extrabold text-[#3f8c00]">
                {track === 'rw' ? 'Reading & Writing done!' : 'Math done!'}
              </p>
              <p className="text-[13px] font-bold text-wolf">
                {summary[track === 'rw' ? 'math' : 'rw'].done <
                summary[track === 'rw' ? 'math' : 'rw'].total
                  ? 'Switch tracks above to keep going.'
                  : 'Both trails finished. Head to Review to drill what you missed.'}
              </p>
            </div>
          </div>
        )}

        {units.map((unit) => {
          const unitDone = unit.lessons.filter((l) => done.has(l.id)).length
          return (
            <section key={unit.index}>
              <UnitBanner unit={unit} done={unitDone} total={unit.lessons.length} />
              <div className="flex flex-col items-center gap-10 pt-7 pb-6">
                {unit.lessons.map((lesson, i) => {
                  const isDone = done.has(lesson.id)
                  const isCurrent = lesson.id === currentId
                  const state = isDone ? 'done' : isCurrent ? 'current' : 'locked'
                  const offset = OFFSETS[(unit.index * 3 + i) % OFFSETS.length]

                  return (
                    <div
                      key={lesson.id}
                      ref={isCurrent ? currentRef : undefined}
                      className="relative"
                      style={{ transform: `translateX(${offset}px)` }}
                    >
                      {isCurrent && (
                        <div
                          className="anim-bob absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl border-2 px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-wide"
                          style={{
                            color: `var(--color-${unit.color})`,
                            borderColor: 'var(--color-swan)',
                            background: '#fff',
                            boxShadow: '0 2px 0 var(--color-swan)',
                          }}
                        >
                          Start
                          <span
                            className="absolute -bottom-[7px] left-1/2 block h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-swan bg-white"
                            aria-hidden
                          />
                        </div>
                      )}
                      {/* Halo marking the node you are on. It carries the same
                          6px bottom edge as the button so the two discs read as
                          concentric; a flat ring would sit visibly high. */}
                      {isCurrent && (
                        <span
                          className="pointer-events-none absolute -inset-[7px] rounded-full"
                          style={{
                            background: `color-mix(in srgb, var(--color-${unit.color}) 24%, #fff)`,
                            boxShadow: `0 6px 0 color-mix(in srgb, var(--color-${unit.color}-edge) 30%, #fff)`,
                          }}
                        />
                      )}
                      <NodeButton
                        state={state}
                        color={unit.color}
                        isReview={lesson.kind === 'review'}
                        onClick={() => onStart(lesson)}
                      />
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
