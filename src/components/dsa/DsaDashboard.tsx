import { useState, useMemo } from 'react'
import { Code2, BookOpen, ChevronRight, ChevronDown, CheckCircle2, RotateCcw, Lock, Sparkles, Clock } from 'lucide-react'
import { DsaTopic, DsaAlgorithm, DsaProblem, DSA_TOPIC_META } from '@/types'
import { dsaAlgorithms, dsaProblems } from '@/data/dsa'
import { DsaCardState, DsaReviewQuality } from '@/hooks/useDsaSR'
import { cn } from '@/lib/utils'

type SubTab = 'algorithms' | 'problems'

interface DsaDashboardProps {
  getCardState: (id: string) => DsaCardState | undefined
  onReview: (id: string, quality: DsaReviewQuality) => void
  dueCount: number
}

const TOPIC_ORDER: DsaTopic[] = [
  'arrays-hashing', 'two-pointers', 'sliding-window', 'stack', 'binary-search',
  'linked-list', 'trees', 'tries', 'heap', 'backtracking',
  'graphs', 'dynamic-programming', 'greedy', 'intervals', 'bit-manipulation',
  'string-matching', 'advanced-ds',
]

function getStatus(card: DsaCardState | undefined): 'new' | 'learning' | 'mastered' | 'due' {
  if (!card || card.repetitions === 0) return 'new'
  const today = new Date().toISOString().split('T')[0]
  if (card.nextReviewDate <= today) return 'due'
  if (card.repetitions >= 3 && card.easeFactor >= 2.5) return 'mastered'
  return 'learning'
}

function getDifficultyColor(card: DsaCardState | undefined): string {
  if (!card || card.repetitions === 0) return 'bg-muted-foreground/20'
  const ease = card.easeFactor
  if (ease >= 2.5) return 'bg-green-500'
  if (ease >= 2.0) return 'bg-emerald-400'
  if (ease >= 1.7) return 'bg-amber-400'
  return 'bg-red-500'
}

