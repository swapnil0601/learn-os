import { useState, useRef, useCallback } from 'react'
import { ArrowLeft, Eye, RotateCcw, Check, Zap, Brain } from 'lucide-react'
import { JargonTerm, CATEGORY_COLORS } from '@/types'
import { concepts } from '@/data/concepts'
import { JargonReviewQuality } from '@/hooks/useJargonSR'
import { cn } from '@/lib/utils'

type CardMode = 'term-first' | 'definition-first'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface JargonReviewProps {
  dueTerms: JargonTerm[]
  onReview: (termId: string, quality: JargonReviewQuality) => void
  onBack: () => void
}

export function JargonReview({ dueTerms, onReview, onBack }: JargonReviewProps) {
  // Snapshot the terms on first render so reviews don't shrink the list mid-session
  const shuffledRef = useRef<JargonTerm[]>(shuffle(dueTerms))
  const shuffled = shuffledRef.current

  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [mode, setMode] = useState<CardMode>('term-first')
  const [sessionDone, setSessionDone] = useState(0)

  const current = shuffled[currentIndex] as JargonTerm | undefined
  const parentConcept = current ? concepts.find(c => c.id === current.conceptId) : null
  const colors = parentConcept ? CATEGORY_COLORS[parentConcept.category] : null

  const advance = useCallback((quality: JargonReviewQuality) => {
    if (!current) return
    onReview(current.id, quality)
    setRevealed(false)
    setSessionDone(prev => prev + 1)
    if (currentIndex + 1 < shuffled.length) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setCurrentIndex(shuffled.length) // triggers "done" state
    }
  }, [current, currentIndex, shuffled.length, onReview])

  const isDone = !current || currentIndex >= shuffled.length

  if (shuffled.length === 0) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <div className="bg-card border border-border rounded-xl p-8">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">No Terms Due</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Discover terms by opening concept cards, then come back to drill them.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Codex
          </button>
        </div>
      </div>
    )
  }

  if (isDone) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <div className="bg-card border border-border rounded-xl p-8">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">Session Complete!</h2>
          <p className="text-sm text-muted-foreground mb-1">
            You reviewed <span className="text-primary font-semibold">{sessionDone}</span> term{sessionDone !== 1 ? 's' : ''}.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Come back later when more terms are due.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Codex
          </button>
        </div>
      </div>
    )
  }

  const front = mode === 'term-first' ? current.term : current.definition
  const back = mode === 'term-first' ? current.definition : current.term
  const frontLabel = mode === 'term-first' ? 'Term' : 'Definition'
  const backLabel = mode === 'term-first' ? 'Definition' : 'Term'

  return (
    <div className="max-w-lg mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1} / {shuffled.length}
          </span>
          <button
            onClick={() => setMode(m => m === 'term-first' ? 'definition-first' : 'term-first')}
            className="text-[10px] px-2 py-1 rounded bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Switch card mode"
          >
            {mode === 'term-first' ? 'Term → Def' : 'Def → Term'}
          </button>
        </div>
      </div>

      {/* Flashcard */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        {/* Front */}
        <div className="p-6 border-b border-border">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{frontLabel}</div>
          <p className={cn(
            'font-semibold text-foreground leading-relaxed',
            mode === 'term-first' ? 'text-lg' : 'text-sm',
          )}>
            {front}
          </p>
          {parentConcept && colors && (
            <div className={cn('inline-flex items-center gap-1.5 mt-3 text-[10px] px-2 py-0.5 rounded-full border', colors.bg, colors.border, colors.text)}>
              <div className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
              {parentConcept.title}
            </div>
          )}
        </div>

        {/* Back / Reveal */}
        <div className="p-6">
          {revealed ? (
            <>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{backLabel}</div>
              <p className={cn(
                'text-foreground leading-relaxed',
                mode === 'definition-first' ? 'text-lg font-semibold' : 'text-sm',
              )}>
                {back}
              </p>

              {/* Rating buttons */}
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => advance(0)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Again
                </button>
                <button
                  onClick={() => advance(3)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                >
                  Hard
                </button>
                <button
                  onClick={() => advance(4)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  Good
                </button>
                <button
                  onClick={() => advance(5)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Easy
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium transition-colors"
            >
              <Eye className="h-4 w-4" />
              Reveal {backLabel}
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex) / shuffled.length) * 100}%` }}
        />
      </div>
      <div className="text-[10px] text-muted-foreground text-right mt-1">
        {sessionDone} reviewed this session
      </div>
    </div>
  )
}
