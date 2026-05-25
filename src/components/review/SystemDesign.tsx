import { useState } from 'react'
import { BookOpen, BookMarked } from 'lucide-react'
import { Concept, CardState, JargonTerm, JargonBadge } from '@/types'
import { ReviewQuality } from '@/utils/sm2'
import { JargonReviewQuality } from '@/hooks/useJargonSR'
import { ReviewDashboard } from './ReviewDashboard'
import { JargonCodex } from '@/components/jargon/JargonCodex'
import { cn } from '@/lib/utils'

type SubTab = 'concepts' | 'words'

interface SystemDesignProps {
  // Concept review props
  dueCards: Concept[]
  getCardState: (conceptId: string) => CardState | undefined
  onReview: (conceptId: string, quality: ReviewQuality) => void
  discoveredTerms: Set<string>
  onConceptViewed: (conceptId: string) => void
  // Jargon codex props
  earnedBadges: JargonBadge[]
  onConceptNavigate: (conceptId: string) => void
  dueTerms: JargonTerm[]
  onJargonReview: (termId: string, quality: JargonReviewQuality) => void
  jargonDueCount: number
}

export function SystemDesign({
  dueCards, getCardState, onReview, discoveredTerms, onConceptViewed,
  earnedBadges, onConceptNavigate, dueTerms, onJargonReview, jargonDueCount,
}: SystemDesignProps) {
  const [tab, setTab] = useState<SubTab>('concepts')

  return (
    <div>
      {/* Sub-tab bar */}
      <div className="max-w-3xl mx-auto px-6 pt-4">
        <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setTab('concepts')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              tab === 'concepts'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <BookOpen className="h-4 w-4" />
            Concepts
          </button>
          <button
            onClick={() => setTab('words')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              tab === 'words'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <BookMarked className="h-4 w-4" />
            Words
            {jargonDueCount > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                {jargonDueCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {tab === 'concepts' && (
        <ReviewDashboard
          dueCards={dueCards}
          getCardState={getCardState}
          onReview={onReview}
          discoveredTerms={discoveredTerms}
          onConceptViewed={onConceptViewed}
        />
      )}

      {tab === 'words' && (
        <JargonCodex
          discoveredTerms={discoveredTerms}
          earnedBadges={earnedBadges}
          onConceptNavigate={onConceptNavigate}
          dueTerms={dueTerms}
          onJargonReview={onJargonReview}
          jargonDueCount={jargonDueCount}
        />
      )}
    </div>
  )
}
