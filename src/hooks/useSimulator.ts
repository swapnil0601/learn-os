import { useState, useCallback } from 'react'
import { SimScenario, SimResult } from '@/types'
import { scoreSimulation } from '@/utils/simScoring'

const HISTORY_KEY = 'sysdesign-sim-history'

export type SimPhase = 'select' | 'briefing' | 'building' | 'results'

interface SimulatorState {
  phase: SimPhase
  scenario: SimScenario | null
  layerIndex: number
  choices: Record<string, string> // layerId -> cardId
  lastResult: SimResult | null
}

function loadHistory(): SimResult[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* corrupted */ }
  return []
}

function saveHistory(history: SimResult[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function useSimulator() {
  const [state, setState] = useState<SimulatorState>({
    phase: 'select',
    scenario: null,
    layerIndex: 0,
    choices: {},
    lastResult: null,
  })
  const [history, setHistory] = useState<SimResult[]>(loadHistory)

  const selectScenario = useCallback((scenario: SimScenario) => {
    setState({ phase: 'briefing', scenario, layerIndex: 0, choices: {}, lastResult: null })
  }, [])

  const startBuilding = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'building', layerIndex: 0 }))
  }, [])

  const chooseCard = useCallback((layerId: string, cardId: string) => {
    setState(prev => ({ ...prev, choices: { ...prev.choices, [layerId]: cardId } }))
  }, [])

  const nextLayer = useCallback(() => {
    setState(prev => {
      if (!prev.scenario) return prev
      const nextIdx = prev.layerIndex + 1
      if (nextIdx >= prev.scenario.layers.length) {
        // Score and go to results
        const result = scoreSimulation(prev.scenario, prev.choices)
        const simResult: SimResult = {
          scenarioId: prev.scenario.id,
          timestamp: new Date().toISOString(),
          choices: prev.choices,
          score: result.passedCount,
          passed: result.requirements.filter(r => r.passed).map(r => r.requirementId),
          failed: result.requirements.filter(r => !r.passed).map(r => r.requirementId),
        }
        setHistory(h => {
          const newHistory = [simResult, ...h]
          saveHistory(newHistory)
          return newHistory
        })
        return { ...prev, phase: 'results' as SimPhase, lastResult: simResult }
      }
      return { ...prev, layerIndex: nextIdx }
    })
  }, [])

  const prevLayer = useCallback(() => {
    setState(prev => {
      if (prev.layerIndex <= 0) return prev
      return { ...prev, layerIndex: prev.layerIndex - 1 }
    })
  }, [])

  const reset = useCallback(() => {
    setState({ phase: 'select', scenario: null, layerIndex: 0, choices: {}, lastResult: null })
  }, [])

  const retryScenario = useCallback(() => {
    setState(prev => ({
      phase: 'briefing',
      scenario: prev.scenario,
      layerIndex: 0,
      choices: {},
      lastResult: null,
    }))
  }, [])

  const getBestScore = useCallback((scenarioId: string): number | null => {
    const results = history.filter(r => r.scenarioId === scenarioId)
    if (results.length === 0) return null
    return Math.max(...results.map(r => r.score))
  }, [history])

  const getAttemptCount = useCallback((scenarioId: string): number => {
    return history.filter(r => r.scenarioId === scenarioId).length
  }, [history])

  return {
    ...state,
    selectScenario,
    startBuilding,
    chooseCard,
    nextLayer,
    prevLayer,
    reset,
    retryScenario,
    getBestScore,
    getAttemptCount,
  }
}
