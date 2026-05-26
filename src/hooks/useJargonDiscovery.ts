import { useState, useEffect, useCallback, useMemo } from 'react'
import { JargonTerm } from '@/types'
import { jargonTerms, jargonBadges } from '@/data/jargon'

const STORAGE_KEY = 'sysdesign-jargon-state'

interface JargonState {
  discoveredTermIds: string[]
  discoveredAt: Record<string, string>
  lastDailyFlashDate: string
  lastDailyFlashTermId: string
}

function loadState(): JargonState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* corrupted */ }
  return { discoveredTermIds: [], discoveredAt: {}, lastDailyFlashDate: '', lastDailyFlashTermId: '' }
}

function saveState(state: JargonState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useJargonDiscovery() {
  const [state, setState] = useState<JargonState>(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const discoveredTerms = useMemo(
    () => new Set(state.discoveredTermIds),
    [state.discoveredTermIds]
  )

  const discoverTermsForConcept = useCallback((conceptId: string) => {
    setState(prev => {
      const conceptTerms = jargonTerms.filter(t => t.conceptId === conceptId)
      const newIds = conceptTerms.filter(t => !prev.discoveredTermIds.includes(t.id)).map(t => t.id)
      if (newIds.length === 0) return prev

      const now = new Date().toISOString()
      const newDiscoveredAt = { ...prev.discoveredAt }
      for (const id of newIds) newDiscoveredAt[id] = now

      return {
        ...prev,
        discoveredTermIds: [...prev.discoveredTermIds, ...newIds],
        discoveredAt: newDiscoveredAt,
      }
    })
  }, [])

  const discoverTerm = useCallback((termId: string) => {
    setState(prev => {
      if (prev.discoveredTermIds.includes(termId)) return prev
      return {
        ...prev,
        discoveredTermIds: [...prev.discoveredTermIds, termId],
        discoveredAt: { ...prev.discoveredAt, [termId]: new Date().toISOString() },
      }
    })
  }, [])

  const earnedBadges = useMemo(() => {
    const count = discoveredTerms.size
    return jargonBadges.filter(badge => {
      if (badge.id === 'jargon-collector') return count >= 50
      if (badge.id === 'walking-glossary') return count >= 100
      if (badge.id === 'omniscient') return count >= jargonTerms.length
      return badge.termIds.every(tid => discoveredTerms.has(tid))
    })
  }, [discoveredTerms])

  const today = new Date().toISOString().split('T')[0]
  const shouldShowDailyFlash = state.lastDailyFlashDate !== today

  const dailyFlashTerm = useMemo((): JargonTerm | null => {
    if (!shouldShowDailyFlash) return null
    const undiscovered = jargonTerms.filter(t => !discoveredTerms.has(t.id))
    const pool = undiscovered.length > 0 ? undiscovered : jargonTerms
    if (pool.length === 0) return null
    // Deterministic daily pick based on date
    const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0)
    return pool[seed % pool.length]
  }, [shouldShowDailyFlash, discoveredTerms, today])

  const dismissDailyFlash = useCallback(() => {
    setState(prev => ({
      ...prev,
      lastDailyFlashDate: today,
      lastDailyFlashTermId: dailyFlashTerm?.id ?? '',
    }))
  }, [today, dailyFlashTerm])

  return {
    discoveredTerms,
    discoveredCount: state.discoveredTermIds.length,
    totalTerms: jargonTerms.length,
    discoverTermsForConcept,
    discoverTerm,
    earnedBadges,
    allBadges: jargonBadges,
    shouldShowDailyFlash,
    dailyFlashTerm,
    dismissDailyFlash,
  }
}
