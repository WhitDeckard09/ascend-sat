import { Bolt, Flame, Heart, Target } from './icons'

/** The persistent status strip: streak, XP, hearts, and where you are projected
 *  to score. Tapping any of them jumps to the stats screen that explains it. */
export const TopBar = ({
  streak,
  xp,
  hearts,
  unlimited,
  projected,
  goal,
  onOpenTab,
}: {
  streak: number
  xp: number
  hearts: number
  unlimited: boolean
  projected: number
  goal: number
  onOpenTab: (t: string) => void
}) => (
  <div className="shrink-0 border-b-2 border-swan bg-white px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
    <div className="flex items-center justify-between">
      <button onClick={() => onOpenTab('stats')} className="pill text-fox" aria-label={`${streak} day streak`}>
        <Flame size={24} />
        {streak}
      </button>
      <button onClick={() => onOpenTab('stats')} className="pill text-bee" aria-label={`${xp} XP`}>
        <Bolt size={22} />
        {xp}
      </button>
      <button onClick={() => onOpenTab('stats')} className="pill text-macaw" aria-label={`Projected score ${projected}`}>
        <Target size={20} />
        {projected}
        <span className="text-[12px] font-extrabold text-hare">/{goal}</span>
      </button>
      <button
        onClick={() => onOpenTab('settings')}
        className={`pill ${hearts === 0 && !unlimited ? 'text-hare' : 'text-cardinal'}`}
        aria-label={unlimited ? 'Unlimited hearts' : `${hearts} hearts`}
      >
        <Heart size={22} />
        {unlimited ? '∞' : hearts}
      </button>
    </div>
  </div>
)
