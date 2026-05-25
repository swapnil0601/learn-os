import { CardState } from '@/types'
import { createInitialCardState } from './sm2'

const STORAGE_KEY = 'sysdesign-card-states'
const QUIZ_STORAGE_KEY = 'sysdesign-quiz-scores'

export function loadCardStates(): Record<string, CardState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // Corrupted data, start fresh
  }
  return {}
}

export function saveCardStates(states: Record<string, CardState>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
}

export function getOrCreateCardState(
  states: Record<string, CardState>,
  conceptId: string
): CardState {
  if (!states[conceptId]) {
    states[conceptId] = createInitialCardState(conceptId)
  }
  return states[conceptId]
}

export interface QuizScore {
  date: string
  score: number
  total: number
}

export function loadQuizScores(): QuizScore[] {
  try {
    const stored = localStorage.getItem(QUIZ_STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // Corrupted data
  }
  return []
}

export function saveQuizScore(score: QuizScore): void {
  const scores = loadQuizScores()
  scores.push(score)
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(scores))
}
