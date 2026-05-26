import { useState, useMemo } from 'react'
import {
  BookOpen, CheckCircle2, Clock, ChevronRight, ChevronDown,
  GraduationCap, Lock, Sparkles, RotateCcw,
} from 'lucide-react'
import { Concept, CardState, CATEGORY_COLORS, Category, TERRITORY_NAMES } from '@/types'
import { ReviewQuality } from '@/utils/sm2'
import { DeepDiveCard } from './DeepDiveCard'
import { concepts } from '@/data/concepts'
import { cn } from '@/lib/utils'

interface ReviewDashboardProps {
  dueCards: Concept[]
  getCardState: (conceptId: string) => CardState | undefined
  onReview: (conceptId: string, quality: ReviewQuality) => void
  discoveredTerms?: Set<string>
  onConceptViewed?: (conceptId: string) => void
}

const CHAPTER_ORDER: { category: Category; description: string }[] = [
  { category: 'networking', description: 'Master the fundamentals of how data travels across networks, load distribution, and traffic management.' },
  { category: 'databases', description: 'Learn how to store, replicate, partition, and index data at scale.' },
  { category: 'caching', description: 'Understand caching strategies and content delivery for low-latency access.' },
  { category: 'architecture', description: 'Explore system design patterns, proxies, gateways, and service architectures.' },
  { category: 'scalability', description: 'Techniques for scaling systems horizontally with minimal disruption.' },
  { category: 'reliability', description: 'Build fault-tolerant systems that handle failures gracefully.' },
  { category: 'messaging', description: 'Decouple services with asynchronous communication and event-driven patterns.' },
]

function getConceptStatus(state: CardState | undefined): 'new' | 'learning' | 'mastered' | 'due' {
  if (!state || state.repetitions === 0) return 'new'
  const today = new Date().toISOString().split('T')[0]
  if (state.nextReviewDate <= today) return 'due'
  if (state.repetitions >= 3 && state.easeFactor >= 2.5) return 'mastered'
  return 'learning'
}

