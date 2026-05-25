import { Check, Minus } from 'lucide-react'
import { SimChoiceCard, SimTraitId, SIM_TRAIT_LABELS } from '@/types'
import { cn } from '@/lib/utils'

interface SimChoiceCardUIProps {
  card: SimChoiceCard
  selected: boolean
  onSelect: () => void
}

const TRAIT_ORDER: SimTraitId[] = [
  'read-throughput', 'write-throughput', 'latency', 'consistency',
  'availability', 'durability', 'horizontal-scale', 'cost-efficiency',
]

function TraitBar({ traitId, value }: { traitId: SimTraitId; value: number }) {
  const pct = (value / 10) * 100
  const color = value >= 8 ? 'bg-green-500' : value >= 5 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground w-24 shrink-0 truncate">
        {SIM_TRAIT_LABELS[traitId]}
      </span>
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-muted-foreground w-4 text-right">{value}</span>
    </div>
  )
}

export function SimChoiceCardUI({ card, selected, onSelect }: SimChoiceCardUIProps) {
  const activeTraits = TRAIT_ORDER.filter(t => card.traits[t] !== undefined)

  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative flex flex-col text-left p-4 rounded-xl border transition-all duration-200 w-full',
        selected
          ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/30'
          : 'bg-card border-border hover:border-muted-foreground/50 hover:shadow-md'
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}

      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-bold text-foreground">{card.name}</h3>
        <p className="text-[10px] text-muted-foreground">{card.subtitle}</p>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{card.description}</p>

      {/* Pros / Cons */}
      <div className="space-y-1.5 mb-3">
        {card.pros.map((pro, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <Check className="h-3 w-3 text-green-400 shrink-0 mt-0.5" />
            <span className="text-[10px] text-green-300">{pro}</span>
          </div>
        ))}
        {card.cons.map((con, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <Minus className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />
            <span className="text-[10px] text-red-300">{con}</span>
          </div>
        ))}
      </div>

      {/* Trait bars */}
      <div className="space-y-1.5">
        {activeTraits.map(traitId => (
          <TraitBar key={traitId} traitId={traitId} value={card.traits[traitId]!} />
        ))}
      </div>
    </button>
  )
}
