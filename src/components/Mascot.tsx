/**
 * Ace — the app's mascot. A pencil rather than an owl: on-theme for studying and
 * not borrowed from anyone. Drawn inline so there are no image assets to load.
 */

export type Mood = 'happy' | 'cheer' | 'sad' | 'think' | 'neutral'

export const Mascot = ({
  size = 120,
  mood = 'happy',
  className = '',
}: {
  size?: number
  mood?: Mood
  className?: string
}) => {
  const eyeY = mood === 'sad' ? 45 : 43
  const browDrop = mood === 'sad' ? 4 : 0

  return (
    <svg width={size} height={size * 1.18} viewBox="0 0 100 118" className={className} aria-hidden>
      {/* eraser */}
      <path d="M28 6h44a10 10 0 0 1 10 10v6H18v-6A10 10 0 0 1 28 6Z" fill="#FF9BB3" />
      <rect x="18" y="21" width="64" height="7" rx="2" fill="#C9CDD4" />

      {/* body */}
      <path d="M18 27h64v58a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V27Z" fill="#FFC800" />
      <path d="M68 27h14v58a8 8 0 0 1-8 8h-6V27Z" fill="#E8B200" />

      {/* wooden tip */}
      <path d="M26 93h48l-14 14a10 10 0 0 1-7 3h-6a10 10 0 0 1-7-3L26 93Z" fill="#F0C99A" />
      <path d="M44 106h12l-3.5 3.5a5 5 0 0 1-3.5 1.4h-1a5 5 0 0 1-3.5-1.4L44 106Z" fill="#3C3C3C" />

      {/* face */}
      {mood === 'cheer' ? (
        <>
          <path d="M31 44q5-7 10 0" fill="none" stroke="#3C3C3C" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M59 44q5-7 10 0" fill="none" stroke="#3C3C3C" strokeWidth="4.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="36" cy={eyeY} rx="7.5" ry="8.5" fill="#fff" />
          <ellipse cx="64" cy={eyeY} rx="7.5" ry="8.5" fill="#fff" />
          <circle cx={mood === 'think' ? 38.5 : 36} cy={eyeY + 1} r="4" fill="#3C3C3C" />
          <circle cx={mood === 'think' ? 66.5 : 64} cy={eyeY + 1} r="4" fill="#3C3C3C" />
          <circle cx={mood === 'think' ? 40 : 37.5} cy={eyeY - 1.5} r="1.5" fill="#fff" />
          <circle cx={mood === 'think' ? 68 : 65.5} cy={eyeY - 1.5} r="1.5" fill="#fff" />
        </>
      )}

      {/* brows */}
      <path
        d={`M29 ${33 + browDrop}q7 -4 14 ${browDrop ? 1 : -1}`}
        fill="none"
        stroke="#3C3C3C"
        strokeWidth="3.4"
        strokeLinecap="round"
        opacity={mood === 'sad' || mood === 'think' ? 0.9 : 0}
      />
      <path
        d={`M57 ${33 + (browDrop ? 1 : 0)}q7 -4 14 ${browDrop ? 4 : -1}`}
        fill="none"
        stroke="#3C3C3C"
        strokeWidth="3.4"
        strokeLinecap="round"
        opacity={mood === 'sad' || mood === 'think' ? 0.9 : 0}
      />

      {/* mouth */}
      {mood === 'sad' ? (
        <path d="M40 68q10 -8 20 0" fill="none" stroke="#3C3C3C" strokeWidth="4" strokeLinecap="round" />
      ) : mood === 'neutral' ? (
        <path d="M41 65h18" fill="none" stroke="#3C3C3C" strokeWidth="4" strokeLinecap="round" />
      ) : (
        <path d="M38 62q12 12 24 0" fill="none" stroke="#3C3C3C" strokeWidth="4.5" strokeLinecap="round" />
      )}

      {/* cheeks */}
      {(mood === 'happy' || mood === 'cheer') && (
        <>
          <ellipse cx="27" cy="60" rx="5" ry="3.5" fill="#FF9BB3" opacity=".55" />
          <ellipse cx="73" cy="60" rx="5" ry="3.5" fill="#FF9BB3" opacity=".55" />
        </>
      )}
    </svg>
  )
}