export function ReviewDashboard({ dueCards, getCardState, onReview, discoveredTerms, onConceptViewed }: ReviewDashboardProps) {
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)
  const [expandedChapter, setExpandedChapter] = useState<Category | null>(null)
  const [reviewedToday, setReviewedToday] = useState<Set<string>>(new Set())

  const handleReview = (conceptId: string, quality: ReviewQuality) => {
    onReview(conceptId, quality)
    setReviewedToday((prev) => new Set(prev).add(conceptId))
    setSelectedConcept(null)
  }

  const chapters = useMemo(() => {
    return CHAPTER_ORDER.map(({ category, description }, index) => {
      const chapterConcepts = concepts.filter(c => c.category === category)
      const statuses = chapterConcepts.map(c => ({
        concept: c,
        status: getConceptStatus(getCardState(c.id)),
        state: getCardState(c.id),
      }))

      const mastered = statuses.filter(s => s.status === 'mastered').length
      const learned = statuses.filter(s => s.status === 'learning' || s.status === 'mastered').length
      const due = statuses.filter(s => s.status === 'due').length
      const progress = chapterConcepts.length > 0 ? (learned / chapterConcepts.length) * 100 : 0

      return {
        category,
        description,
        chapterNum: index + 1,
        concepts: statuses,
        total: chapterConcepts.length,
        mastered,
        learned,
        due,
        progress,
      }
    })
  }, [getCardState])

  const totalProgress = concepts.length > 0
    ? (concepts.filter(c => {
        const s = getConceptStatus(getCardState(c.id))
        return s === 'learning' || s === 'mastered'
      }).length / concepts.length) * 100
    : 0

  const totalDue = dueCards.length

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Course Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Learn OS</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {concepts.length} concepts across {CHAPTER_ORDER.length} chapters
        </p>

        {/* Overall progress bar */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Overall Progress</span>
            <span className="text-xs font-medium text-foreground">{Math.round(totalProgress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            {totalDue > 0 && (
              <span className="flex items-center gap-1 text-amber-400">
                <Clock className="h-3 w-3" />
                {totalDue} due for review
              </span>
            )}
            {reviewedToday.size > 0 && (
              <span className="flex items-center gap-1 text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                {reviewedToday.size} reviewed today
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-3">
        {chapters.map((chapter) => {
          const colors = CATEGORY_COLORS[chapter.category]
          const isExpanded = expandedChapter === chapter.category

          return (
            <div key={chapter.category} className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Chapter Header */}
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-secondary/30 transition-colors"
                onClick={() => setExpandedChapter(isExpanded ? null : chapter.category)}
              >
                {/* Chapter number */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0',
                    colors.bg, colors.text,
                  )}
                >
                  {chapter.chapterNum}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      {TERRITORY_NAMES[chapter.category].replace(' Realm', '').replace(' Dominion', '').replace(' Frontier', '').replace(' Citadel', '').replace(' Provinces', '').replace(' Lands', '').replace(' Kingdom', '')}
                    </span>
                    {chapter.due > 0 && (
                      <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <Clock className="h-2.5 w-2.5" />
                        {chapter.due} due
                      </span>
                    )}
                    {chapter.progress === 100 && (
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    )}
                  </div>
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', colors.dot.replace('bg-', 'bg-'))}
                        style={{ width: `${chapter.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {chapter.learned}/{chapter.total}
                    </span>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {/* Expanded concept list */}
              {isExpanded && (
                <div className="border-t border-border">
                  <p className="px-4 pt-3 pb-2 text-xs text-muted-foreground">
                    {chapter.description}
                  </p>
                  <div className="px-2 pb-2">
                    {chapter.concepts.map(({ concept, status, state }, i) => {
                      // Color bar based on ease/difficulty
                      const ease = state?.easeFactor ?? 2.5
                      const reps = state?.repetitions ?? 0
                      let difficultyColor = 'bg-muted-foreground/20' // new/untouched
                      if (reps > 0) {
                        if (ease >= 2.5) difficultyColor = 'bg-green-500'
                        else if (ease >= 2.0) difficultyColor = 'bg-emerald-400'
                        else if (ease >= 1.7) difficultyColor = 'bg-amber-400'
                        else difficultyColor = 'bg-red-500'
                      }

                      return (
                        <button
                          key={concept.id}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-secondary/50 transition-colors text-left"
                          onClick={() => setSelectedConcept(concept)}
                        >
                          {/* Difficulty color bar */}
                          <div className={cn('w-1 h-8 rounded-full shrink-0', difficultyColor)} />

                          {/* Lesson number + status icon */}
                          <div className="flex items-center gap-2 shrink-0 w-14">
                            <span className="text-[10px] text-muted-foreground w-4 text-right">
                              {chapter.chapterNum}.{i + 1}
                            </span>
                            {status === 'mastered' && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                            {status === 'learning' && <BookOpen className="h-4 w-4 text-blue-400" />}
                            {status === 'due' && <RotateCcw className="h-4 w-4 text-amber-400" />}
                            {status === 'new' && <Lock className="h-4 w-4 text-muted-foreground/40" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-foreground font-medium">{concept.title}</div>
                            <div className="text-xs text-muted-foreground truncate mt-0.5">
                              {concept.definition}
                            </div>
                          </div>

                          {/* Status badge */}
                          <div className="shrink-0">
                            {status === 'mastered' && (
                              <span className="text-[10px] text-green-400 font-medium">Mastered</span>
                            )}
                            {status === 'learning' && (
                              <span className="text-[10px] text-blue-400 font-medium">
                                {state?.repetitions ?? 0} reviews
                              </span>
                            )}
                            {status === 'due' && (
                              <span className="text-[10px] text-amber-400 font-medium">Review</span>
                            )}
                            {status === 'new' && (
                              <span className="text-[10px] text-muted-foreground/50">New</span>
                            )}
                          </div>

                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-center gap-5 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-muted-foreground/40" /> New</span>
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3 text-blue-400" /> Learning</span>
          <span className="flex items-center gap-1"><RotateCcw className="h-3 w-3 text-amber-400" /> Due</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-400" /> Mastered</span>
        </div>
        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Hard</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Moderate</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Comfortable</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Easy</span>
        </div>
      </div>

      {/* Deep Dive Modal */}
      {selectedConcept && (
        <DeepDiveCard
          concept={selectedConcept}
          cardState={getCardState(selectedConcept.id)}
          onReview={handleReview}
          onClose={() => setSelectedConcept(null)}
          onConceptNavigate={(id) => {
            const next = concepts.find(c => c.id === id)
            if (next) setSelectedConcept(next)
          }}
          getCardState={getCardState}
          discoveredTerms={discoveredTerms}
          onConceptViewed={onConceptViewed}
        />
      )}
    </div>
  )
}
