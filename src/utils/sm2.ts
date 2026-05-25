import { CardState } from '@/types'

export type ReviewQuality = 0 | 3 | 4 | 5 // Again, Hard, Good, Easy

export function createInitialCardState(conceptId: string): CardState {
  return {
    conceptId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date().toISOString().split('T')[0],
    lastReviewDate: new Date().toISOString().split('T')[0],
  }
}

export function reviewCard(card: CardState, quality: ReviewQuality): CardState {
  const today = new Date().toISOString().split('T')[0]
  let { easeFactor, interval, repetitions } = card

  if (quality >= 3) {
    // Successful recall
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  } else {
    // Failed recall
    repetitions = 0
    interval = 1
  }

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + interval)

  return {
    conceptId: card.conceptId,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextDate.toISOString().split('T')[0],
    lastReviewDate: today,
  }
}

export function isDueForReview(card: CardState): boolean {
  const today = new Date().toISOString().split('T')[0]
  return card.nextReviewDate <= today
}
