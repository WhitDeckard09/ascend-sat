import type { Section } from '../data/types'
import { Book, Sqrt } from './icons'

/** The two trails, with how far along each one you are. */
export interface TrackSummary {
  done: number
  total: number
}

/**
 * Segmented control for switching between the Reading & Writing trail and the
 * Math trail. Book on the left, radical on the right.
 */
export const TrackToggle = ({
  value,
  onChange,
  rw,
  math,
}: {
  value: Section
  onChange: (s: Section) => void
  rw: TrackSummary
  math: TrackSummary
}) => {
  const sides: { id: Section; icon: typeof Book; label: string; color: string; sum: TrackSummary }[] = [
    { id: 'rw', icon: Book, label: 'Reading & Writing', color: 'macaw', sum: rw },
    { id: 'math', icon: Sqrt, label: 'Math', color: 'grass', sum: math },
  ]

  return (
    <div
      className="flex gap-1 rounded-full border-2 border-swan bg-polar p-1"
      role="tablist"
      aria-label="Study track"
    >
      {sides.map(({ id, icon: Icon, label, color, sum }) => {
        const active = value === id
        const complete = sum.total > 0 && sum.done >= sum.total
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            aria-label={`${label}, ${sum.done} of ${sum.total} lessons done`}
            onClick={() => onChange(id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-2 transition-colors"
            style={{
              background: active ? `var(--color-${color})` : 'transparent',
              color: active ? '#fff' : 'var(--color-hare)',
              boxShadow: active ? `0 2px 0 var(--color-${color}-edge)` : 'none',
            }}
          >
            <Icon size={20} />
            <span className="text-[13px] font-extrabold tabular-nums">
              {complete ? '✓' : `${sum.done}/${sum.total}`}
            </span>
          </button>
        )
      })}
    </div>
  )
}
