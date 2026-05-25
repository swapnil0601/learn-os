import { useMemo, useState, useEffect } from 'react'
import { X, Lightbulb, AlertTriangle, Info, ArrowRight, Link2, Columns2, BookOpen, Brain } from 'lucide-react'
import { Concept, CardState, CATEGORY_COLORS } from '@/types'
import { ReviewQuality } from '@/utils/sm2'
import { PointQuiz } from './PointQuiz'
import { relationships } from '@/data/relationships'
import { concepts } from '@/data/concepts'
import { jargonTerms } from '@/data/jargon'
import { highlightTerms } from '@/utils/highlightTerms'
import { cn } from '@/lib/utils'

interface DeepDiveCardProps {
  concept: Concept
  cardState?: CardState
  onReview: (conceptId: string, quality: ReviewQuality) => void
  onClose: () => void
  onConceptNavigate?: (conceptId: string) => void
  getCardState?: (conceptId: string) => CardState | undefined
  discoveredTerms?: Set<string>
  onConceptViewed?: (conceptId: string) => void
}

type PanelMode = 'choose' | 'read' | 'test' | 'test-done'

function CardContent({
  concept,
  discoveredTerms,
}: {
  concept: Concept
  discoveredTerms?: Set<string>
}) {
  return (
    <>
      {/* Definition */}
      <div className="flex gap-3">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {discoveredTerms ? highlightTerms(concept.definition, jargonTerms, discoveredTerms) : concept.definition}
        </p>
      </div>

      {/* Key Points */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-foreground">Key Points</h3>
        </div>
        <ul className="space-y-2">
          {concept.keyPoints.map((point, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-primary font-bold shrink-0">{i + 1}.</span>
              <span className="leading-relaxed">
                {discoveredTerms ? highlightTerms(point, jargonTerms, discoveredTerms) : point}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trade-offs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-orange-400" />
          <h3 className="text-sm font-semibold text-foreground">Common Trade-offs</h3>
        </div>
        <ul className="space-y-2">
          {concept.tradeoffs.map((tradeoff, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-orange-400 shrink-0">-</span>
              <span className="leading-relaxed">
                {discoveredTerms ? highlightTerms(tradeoff, jargonTerms, discoveredTerms) : tradeoff}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function RelatedConcepts({
  concept,
  onRelatedClick,
  activeRelatedId,
}: {
  concept: Concept
  onRelatedClick: (conceptId: string) => void
  activeRelatedId?: string | null
}) {
  const relatedConcepts = useMemo(() => {
    const related: { concept: Concept; label: string; direction: 'outgoing' | 'incoming' }[] = []
    const seen = new Set<string>()

    for (const rel of relationships) {
      if (rel.source === concept.id && !seen.has(rel.target)) {
        const target = concepts.find(c => c.id === rel.target)
        if (target) {
          related.push({ concept: target, label: rel.label, direction: 'outgoing' })
          seen.add(rel.target)
        }
      }
      if (rel.target === concept.id && !seen.has(rel.source)) {
        const source = concepts.find(c => c.id === rel.source)
        if (source) {
          related.push({ concept: source, label: rel.label, direction: 'incoming' })
          seen.add(rel.source)
        }
      }
    }
    return related
  }, [concept.id])

  if (relatedConcepts.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="h-4 w-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-foreground">Related Concepts</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {relatedConcepts.map(({ concept: rel, label, direction }) => {
          const relColors = CATEGORY_COLORS[rel.category]
          const isActive = activeRelatedId === rel.id
          return (
            <button
              key={rel.id}
              onClick={() => onRelatedClick(rel.id)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors',
                'hover:bg-secondary/80 cursor-pointer',
                isActive
                  ? 'ring-2 ring-primary border-primary/50 bg-primary/10'
                  : cn(relColors.border, relColors.bg),
              )}
              title={`${direction === 'outgoing' ? concept.title : rel.title} ${label} ${direction === 'outgoing' ? rel.title : concept.title}`}
            >
              <div className={cn('w-1.5 h-1.5 rounded-full', relColors.dot)} />
              <span className={cn('font-medium', relColors.text)}>{rel.title}</span>
              <Columns2 className="h-3 w-3 text-muted-foreground" />
            </button>
          )
        })}
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">Click to view side by side</p>
    </div>
  )
}

function DeepDivePanel({
  concept,
  cardState,
  onReview,
  onClose,
  onRelatedClick,
  activeRelatedId,
  isSecondary,
  discoveredTerms,
}: {
  concept: Concept
  cardState?: CardState
  onReview?: (conceptId: string, quality: ReviewQuality) => void
  onClose: () => void
  onRelatedClick: (conceptId: string) => void
  activeRelatedId?: string | null
  isSecondary?: boolean
  discoveredTerms?: Set<string>
}) {
  const colors = CATEGORY_COLORS[concept.category]
  const [mode, setMode] = useState<PanelMode>(onReview ? 'choose' : 'read')

  // Reset mode when concept changes (split-view navigation)
  useEffect(() => {
    setMode(onReview ? 'choose' : 'read')
  }, [concept.id, onReview])

  return (
    <div className={cn(
      'bg-card border border-border rounded-xl shadow-2xl flex flex-col max-h-[90vh]',
      isSecondary ? 'w-full max-w-xl' : 'w-full max-w-2xl',
    )}>
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4 border-b border-border shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={cn('w-2.5 h-2.5 rounded-full', colors.dot)} />
            <span className={cn('text-xs font-medium uppercase tracking-wider', colors.text)}>
              {concept.category}
            </span>
            {isSecondary && (
              <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                Related
              </span>
            )}
          </div>
          <h2 className={cn('font-bold text-foreground', isSecondary ? 'text-lg' : 'text-xl')}>
            {concept.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5 overflow-y-auto">

        {/* === MODE: CHOOSE === */}
        {mode === 'choose' && (
          <>
            {/* Definition always visible */}
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {discoveredTerms ? highlightTerms(concept.definition, jargonTerms, discoveredTerms) : concept.definition}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMode('test')}
                className="flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-colors"
              >
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold text-foreground">Test Yourself</span>
                <span className="text-[11px] text-muted-foreground text-center">
                  Quiz first, then see the full card
                </span>
              </button>
              <button
                onClick={() => setMode('read')}
                className="flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:bg-secondary/50 hover:border-border transition-colors"
              >
                <BookOpen className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Read Card</span>
                <span className="text-[11px] text-muted-foreground text-center">
                  Study first, test after
                </span>
              </button>
            </div>

            <RelatedConcepts concept={concept} onRelatedClick={onRelatedClick} activeRelatedId={activeRelatedId} />
          </>
        )}

        {/* === MODE: TEST (quiz first, no content visible) === */}
        {mode === 'test' && (
          <>
            {/* Definition as context */}
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {discoveredTerms ? highlightTerms(concept.definition, jargonTerms, discoveredTerms) : concept.definition}
              </p>
            </div>

            {onReview && (
              <PointQuiz
                keyPoints={concept.keyPoints}
                tradeoffs={concept.tradeoffs}
                onComplete={(quality) => {
                  onReview(concept.id, quality)
                  setMode('test-done')
                }}
              />
            )}
          </>
        )}

        {/* === MODE: TEST-DONE (quiz finished, reveal full card) === */}
        {mode === 'test-done' && (
          <>
            <CardContent concept={concept} discoveredTerms={discoveredTerms} />
            <RelatedConcepts concept={concept} onRelatedClick={onRelatedClick} activeRelatedId={activeRelatedId} />

            {cardState && (
              <div className="bg-secondary/50 rounded-lg p-3 text-xs text-muted-foreground flex gap-4">
                <span>Interval: {cardState.interval}d</span>
                <span>Ease: {cardState.easeFactor.toFixed(2)}</span>
                <span>Reps: {cardState.repetitions}</span>
                <span>Next: {cardState.nextReviewDate}</span>
              </div>
            )}
          </>
        )}

        {/* === MODE: READ (full card, quiz at bottom) === */}
        {mode === 'read' && (
          <>
            <CardContent concept={concept} discoveredTerms={discoveredTerms} />
            <RelatedConcepts concept={concept} onRelatedClick={onRelatedClick} activeRelatedId={activeRelatedId} />

            {cardState && (
              <div className="bg-secondary/50 rounded-lg p-3 text-xs text-muted-foreground flex gap-4">
                <span>Interval: {cardState.interval}d</span>
                <span>Ease: {cardState.easeFactor.toFixed(2)}</span>
                <span>Reps: {cardState.repetitions}</span>
                <span>Next: {cardState.nextReviewDate}</span>
              </div>
            )}

            {onReview && (
              <PointQuiz
                keyPoints={concept.keyPoints}
                tradeoffs={concept.tradeoffs}
                onComplete={(quality) => onReview(concept.id, quality)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export function DeepDiveCard({ concept, cardState, onReview, onClose, onConceptNavigate, getCardState, discoveredTerms, onConceptViewed }: DeepDiveCardProps) {
  const [secondaryId, setSecondaryId] = useState<string | null>(null)

  // Fire discovery on mount / concept change
  useEffect(() => {
    onConceptViewed?.(concept.id)
  }, [concept.id, onConceptViewed])

  const secondaryConcept = secondaryId
    ? concepts.find(c => c.id === secondaryId) ?? null
    : null

  const handleRelatedClick = (id: string) => {
    if (secondaryId === id) {
      setSecondaryId(null)
    } else {
      setSecondaryId(id)
    }
  }

  const handleSecondaryRelatedClick = (id: string) => {
    if (id === concept.id) {
      setSecondaryId(null)
    } else {
      setSecondaryId(id)
    }
  }

  const hasSplit = secondaryConcept !== null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={cn(
        'flex gap-4 items-start',
        hasSplit ? 'max-w-[90vw]' : '',
      )}>
        {/* Primary card */}
        <DeepDivePanel
          concept={concept}
          cardState={cardState}
          onReview={onReview}
          onClose={onClose}
          onRelatedClick={handleRelatedClick}
          activeRelatedId={secondaryId}
          discoveredTerms={discoveredTerms}
        />

        {/* Secondary card */}
        {secondaryConcept && (
          <DeepDivePanel
            concept={secondaryConcept}
            cardState={getCardState?.(secondaryConcept.id)}
            onClose={() => setSecondaryId(null)}
            onRelatedClick={handleSecondaryRelatedClick}
            activeRelatedId={concept.id}
            isSecondary
            discoveredTerms={discoveredTerms}
          />
        )}
      </div>
    </div>
  )
}
