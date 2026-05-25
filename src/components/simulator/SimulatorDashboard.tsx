import { useState, useMemo } from 'react'
import { Gamepad2, Clock, Trophy, ChevronRight, Zap, Layers, Check, Minus, ChevronDown } from 'lucide-react'
import { SimChoiceCard, SimTraitId, SIM_TRAIT_LABELS } from '@/types'
import { simScenarios } from '@/data/simScenarios'
import { useSimulator } from '@/hooks/useSimulator'
import { useSimSR, SimReviewQuality } from '@/hooks/useSimSR'
import { SimLayerStep } from './SimLayerStep'
import { SimResults } from './SimResults'
import { cn } from '@/lib/utils'

type SimTab = 'scenarios' | 'collection'

const LAYER_CATEGORIES: { key: string; label: string; match: string; color: string; dot: string }[] = [
  { key: 'database', label: 'Databases', match: '-db', color: 'text-emerald-400', dot: 'bg-emerald-500' },
  { key: 'cache', label: 'Caching', match: '-cache', color: 'text-blue-400', dot: 'bg-blue-500' },
  { key: 'queue', label: 'Message Queues', match: '-queue', color: 'text-amber-400', dot: 'bg-amber-500' },
  { key: 'lb', label: 'Load Balancers', match: '-lb', color: 'text-violet-400', dot: 'bg-violet-500' },
  { key: 'search', label: 'Search & Ranking', match: '-search', color: 'text-rose-400', dot: 'bg-rose-500' },
  { key: 'storage', label: 'Storage', match: '-storage', color: 'text-cyan-400', dot: 'bg-cyan-500' },
  { key: 'id', label: 'ID Generation', match: '-id', color: 'text-orange-400', dot: 'bg-orange-500' },
]

function categorizeLayerId(layerId: string): string {
  for (const cat of LAYER_CATEGORIES) {
    if (layerId.endsWith(cat.match)) return cat.key
  }
  return 'other'
}

const TRAIT_ORDER: SimTraitId[] = [
  'read-throughput', 'write-throughput', 'latency', 'consistency',
  'availability', 'durability', 'horizontal-scale', 'cost-efficiency',
]