export function DsaDashboard({ getCardState, onReview, dueCount }: DsaDashboardProps) {
  const [tab, setTab] = useState<SubTab>('algorithms')
  const [expandedTopic, setExpandedTopic] = useState<DsaTopic | null>(null)
  const [selectedItem, setSelectedItem] = useState<(DsaAlgorithm | DsaProblem) | null>(null)
  const [selectedType, setSelectedType] = useState<'algorithm' | 'problem'>('algorithm')

  const topicGroups = useMemo(() => {
    return TOPIC_ORDER.map(topic => {
      const meta = DSA_TOPIC_META[topic]
      const algos = dsaAlgorithms.filter(a => a.topic === topic)
      const probs = dsaProblems.filter(p => p.topic === topic)
      const items = tab === 'algorithms' ? algos : probs
      const reviewed = items.filter(i => {
        const s = getStatus(getCardState(i.id))
        return s === 'learning' || s === 'mastered'
      }).length
      const due = items.filter(i => getStatus(getCardState(i.id)) === 'due').length
      return { topic, meta, algos, probs, items, total: items.length, reviewed, due }
    }).filter(g => g.total > 0)
  }, [tab, getCardState])

  const totalItems = tab === 'algorithms' ? dsaAlgorithms.length : dsaProblems.length
  const totalReviewed = topicGroups.reduce((sum, g) => sum + g.reviewed, 0)
  const progress = totalItems > 0 ? (totalReviewed / totalItems) * 100 : 0

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Code2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">DSA</h1>
          {dueCount > 0 && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Clock className="h-3 w-3" />
              {dueCount} due
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {dsaAlgorithms.length} algorithms, {dsaProblems.length} problems across {TOPIC_ORDER.length} topics
        </p>

        {/* Progress */}
        <div className="bg-card border border-border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              {tab === 'algorithms' ? 'Algorithms' : 'Problems'} Progress
            </span>
            <span className="text-xs font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Sub-tab toggle */}
        <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => { setTab('algorithms'); setExpandedTopic(null) }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              tab === 'algorithms' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Code2 className="h-4 w-4" />
            Algorithms
          </button>
          <button
            onClick={() => { setTab('problems'); setExpandedTopic(null) }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              tab === 'problems' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <BookOpen className="h-4 w-4" />
            LeetCode
          </button>
        </div>
      </div>

      {/* Topic groups */}
      <div className="space-y-3">
        {topicGroups.map(({ topic, meta, items, total, reviewed, due }) => {
          const isExpanded = expandedTopic === topic
          const topicProgress = total > 0 ? (reviewed / total) * 100 : 0

          return (
            <div key={topic} className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-secondary/30 transition-colors"
                onClick={() => setExpandedTopic(isExpanded ? null : topic)}
              >
                <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', meta.dot)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn('font-semibold text-sm', meta.color)}>{meta.label}</span>
                    {due > 0 && (
                      <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {due} due
                      </span>
                    )}
                    {topicProgress === 100 && <Sparkles className="h-3.5 w-3.5 text-amber-400" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', meta.dot)}
                        style={{ width: `${topicProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{reviewed}/{total}</span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-border px-2 pb-2 pt-1">
                  {items.map((item, i) => {
                    const card = getCardState(item.id)
                    const status = getStatus(card)
                    const diffColor = getDifficultyColor(card)

                    return (
                      <button
                        key={item.id}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-secondary/50 transition-colors text-left"
                        onClick={() => {
                          setSelectedItem(item)
                          setSelectedType(tab === 'algorithms' ? 'algorithm' : 'problem')
                        }}
                      >
                        <div className={cn('w-1 h-8 rounded-full shrink-0', diffColor)} />
                        <span className="text-[10px] text-muted-foreground w-4 text-right shrink-0">{i + 1}</span>
                        {status === 'mastered' && <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />}
                        {status === 'learning' && <BookOpen className="h-4 w-4 text-blue-400 shrink-0" />}
                        {status === 'due' && <RotateCcw className="h-4 w-4 text-amber-400 shrink-0" />}
                        {status === 'new' && <Lock className="h-4 w-4 text-muted-foreground/40 shrink-0" />}

                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-foreground font-medium">
                            {'name' in item ? (item as DsaAlgorithm).name : (item as DsaProblem).title}
                          </div>
                          {'difficulty' in item && (
                            <span className={cn('text-[10px] font-medium', {
                              'text-green-400': (item as DsaProblem).difficulty === 'easy',
                              'text-amber-400': (item as DsaProblem).difficulty === 'medium',
                              'text-red-400': (item as DsaProblem).difficulty === 'hard',
                            })}>
                              {(item as DsaProblem).difficulty}
                            </span>
                          )}
                        </div>

                        <div className="shrink-0">
                          {status === 'mastered' && <span className="text-[10px] text-green-400 font-medium">Mastered</span>}
                          {status === 'learning' && <span className="text-[10px] text-blue-400 font-medium">{card?.repetitions} reviews</span>}
                          {status === 'due' && <span className="text-[10px] text-amber-400 font-medium">Review</span>}
                          {status === 'new' && <span className="text-[10px] text-muted-foreground/50">New</span>}
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Card Modal */}
      {selectedItem && (
        <DsaCard
          item={selectedItem}
          type={selectedType}
          cardState={getCardState(selectedItem.id)}
          onReview={(quality) => {
            onReview(selectedItem.id, quality)
            setSelectedItem(null)
          }}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}

// ═══════════════ DSA CARD (detail modal) ═══════════════

interface DsaCardProps {
  item: DsaAlgorithm | DsaProblem
  type: 'algorithm' | 'problem'
  cardState: DsaCardState | undefined
  onReview: (quality: DsaReviewQuality) => void
  onClose: () => void
}

function DsaCard({ item, type, cardState, onReview, onClose }: DsaCardProps) {
  const topic = DSA_TOPIC_META[item.topic]
  const status = getStatus(cardState)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn('w-2 h-2 rounded-full', topic.dot)} />
            <span className={cn('text-[10px] font-medium', topic.color)}>{topic.label}</span>
            {type === 'problem' && 'difficulty' in item && (
              <span className={cn('text-[10px] font-medium ml-auto px-2 py-0.5 rounded-full border', {
                'text-green-400 bg-green-500/10 border-green-500/30': (item as DsaProblem).difficulty === 'easy',
                'text-amber-400 bg-amber-500/10 border-amber-500/30': (item as DsaProblem).difficulty === 'medium',
                'text-red-400 bg-red-500/10 border-red-500/30': (item as DsaProblem).difficulty === 'hard',
              })}>
                {(item as DsaProblem).difficulty}
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-foreground">
            {'name' in item ? (item as DsaAlgorithm).name : (item as DsaProblem).title}
          </h2>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Description</div>
            <p className="text-sm text-foreground leading-relaxed">{item.description}</p>
          </div>

          {type === 'algorithm' && (
            <>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Key Idea</div>
                <p className="text-sm text-primary font-medium leading-relaxed">{(item as DsaAlgorithm).keyIdea}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Time</div>
                  <span className="text-xs font-mono text-foreground bg-secondary px-2 py-1 rounded">{(item as DsaAlgorithm).timeComplexity}</span>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Space</div>
                  <span className="text-xs font-mono text-foreground bg-secondary px-2 py-1 rounded">{(item as DsaAlgorithm).spaceComplexity}</span>
                </div>
              </div>
            </>
          )}

          {type === 'problem' && (
            <>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Key Insight</div>
                <p className="text-sm text-primary font-medium leading-relaxed">{(item as DsaProblem).keyInsight}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Patterns</div>
                <div className="flex flex-wrap gap-1.5">
                  {(item as DsaProblem).patterns.map(p => (
                    <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {cardState && status !== 'new' && (
            <div className="text-[10px] text-muted-foreground pt-2 border-t border-border">
              {cardState.repetitions} review{cardState.repetitions !== 1 ? 's' : ''} · Next: {cardState.nextReviewDate}
            </div>
          )}
        </div>

        {/* Review buttons */}
        <div className="p-5 border-t border-border">
          <div className="text-[10px] text-muted-foreground mb-2">How well do you know this?</div>
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
      </div>
    </div>
  )
}
