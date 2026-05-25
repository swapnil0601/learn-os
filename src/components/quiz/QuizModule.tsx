import { useState, useMemo } from 'react'
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react'
import { quizQuestions } from '@/data/quizQuestions'
import { saveQuizScore } from '@/utils/storage'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface QuizModuleProps {
  userId?: string
}

export function QuizModule({ userId }: QuizModuleProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Shuffle questions on mount
  const questions = useMemo(() => {
    return [...quizQuestions].sort(() => Math.random() - 0.5)
  }, [])

  const currentQuestion = questions[currentIdx]

  const handleAnswer = (value: string) => {
    if (showExplanation) return
    setSelectedAnswer(value)
    setShowExplanation(true)
    if (value === currentQuestion.correctAnswer) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      saveQuizScore({
        date: new Date().toISOString(),
        score,
        total: questions.length,
      })
      if (userId) {
        supabase.from('quiz_attempts').insert({
          user_id: userId,
          score,
          total: questions.length,
        })
        supabase.from('activity_log').insert({
          user_id: userId,
          action: 'quiz_complete',
          metadata: { score, total: questions.length },
        })
      }
      setIsComplete(true)
    } else {
      setCurrentIdx((i) => i + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handleRestart = () => {
    setCurrentIdx(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setIsComplete(false)
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-16">
          <Trophy
            className={cn(
              'h-16 w-16 mx-auto mb-6',
              percentage >= 80 ? 'text-amber-400' : percentage >= 50 ? 'text-primary' : 'text-muted-foreground'
            )}
          />
          <h1 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h1>
          <p className="text-4xl font-bold text-primary mb-2">
            {score}/{questions.length}
          </p>
          <p className="text-sm text-muted-foreground mb-8">{percentage}% correct</p>

          <div className="w-full bg-secondary rounded-full h-3 mb-8 max-w-xs mx-auto">
            <div
              className={cn(
                'h-3 rounded-full transition-all',
                percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Quiz</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentIdx + 1} / {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary rounded-full h-1.5 mb-8">
        <div
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <p className="text-sm font-medium text-foreground leading-relaxed">
          {currentQuestion.scenario}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedAnswer === option.value
          const isCorrect = option.value === currentQuestion.correctAnswer
          const showResult = showExplanation

          return (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              disabled={showExplanation}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all text-sm',
                !showResult && !isSelected && 'bg-card border-border hover:border-primary/40',
                !showResult && isSelected && 'bg-primary/10 border-primary',
                showResult && isCorrect && 'bg-green-500/10 border-green-500/50',
                showResult && isSelected && !isCorrect && 'bg-red-500/10 border-red-500/50',
                showResult && !isCorrect && !isSelected && 'opacity-50 border-border'
              )}
            >
              <span
                className={cn(
                  'w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0',
                  !showResult && 'border-muted-foreground/30 text-muted-foreground',
                  showResult && isCorrect && 'border-green-500 text-green-500',
                  showResult && isSelected && !isCorrect && 'border-red-500 text-red-500'
                )}
              >
                {showResult && isCorrect ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : showResult && isSelected && !isCorrect ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  option.value.toUpperCase()
                )}
              </span>
              <span className="text-foreground">{option.label}</span>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">Explanation</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentQuestion.explanation}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {currentQuestion.relatedConcepts.map((c) => (
              <span
                key={c}
                className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded"
              >
                {c.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Next Button */}
      {showExplanation && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {currentIdx + 1 >= questions.length ? 'See Results' : 'Next Question'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
