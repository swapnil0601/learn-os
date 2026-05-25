import { useState, useEffect, useCallback, useMemo } from 'react'
import { JargonTerm } from '@/types'
import { jargonTerms } from '@/data/jargon'

const STORAGE_KEY = 'sysdesign-jargon-sr'

interface JargonCardState {
  termId: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: string
  lastReviewDate: string
}

type JargonSRState = Record<string, JargonCardState>

function createInitialState(termId: string): JargonCardState {
  const today = new Date().toISOString().split('T')[0]
  return { termId, easeFactor: 2.5, interval: 0, repetitions: 0, nextReviewDate: today, lastReviewDate: today }
}

function loadState(): JargonSRState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* corrupted */ }
  return {}
}

function saveState(state: JargonSRState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export type JargonReviewQuality = 0 | 3 | 4 | 5 // Again, Hard, Good, Easy

function reviewJargonCard(card: JargonCardState, quality: JargonReviewQuality): JargonCardState {
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
    termId: card.termId,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextDate.toISOString().split('T')[0],
    lastReviewDate: new Date().toISOString().split('T')[0],
  }
}

export function useJargonSR(discoveredTermIds: Set<string>) {
  const [state, setState] = useState<JargonSRState>(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  // Ensure all discovered terms have a card state
  useEffect(() => {
    setState(prev => {
      let changed = false
      const next = { ...prev }
      for (const id of discoveredTermIds) {
        if (!next[id]) {
          next[id] = createInitialState(id)
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [discoveredTermIds])

  const review = useCallback((termId: string, quality: JargonReviewQuality) => {
    setState(prev => {
      const card = prev[termId] ?? createInitialState(termId)
      return { ...prev, [termId]: reviewJargonCard(card, quality) }
    })
  }, [])

  const dueTerms = useMemo((): JargonTerm[] => {
    const today = new Date().toISOString().split('T')[0]
    return jargonTerms.filter(t => {
      if (!discoveredTermIds.has(t.id)) return false
      const card = state[t.id]
      if (!card) return true // new card, due immediately
      return card.nextReviewDate <= today
    })
  }, [state, discoveredTermIds])

  const dueCount = dueTerms.length

  return { state, review, dueTerms, dueCount }
}
