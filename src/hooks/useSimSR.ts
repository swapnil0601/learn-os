import { useState, useEffect, useCallback, useMemo } from 'react'
import { simScenarios } from '@/data/simScenarios'

const STORAGE_KEY = 'sysdesign-sim-sr'

export interface SimCardState {
  id: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: string
  lastReviewDate: string
}

type SimSRState = Record<string, SimCardState>
export type SimReviewQuality = 0 | 3 | 4 | 5

function createInitialState(id: string): SimCardState {
  const today = new Date().toISOString().split('T')[0]
  return { id, easeFactor: 2.5, interval: 0, repetitions: 0, nextReviewDate: today, lastReviewDate: today }
}

function loadState(): SimSRState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* corrupted */ }
  return {}
}

function saveState(state: SimSRState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function reviewCard(card: SimCardState, quality: SimReviewQuality): SimCardState {
  let { easeFactor, interval, repetitions } = card

  if (quality >= 3) {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    repetitions += 1
  } else {
    repetitions = 0
    interval = 1
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))

  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + interval)

  return {
    id: card.id,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextDate.toISOString().split('T')[0],
    lastReviewDate: new Date().toISOString().split('T')[0],
  }
}

export function useSimSR() {
  const [state, setState] = useState<SimSRState>(loadState)

  useEffect(() => { saveState(state) }, [state])

  const review = useCallback((id: string, quality: SimReviewQuality) => {
    setState(prev => {
      const card = prev[id] ?? createInitialState(id)
      return { ...prev, [id]: reviewCard(card, quality) }
    })
  }, [])

  const getCardState = useCallback((id: string): SimCardState | undefined => {
    return state[id]
  }, [state])

  const today = new Date().toISOString().split('T')[0]

  const dueCount = useMemo(() => {
    return simScenarios.filter(s => {
      const card = state[s.id]
      if (!card) return true
      return card.nextReviewDate <= today
    }).length
  }, [state, today])

  const isDue = useCallback((scenarioId: string): boolean => {
    const card = state[scenarioId]
    if (!card) return true
    return card.nextReviewDate <= today
  }, [state, today])

  return { state, review, getCardState, dueCount, isDue }
}
