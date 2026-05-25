import { CheckCircle2, XCircle, RotateCcw, ChevronRight, Trophy } from 'lucide-react'
import { SimScenario, SimResult, SIM_TRAIT_LABELS } from '@/types'
import { scoreSimulation } from '@/utils/simScoring'
import { SimReviewQuality } from '@/hooks/useSimSR'
import { cn } from '@/lib/utils'

interface SimResultsProps {
  scenario: SimScenario
  result: SimResult
  choices: Record<string, string>
  onReview: (quality: SimReviewQuality) => void
  onRetry: () => void
  onBack: () => void
}

export function SimResults({ scenario, result, choices, onReview, onRetry, onBack }: SimResultsProps) {
  const scoreResult = scoreSimulation(scenario, choices)
  const total = scenario.requirements.length
  const passed = result.passed.length
  const pct = Math.round((passed / total) * 100)

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Score header */}
      <div className="text-center mb-8">
        <div className={cn(
          'inline-flex items-center justify-center w-20 h-20 rounded-full mb-4',
          pct === 100 ? 'bg-green-500/10 border-2 border-green-500/30' :
          pct >= 60 ? 'bg-amber-500/10 border-2 border-amber-500/30' :
          'bg-red-500/10 border-2 border-red-500/30'
        )}>
          {pct === 100 ? (
            <Trophy className="h-8 w-8 text-green-400" />
          ) : (
            <span className={cn(
              'text-2xl font-bold',
              pct >= 60 ? 'text-amber-400' : 'text-red-400'
            )}>
              {passed}/{total}
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {pct === 100 ? 'Perfect Architecture!' : pct >= 60 ? 'Good Attempt!' : 'Keep Learning!'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {passed} of {total} requirements passed
        </p>
      </div>

      {/* Your choices summary */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Architecture</h3>
        <div className="space-y-2">
          {scenario.layers.map(layer => {
            const chosenId = choices[layer.id]
            const chosenCard = layer.cards.find(c => c.id === chosenId)
            return (
              <div key={layer.id} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-28 shrink-0 truncate">{layer.title.replace('Choose Your ', '')}</span>
                <span className="text-xs font-medium text-foreground">{chosenCard?.name ?? '—'}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Requirements results */}
      <div className="space-y-3 mb-8">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Requirements</h3>
        {scoreResult.requirements.map(r => {
          const req = scenario.requirements.find(rq => rq.id === r.requirementId)!
          return (
            <div
              key={r.requirementId}
              className={cn(
                'border rounded-lg p-3',
                r.passed ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'
              )}
            >
              <div className="flex items-start gap-2">
                {r.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">{req.label}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{r.explanation}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Trait scores */}
      <div className="bg-card border border-border rounded-lg p-4 mb-8">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Trait Scores</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(scoreResult.traitScores).map(([traitId, score]) => (
            <div key={traitId} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-24 shrink-0 truncate">
                {SIM_TRAIT_LABELS[traitId as keyof typeof SIM_TRAIT_LABELS]}
              </span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    score >= 7 ? 'bg-green-500' : score >= 4 ? 'bg-amber-400' : 'bg-red-400'
                  )}
                  style={{ width: `${(score / 10) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground w-6 text-right">{score.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SM-2 Review */}
      <div className="border border-border rounded-lg p-4 mb-6">
        <div className="text-[10px] text-muted-foreground mb-2">How well did you understand the tradeoffs?</div>
        <div className="flex gap-2">
          <button onClick={() => onReview(0)} className="flex-1 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
            Again
          </button>
          <button onClick={() => onReview(3)} className="flex-1 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors">
            Hard
          </button>
          <button onClick={() => onReview(4)} className="flex-1 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors">
            Good
          </button>
          <button onClick={() => onReview(5)} className="flex-1 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors">
            Easy
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          All Scenarios
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
