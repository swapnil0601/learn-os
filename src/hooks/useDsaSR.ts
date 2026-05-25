import { useState, useEffect, useCallback, useMemo } from 'react'
import { DsaAlgorithm, DsaProblem } from '@/types'
import { dsaAlgorithms, dsaProblems } from '@/data/dsa'

const STORAGE_KEY = 'sysdesign-dsa-sr'

export interface DsaCardState {
  id: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: string
  lastReviewDate: string
}

type DsaSRState = Record<string, DsaCardState>
export type DsaReviewQuality = 0 | 3 | 4 | 5

function createInitialState(id: string): DsaCardState {
  const today = new Date().toISOString().split('T')[0]
  return { id, easeFactor: 2.5, interval: 0, repetitions: 0, nextReviewDate: today, lastReviewDate: today }
}

function loadState(): DsaSRState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* corrupted */ }
  return {}
}

function saveState(state: DsaSRState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function reviewCard(card: DsaCardState, quality: DsaReviewQuality): DsaCardState {
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

export function useDsaSR() {
  const [state, setState] = useState<DsaSRState>(loadState)

  useEffect(() => { saveState(state) }, [state])

  const review = useCallback((id: string, quality: DsaReviewQuality) => {
    setState(prev => {
      const card = prev[id] ?? createInitialState(id)
      return { ...prev, [id]: reviewCard(card, quality) }
    })
  }, [])

  const getCardState = useCallback((id: string): DsaCardState | undefined => {
    return state[id]
  }, [state])

  const today = new Date().toISOString().split('T')[0]

  const dueAlgorithms = useMemo((): DsaAlgorithm[] => {
    return dsaAlgorithms.filter(a => {
      const card = state[a.id]
      if (!card) return true
      return card.nextReviewDate <= today
    })
  }, [state, today])

  const dueProblems = useMemo((): DsaProblem[] => {
    return dsaProblems.filter(p => {
      const card = state[p.id]
      if (!card) return true
      return card.nextReviewDate <= today
    })
  }, [state, today])

  const dueCount = dueAlgorithms.length + dueProblems.length

  return { state, review, getCardState, dueAlgorithms, dueProblems, dueCount }
}
