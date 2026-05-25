import { useState, useMemo } from 'react'
import { BookMarked, Search, ChevronDown, ChevronRight, HelpCircle, Brain } from 'lucide-react'
import { JargonTerm, JargonBadge, CATEGORY_COLORS, Category } from '@/types'
import { jargonTerms, jargonBadges } from '@/data/jargon'
import { concepts } from '@/data/concepts'
import { JargonBadges } from './JargonBadges'
import { JargonReview } from './JargonReview'
import { JargonReviewQuality } from '@/hooks/useJargonSR'
import { cn } from '@/lib/utils'

interface JargonCodexProps {
  discoveredTerms: Set<string>
  earnedBadges: JargonBadge[]
  onConceptNavigate: (conceptId: string) => void
  dueTerms: JargonTerm[]
  onJargonReview: (termId: string, quality: JargonReviewQuality) => void
  jargonDueCount: number
}

export function JargonCodex({ discoveredTerms, earnedBadges, onConceptNavigate, dueTerms, onJargonReview, jargonDueCount }: JargonCodexProps) {
  const [search, setSearch] = useState('')
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null)
  const [showDrill, setShowDrill] = useState(false)

  const earnedBadgeIds = useMemo(
    () => new Set(earnedBadges.map(b => b.id)),
    [earnedBadges]
  )

  // Group terms by concept
  const groupedTerms = useMemo(() => {
    const groups: { conceptId: string; conceptTitle: string; category: Category; terms: typeof jargonTerms }[] = []
    const conceptMap = new Map<string, typeof jargonTerms>()

    for (const term of jargonTerms) {
      if (!conceptMap.has(term.conceptId)) conceptMap.set(term.conceptId, [])
      conceptMap.get(term.conceptId)!.push(term)
    }

    for (const [conceptId, terms] of conceptMap) {
      const concept = concepts.find(c => c.id === conceptId)
      if (concept) {
        groups.push({ conceptId, conceptTitle: concept.title, category: concept.category, terms })
      }
    }

    return groups.sort((a, b) => a.conceptTitle.localeCompare(b.conceptTitle))
  }, [])

  // Filter by search
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groupedTerms
    const q = search.toLowerCase()
    return groupedTerms
      .map(group => ({
        ...group,
        terms: group.terms.filter(t =>
          t.term.toLowerCase().includes(q) ||
          (discoveredTerms.has(t.id) && t.definition.toLowerCase().includes(q))
        ),
      }))
      .filter(g => g.terms.length > 0)
  }, [search, groupedTerms, discoveredTerms])

  const discoveredCount = discoveredTerms.size
  const totalCount = jargonTerms.length
  const progress = totalCount > 0 ? (discoveredCount / totalCount) * 100 : 0

  if (showDrill) {
    return (
      <JargonReview
        dueTerms={dueTerms}
        onReview={onJargonReview}
        onBack={() => setShowDrill(false)}
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BookMarked className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Jargon Codex</h1>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {discoveredCount}/{totalCount}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Discover terms by studying concepts. Open any card to reveal its jargon.
        </p>

        {/* Progress bar */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-[10px] text-muted-foreground">
            {Math.round(progress)}% discovered
          </div>
          {jargonDueCount > 0 && (
            <button
              onClick={() => setShowDrill(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              <Brain className="h-3.5 w-3.5" />
              Vocab Drill
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                {jargonDueCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Achievements</h2>
        <JargonBadges
          allBadges={jargonBadges}
          earnedBadgeIds={earnedBadgeIds}
          discoveredTerms={discoveredTerms}
        />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Term groups */}
      <div className="space-y-2">
        {filteredGroups.map(group => {
          const colors = CATEGORY_COLORS[group.category]
          const isExpanded = expandedConcept === group.conceptId
          const groupDiscovered = group.terms.filter(t => discoveredTerms.has(t.id)).length

          return (
            <div key={group.conceptId} className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/30 transition-colors"
                onClick={() => setExpandedConcept(isExpanded ? null : group.conceptId)}
              >
                <div className={cn('w-2 h-2 rounded-full shrink-0', colors.dot)} />
                <span className="text-sm font-medium text-foreground flex-1">{group.conceptTitle}</span>
                <span className="text-[10px] text-muted-foreground">
                  {groupDiscovered}/{group.terms.length}
                </span>
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-border px-3 pb-3 pt-2 space-y-2">
                  {group.terms.map(term => {
                    const isDiscovered = discoveredTerms.has(term.id)
                    return (
                      <div
                        key={term.id}
                        className={cn(
                          'p-2.5 rounded-md border',
                          isDiscovered
                            ? 'border-border bg-secondary/30'
                            : 'border-border/50 bg-secondary/10',
                        )}
                      >
                        {isDiscovered ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-primary">{term.term}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                              {term.definition}
                            </p>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/40" />
                            <span className="text-xs text-muted-foreground/50 italic">
                              ??? — Study "{group.conceptTitle}" to reveal
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <button
                    className="text-[10px] text-primary hover:underline mt-1"
                    onClick={() => onConceptNavigate(group.conceptId)}
                  >
                    Open {group.conceptTitle} card →
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No terms found matching "{search}"
        </div>
      )}
    </div>
  )
}
