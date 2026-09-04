import type { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'green' | 'blue' | 'red' | 'gold' | 'purple' | 'ghost'

const VARIANT_CLASS: Record<Variant, string> = {
  green: '',
  blue: 'btn3d-blue',
  red: 'btn3d-red',
  gold: 'btn3d-gold',
  purple: 'btn3d-purple',
  ghost: 'btn3d-ghost',
}

export const Btn = ({
  variant = 'green',
  full,
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  full?: boolean
}) => (
  <button
    {...rest}
    className={`btn3d ${VARIANT_CLASS[variant]} ${full ? 'w-full' : ''} ${className}`}
  >
    {children}
  </button>
)

export const Bar = ({
  value,
  color = 'var(--color-grass)',
  height = 16,
  className = '',
}: {
  value: number
  color?: string
  height?: number
  className?: string
}) => (
  <div
    className={`w-full overflow-hidden rounded-full bg-swan ${className}`}
    style={{ height }}
    role="progressbar"
    aria-valuenow={Math.round(value * 100)}
    aria-valuemin={0}
    aria-valuemax={100}
  >
    <div
      className="relative h-full rounded-full transition-[width] duration-500 ease-out"
      style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color }}
    >
      {/* the little highlight along the top of the fill */}
      <span
        className="absolute inset-x-[6px] top-[3px] h-[4px] rounded-full bg-white/35"
        style={{ display: value > 0.06 ? 'block' : 'none' }}
      />
    </div>
  </div>
)

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`card p-4 ${className}`}>{children}</div>
)

export const Sheet = ({
  tone,
  children,
}: {
  tone: 'correct' | 'wrong'
  children: ReactNode
}) => (
  <div
    className="anim-slide-up fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] px-5 pb-6 pt-4"
    style={{
      background: tone === 'correct' ? 'var(--color-grass-tint)' : 'var(--color-cardinal-tint)',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      boxShadow: '0 -2px 0 rgba(0,0,0,.06)',
      paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
    }}
  >
    {children}
  </div>
)
