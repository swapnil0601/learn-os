import type { BuildingTier, CardState, ConceptEdge, HealthState } from '@/types'

export function computeBuildingTier(conceptId: string, relationships: ConceptEdge[]): BuildingTier {
  const outgoing = relationships.filter((r) => r.source === conceptId).length
  if (outgoing >= 8) return 'castle'
  if (outgoing >= 5) return 'fortress'
  if (outgoing >= 3) return 'tower'
  return 'cottage'
}

export function computeHealth(cardState: CardState | undefined): number {
  if (!cardState || cardState.repetitions === 0) return 0

  const today = new Date()
  const nextReview = new Date(cardState.nextReviewDate)
  const lastReview = new Date(cardState.lastReviewDate)

  const totalInterval = Math.max(1, cardState.interval)
  const daysSinceReview = Math.max(0, (today.getTime() - lastReview.getTime()) / 86400000)

  // Overdue — decay proportionally
  if (today >= nextReview) {
    const daysOverdue = (today.getTime() - nextReview.getTime()) / 86400000
    return Math.max(0, Math.round(40 - daysOverdue * 8))
  }

  // Between reviews — start decaying at 60% of interval
  const progress = daysSinceReview / totalInterval
  if (progress < 0.6) return 100
  // Linear decay from 100 to 60 between 60%-100% of interval
  return Math.round(100 - (progress - 0.6) / 0.4 * 40)
}

export function getHealthState(health: number): HealthState {
  if (health >= 80) return 'pristine'
  if (health >= 50) return 'weathered'
  if (health >= 20) return 'damaged'
  return 'ruins'
}

export function getHealthColor(health: number): string {
  if (health >= 80) return '#22c55e' // green
  if (health >= 50) return '#eab308' // yellow
  if (health >= 20) return '#f97316' // orange
  return '#6b7280' // gray
}
