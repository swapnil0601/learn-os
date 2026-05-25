import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react'
import { SimLayer, SimRequirement } from '@/types'
import { SimChoiceCardUI } from './SimChoiceCardUI'
import { cn } from '@/lib/utils'

interface SimLayerStepProps {
  layer: SimLayer
  layerIndex: number
  totalLayers: number
  selectedCardId: string | undefined
  requirements: SimRequirement[]
  onChoose: (cardId: string) => void
  onNext: () => void
  onPrev: () => void
}

export function SimLayerStep({
  layer,
  layerIndex,
  totalLayers,
  selectedCardId,
  requirements,
  onChoose,
  onNext,
  onPrev,
}: SimLayerStepProps) {
  const isLast = layerIndex === totalLayers - 1

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {Array.from({ length: totalLayers }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                i < layerIndex ? 'bg-primary' : i === layerIndex ? 'bg-primary/60' : 'bg-secondary'
              )}
            />
          ))}
        </div>

        {/* Layer header */}
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Step {layerIndex + 1} of {totalLayers}
          </span>
          <h2 className="text-lg font-bold text-foreground mt-1">{layer.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{layer.description}</p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {layer.cards.map(card => (
            <SimChoiceCardUI
              key={card.id}
              card={card}
              selected={selectedCardId === card.id}
              onSelect={() => onChoose(card.id)}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={layerIndex === 0}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              layerIndex === 0
                ? 'text-muted-foreground/50 cursor-not-allowed'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <button
            onClick={onNext}
            disabled={!selectedCardId}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all',
              selectedCardId
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                : 'bg-secondary text-muted-foreground/50 cursor-not-allowed'
            )}
          >
            {isLast ? 'See Results' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Requirements side card */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Requirements</h3>
          </div>
          <div className="space-y-2.5">
            {requirements.map(req => (
              <div key={req.id} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <span className="text-xs text-foreground leading-snug">{req.label}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{req.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
