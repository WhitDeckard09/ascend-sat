/** Flat, chunky icons drawn inline so the app ships with no image assets. */

type P = { size?: number; className?: string }

export const Flame = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      d="M12 3c.6 3.2-1.2 4.6-2.7 6C7.4 10.7 6 12.3 6 15a6 6 0 0 0 12 0c0-2.4-1.1-3.9-2.3-5.3-.5 1-1.2 1.6-2 1.9.6-2.4-.2-5.6-1.7-8.6Z"
      fill="currentColor"
    />
  </svg>
)

export const Heart = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      d="M12 20S3.5 14.5 3.5 8.7A4.7 4.7 0 0 1 12 5.9a4.7 4.7 0 0 1 8.5 2.8C20.5 14.5 12 20 12 20Z"
      fill="currentColor"
    />
  </svg>
)

export const Bolt = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M13.5 2 4 13.5h6L9.5 22 20 10.5h-6.5L13.5 2Z" fill="currentColor" />
  </svg>
)

export const Target = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
  </svg>
)

export const Star = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      d="M12.00 3.68 14.49 9.45 20.75 10.04 16.02 14.19 17.41 20.32 12.00 17.11 6.59 20.32 7.98 14.19 3.25 10.04 9.51 9.45Z"
      fill="currentColor"
    />
  </svg>
)

export const Lock = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <rect x="4.5" y="10" width="15" height="10.5" rx="3" fill="currentColor" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="currentColor" strokeWidth="2.6" />
  </svg>
)

export const Check = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="m5 12.5 4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Cross = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
  </svg>
)

export const Chart = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <rect x="3.5" y="12" width="4.5" height="8.5" rx="1.6" fill="currentColor" />
    <rect x="9.8" y="7" width="4.5" height="13.5" rx="1.6" fill="currentColor" />
    <rect x="16" y="3.5" width="4.5" height="17" rx="1.6" fill="currentColor" />
  </svg>
)

export const Book = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M4 4.5h6a2.5 2.5 0 0 1 2 2v13a2 2 0 0 0-2-1.6H4Z" fill="currentColor" />
    <path d="M20 4.5h-6a2.5 2.5 0 0 0-2 2v13a2 2 0 0 1 2-1.6h6Z" fill="currentColor" opacity=".55" />
  </svg>
)

export const Sqrt = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      d="M3.5 12.5H7l3.5 7L16 4.5h4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const Gear = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8 3.5c0 .5 0 1-.1 1.4l2 1.6-2 3.4-2.4-1a7.6 7.6 0 0 1-2.4 1.4L14.7 21H9.3l-.4-2.2a7.6 7.6 0 0 1-2.4-1.4l-2.4 1-2-3.4 2-1.6a8 8 0 0 1 0-2.8l-2-1.6 2-3.4 2.4 1a7.6 7.6 0 0 1 2.4-1.4L9.3 3h5.4l.4 2.2c.9.3 1.7.8 2.4 1.4l2.4-1 2 3.4-2 1.6c.1.4.1.9.1 1.4Z"
      fill="currentColor"
    />
  </svg>
)

export const Trophy = ({ size = 22, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M7 3h10v5a5 5 0 0 1-10 0V3Z" fill="currentColor" />
    <path d="M7 4.5H4.5v1.8A3.2 3.2 0 0 0 7.7 9.5M17 4.5h2.5v1.8a3.2 3.2 0 0 1-3.2 3.2" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M10 13h4v3.5h3V21H7v-4.5h3V13Z" fill="currentColor" />
  </svg>
)
