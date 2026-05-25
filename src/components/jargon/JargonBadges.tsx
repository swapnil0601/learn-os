import { JargonBadge } from '@/types'
import {
  Scale, Globe, Zap, Inbox, Scissors, Shield, Library, Copy,
  DoorOpen, Gauge, MapPin, Trophy, BookOpen, Crown, Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Scale, Globe, Zap, Inbox, Scissors, Shield, Library, Copy,
  DoorOpen, Gauge, MapPin, Trophy, BookOpen, Crown,
}

interface JargonBadgesProps {
  allBadges: JargonBadge[]
  earnedBadgeIds: Set<string>
  discoveredTerms: Set<string>
}

export function JargonBadges({ allBadges, earnedBadgeIds, discoveredTerms }: JargonBadgesProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
      {allBadges.map(badge => {
        const isEarned = earnedBadgeIds.has(badge.id)
        const Icon = ICON_MAP[badge.icon] ?? Trophy
        const progress = badge.termIds.length > 0
          ? badge.termIds.filter(id => discoveredTerms.has(id)).length
          : 0
        const total = badge.termIds.length

        return (
          <div
            key={badge.id}
            className={cn(
              'shrink-0 w-32 p-3 rounded-lg border text-center transition-all',
              isEarned
                ? 'bg-primary/10 border-primary/50 shadow-lg shadow-primary/10'
                : 'bg-card border-border opacity-60',
            )}
          >
            <div className={cn(
              'mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-2',
              isEarned ? 'bg-primary/20' : 'bg-secondary',
            )}>
              {isEarned ? (
                <Icon className="h-4 w-4 text-primary" />
              ) : (
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
            <div className={cn(
              'text-[10px] font-semibold leading-tight',
              isEarned ? 'text-primary' : 'text-muted-foreground',
            )}>
              {badge.name}
            </div>
            {!isEarned && total > 0 && (
              <div className="text-[9px] text-muted-foreground mt-1">
                {progress}/{total}
              </div>
            )}
            {isEarned && (
              <div className="text-[9px] text-green-400 mt-1">Earned!</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