function CollectionCard({ card }: { card: SimChoiceCard }) {
  const [expanded, setExpanded] = useState(false)
  const activeTraits = TRAIT_ORDER.filter(t => card.traits[t] !== undefined)

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground">{card.name}</div>
          <div className="text-[10px] text-muted-foreground">{card.subtitle}</div>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground shrink-0 transition-transform', expanded && 'rotate-180')} />
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-border pt-3 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>

          <div className="space-y-1.5">
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

          <div className="space-y-1.5">
            {activeTraits.map(traitId => {
              const value = card.traits[traitId]!
              const pct = (value / 10) * 100
              const color = value >= 8 ? 'bg-green-500' : value >= 5 ? 'bg-amber-400' : 'bg-red-400'
              return (
                <div key={traitId} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-24 shrink-0 truncate">{SIM_TRAIT_LABELS[traitId]}</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-4 text-right">{value}</span>
                </div>
              )
            })}
          </div>

          <div className="pt-2 border-t border-border">
            <span className="text-[10px] text-muted-foreground italic">{card.realWorldUse}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function SimCollection() {
  const grouped = useMemo(() => {
    const seen = new Set<string>()
    const groups: Record<string, SimChoiceCard[]> = {}

    for (const scenario of simScenarios) {
      for (const layer of scenario.layers) {
        const cat = categorizeLayerId(layer.id)
        if (!groups[cat]) groups[cat] = []
        for (const card of layer.cards) {
          if (!seen.has(card.id)) {
            seen.add(card.id)
            groups[cat].push(card)
          }
        }
      }
    }
    return groups
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="space-y-6">
        {LAYER_CATEGORIES.filter(cat => grouped[cat.key]?.length).map(cat => (
          <div key={cat.key}>
            <div className="flex items-center gap-2 mb-3">
              <div className={cn('w-2.5 h-2.5 rounded-full', cat.dot)} />
              <h2 className={cn('text-sm font-semibold', cat.color)}>{cat.label}</h2>
              <span className="text-[10px] text-muted-foreground">{grouped[cat.key].length} cards</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              {grouped[cat.key].map(card => (
                <CollectionCard key={card.id} card={card} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SimulatorDashboard() {
  const [tab, setTab] = useState<SimTab>('scenarios')
  const sim = useSimulator()
  const sr = useSimSR()

  // Phase: Scenario Selection
  if (sim.phase === 'select') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Simulator</h1>
            {sr.dueCount > 0 && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Clock className="h-3 w-3" />
                {sr.dueCount} due
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Choose a scenario, pick technologies at each layer, and see if your architecture meets the requirements.
          </p>

          {/* Tab toggle */}
          <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg w-fit">
            <button
              onClick={() => setTab('scenarios')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                tab === 'scenarios' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Zap className="h-4 w-4" />
              Scenarios
            </button>
            <button
              onClick={() => setTab('collection')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                tab === 'collection' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Layers className="h-4 w-4" />
              Collection
            </button>
          </div>
        </div>

        {tab === 'collection' ? (
          <SimCollection />
        ) : (
          <div className="grid gap-4">
            {simScenarios.map(scenario => {
              const bestScore = sim.getBestScore(scenario.id)
              const attempts = sim.getAttemptCount(scenario.id)
              const isDue = sr.isDue(scenario.id)
              const total = scenario.requirements.length

              return (
                <button
                  key={scenario.id}
                  onClick={() => sim.selectScenario(scenario)}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-muted-foreground/50 hover:shadow-md transition-all text-left overflow-hidden"
                >
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                    scenario.difficulty === 'beginner' ? 'bg-green-500/10 text-green-400' :
                    scenario.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  )}>
                    <Zap className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{scenario.title}</span>
                      <span className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full border font-medium',
                        scenario.difficulty === 'beginner' ? 'text-green-400 bg-green-500/10 border-green-500/30' :
                        scenario.difficulty === 'intermediate' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                        'text-red-400 bg-red-500/10 border-red-500/30'
                      )}>
                        {scenario.difficulty}
                      </span>
                      {isDue && attempts > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          due
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{scenario.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-muted-foreground">{scenario.layers.length} layers</span>
                      {bestScore !== null && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Trophy className="h-3 w-3" />
                          Best: {bestScore}/{total}
                        </span>
                      )}
                      {attempts > 0 && (
                        <span className="text-[10px] text-muted-foreground">{attempts} attempt{attempts !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Phase: Briefing
  if (sim.phase === 'briefing' && sim.scenario) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className={cn(
            'inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4',
            sim.scenario.difficulty === 'beginner' ? 'bg-green-500/10' :
            sim.scenario.difficulty === 'intermediate' ? 'bg-amber-500/10' :
            'bg-red-500/10'
          )}>
            <Zap className={cn(
              'h-7 w-7',
              sim.scenario.difficulty === 'beginner' ? 'text-green-400' :
              sim.scenario.difficulty === 'intermediate' ? 'text-amber-400' :
              'text-red-400'
            )} />
          </div>
          <h2 className="text-xl font-bold text-foreground">{sim.scenario.title}</h2>
          <p className="text-sm text-muted-foreground mt-2">{sim.scenario.description}</p>
        </div>

        {/* Constraints */}
        <div className="bg-card border border-border rounded-lg p-5 mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">System Constraints</h3>
          <div className="flex flex-wrap gap-2">
            {sim.scenario.constraints.map((c, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground border border-border">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Requirements preview */}
        <div className="bg-card border border-border rounded-lg p-5 mb-8">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Requirements to Pass</h3>
          <div className="space-y-2">
            {sim.scenario.requirements.map(req => (
              <div key={req.id} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span className="text-sm text-foreground">{req.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={sim.reset}
            className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            Back
          </button>
          <button
            onClick={sim.startBuilding}
            className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
          >
            Start Building
          </button>
        </div>
      </div>
    )
  }

  // Phase: Building (layer-by-layer decisions)
  if (sim.phase === 'building' && sim.scenario) {
    const currentLayer = sim.scenario.layers[sim.layerIndex]
    return (
      <SimLayerStep
        layer={currentLayer}
        layerIndex={sim.layerIndex}
        totalLayers={sim.scenario.layers.length}
        selectedCardId={sim.choices[currentLayer.id]}
        requirements={sim.scenario.requirements}
        onChoose={(cardId) => sim.chooseCard(currentLayer.id, cardId)}
        onNext={sim.nextLayer}
        onPrev={sim.prevLayer}
      />
    )
  }

  // Phase: Results
  if (sim.phase === 'results' && sim.scenario && sim.lastResult) {
    return (
      <SimResults
        scenario={sim.scenario}
        result={sim.lastResult}
        choices={sim.choices}
        onReview={(quality: SimReviewQuality) => {
          sr.review(sim.scenario!.id, quality)
        }}
        onRetry={sim.retryScenario}
        onBack={sim.reset}
      />
    )
  }

  return null
}
