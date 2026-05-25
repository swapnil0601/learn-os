import { useState, useEffect } from 'react'
import { X, Sparkles, ArrowRight } from 'lucide-react'
import { JargonTerm, CATEGORY_COLORS } from '@/types'
import { concepts } from '@/data/concepts'
import { cn } from '@/lib/utils'

interface DailyJargonFlashProps {
  term: JargonTerm
  onLearnMore: (conceptId: string) => void
  onDismiss: () => void
}

export function DailyJargonFlash({ term, onLearnMore, onDismiss }: DailyJargonFlashProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const parentConcept = concepts.find(c => c.id === term.conceptId)
  const colors = parentConcept ? CATEGORY_COLORS[parentConcept.category] : null

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-40 w-80 transition-all duration-500',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
      )}
    >
      <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-primary/5 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Daily Jargon</span>
          </div>
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-secondary transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-foreground mb-1.5">{term.term}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {term.definition}
          </p>

          {parentConcept && (
            <button
              onClick={() => onLearnMore(term.conceptId)}
              className={cn(
                'flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors',
                'hover:bg-secondary/80',
                colors?.border, colors?.bg, colors?.text,
              )}
            >
              Learn in: {parentConcept.title}
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
