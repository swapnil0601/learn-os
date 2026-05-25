import { useState, useMemo, useCallback } from 'react'
import { Check, X, Brain, Eye } from 'lucide-react'
import { ReviewQuality } from '@/utils/sm2'
import { cn } from '@/lib/utils'

interface PointQuizProps {
  keyPoints: string[]
  tradeoffs: string[]
  onComplete: (quality: ReviewQuality) => void
}

type PointStatus = 'hidden' | 'revealed' | 'knew' | 'missed'

function scoreToQuality(ratio: number): ReviewQuality {
  if (ratio >= 0.9) return 5
  if (ratio >= 0.6) return 4
  if (ratio >= 0.3) return 3
  return 0
}

function qualityLabel(q: ReviewQuality): { text: string; color: string } {
  if (q === 5) return { text: 'Easy', color: 'text-blue-400' }
  if (q === 4) return { text: 'Good', color: 'text-emerald-400' }
  if (q === 3) return { text: 'Hard', color: 'text-amber-400' }
  return { text: 'Again', color: 'text-red-400' }
}

/**
 * Split a point into a visible hint and a hidden answer.
 * Tries natural break points: " — ", ": ", "; ", " - ", ", "
 * Falls back to splitting roughly in half at a word boundary.
 */
function splitPoint(text: string): { hint: string; answer: string } {
  // Try splitting on strong delimiters first
  const delimiters = [' — ', ': ', '; ']
  for (const d of delimiters) {
    const idx = text.indexOf(d)
    // Only split if delimiter is in a reasonable position (20-80% of text)
    if (idx > text.length * 0.15 && idx < text.length * 0.75) {
      return {
        hint: text.slice(0, idx + d.length).trim(),
        answer: text.slice(idx + d.length).trim(),
      }
    }
  }

  // Try weaker delimiters
  const weakDelimiters = [', ', ' - ']
  for (const d of weakDelimiters) {
    const idx = text.indexOf(d, Math.floor(text.length * 0.25))
    if (idx > 0 && idx < text.length * 0.65) {
      return {
        hint: text.slice(0, idx + d.length).trim(),
        answer: text.slice(idx + d.length).trim(),
      }
    }
  }

  // Fallback: split at ~40% on a word boundary
  const target = Math.floor(text.length * 0.4)
  const spaceAfter = text.indexOf(' ', target)
  if (spaceAfter > 0 && spaceAfter < text.length * 0.7) {
    return {
      hint: text.slice(0, spaceAfter).trim(),
      answer: text.slice(spaceAfter).trim(),
    }
  }

  // Last resort
  return { hint: text, answer: '' }
}

export function PointQuiz({ keyPoints, tradeoffs, onComplete }: PointQuizProps) {
  const allPoints = useMemo(() => [
    ...keyPoints.map(p => ({ ...splitPoint(p), full: p, type: 'key' as const })),
    ...tradeoffs.map(p => ({ ...splitPoint(p), full: p, type: 'tradeoff' as const })),
  ], [keyPoints, tradeoffs])

  const [statuses, setStatuses] = useState<PointStatus[]>(() => allPoints.map(() => 'hidden'))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [phase, setPhase] = useState<'quiz' | 'result'>('quiz')

  const currentStatus = statuses[currentIdx]

  const reveal = useCallback(() => {
    setStatuses(prev => {
      const next = [...prev]
      next[currentIdx] = 'revealed'
      return next
    })
  }, [currentIdx])

  const mark = useCallback((knew: boolean) => {
    setStatuses(prev => {
      const next = [...prev]
      next[currentIdx] = knew ? 'knew' : 'missed'
      return next
    })
    if (currentIdx + 1 >= allPoints.length) {
      setPhase('result')
    } else {
      setCurrentIdx(prev => prev + 1)
    }
  }, [currentIdx, allPoints.length])

  // Result screen
  if (phase === 'result' || currentIdx >= allPoints.length) {
    const knewCount = statuses.filter(s => s === 'knew').length
    const total = allPoints.length
    const ratio = total > 0 ? knewCount / total : 0
    const quality = scoreToQuality(ratio)
    const label = qualityLabel(quality)

    return (
      <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">Quiz Complete</h4>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {knewCount}/{total}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Retention rated as <span className={cn('font-bold', label.color)}>{label.text}</span>
          </span>
          <button
            onClick={() => onComplete(quality)}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Save Review
          </button>
        </div>

        {/* Point summary */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          {allPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px]">
              {statuses[i] === 'knew' ? (
                <Check className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <X className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />
              )}
              <span className={cn(
                'leading-relaxed',
                statuses[i] === 'knew' ? 'text-muted-foreground' : 'text-red-400/80',
              )}>
                {point.full}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const point = allPoints[currentIdx]
  const isKeyPoint = point.type === 'key'
  const pointNum = isKeyPoint ? currentIdx + 1 : currentIdx - keyPoints.length + 1
  const sectionLabel = isKeyPoint ? `Key Point ${pointNum}/${keyPoints.length}` : `Trade-off ${pointNum}/${tradeoffs.length}`

  return (
    <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Test Yourself</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {currentIdx + 1} / {allPoints.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1">
        {allPoints.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i === currentIdx ? 'bg-primary' :
              statuses[i] === 'knew' ? 'bg-emerald-500' :
              statuses[i] === 'missed' ? 'bg-red-500' :
              'bg-secondary',
            )}
          />
        ))}
      </div>

      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {sectionLabel}
      </div>

      {/* Cloze card */}
      <div className="rounded-lg border border-border bg-card p-3 space-y-2">
        {/* Always-visible hint */}
        <p className="text-sm text-foreground leading-relaxed">
          {point.hint}
          {point.answer && (
            <span className="text-muted-foreground/40">{' '}...</span>
          )}
        </p>

        {currentStatus === 'hidden' ? (
          /* Hidden answer — user tries to recall */
          <div>
            {point.answer && (
              <div className="bg-muted/50 rounded-md px-3 py-2 mb-3 border border-dashed border-border">
                <span className="text-xs text-muted-foreground/50 italic select-none">
                  Can you complete this? What comes next?
                </span>
              </div>
            )}
            <button
              onClick={reveal}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              Show Answer
            </button>
          </div>
        ) : (
          /* Revealed answer */
          <div className="space-y-3">
            {point.answer && (
              <div className="bg-primary/5 rounded-md px-3 py-2 border border-primary/20">
                <p className="text-sm text-primary font-medium leading-relaxed">
                  {point.answer}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => mark(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Didn't know
              </button>
              <button
                onClick={() => mark(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                Knew it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
