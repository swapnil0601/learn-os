import { useState, useEffect, useCallback, useRef } from 'react'
import { CardState } from '@/types'
import { ReviewQuality, reviewCard, isDueForReview, createInitialCardState } from '@/utils/sm2'
import { loadCardStates, saveCardStates, getOrCreateCardState } from '@/utils/storage'
import { supabase } from '@/lib/supabase'
import { concepts } from '@/data/concepts'

export function useSpacedRepetition(userId?: string) {
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({})
  const [loaded, setLoaded] = useState(false)
  const syncingRef = useRef(false)

  // Load card states from Supabase (if logged in) or localStorage
  useEffect(() => {
    async function load() {
      if (userId) {
        const { data } = await supabase
          .from('card_states')
          .select('*')
          .eq('user_id', userId)

        const states: Record<string, CardState> = {}
        if (data && data.length > 0) {
          for (const row of data) {
            states[row.concept_id] = {
              conceptId: row.concept_id,
              easeFactor: row.ease_factor,
              interval: row.interval,
              repetitions: row.repetitions,
              nextReviewDate: row.next_review_date,
              lastReviewDate: row.last_review_date,
            }
          }
        }
        // Initialize missing concepts
        for (const concept of concepts) {
          if (!states[concept.id]) {
            states[concept.id] = createInitialCardState(concept.id)
          }
        }
        setCardStates(states)
      } else {
        const states = loadCardStates()
        for (const concept of concepts) {
          getOrCreateCardState(states, concept.id)
        }
        saveCardStates(states)
        setCardStates(states)
      }
      setLoaded(true)
    }
    load()
  }, [userId])

  // Sync to localStorage as fallback
  useEffect(() => {
    if (loaded && !userId) {
      saveCardStates(cardStates)
    }
  }, [cardStates, loaded, userId])

  const review = useCallback(
    async (conceptId: string, quality: ReviewQuality) => {
      setCardStates((prev) => {
        const current = prev[conceptId]
        if (!current) return prev
        const updated = reviewCard(current, quality)

        // Fire-and-forget Supabase sync
        if (userId && !syncingRef.current) {
          syncingRef.current = true
          supabase
            .from('card_states')
            .upsert(
              {
                user_id: userId,
                concept_id: conceptId,
                ease_factor: updated.easeFactor,
                interval: updated.interval,
                repetitions: updated.repetitions,
                next_review_date: updated.nextReviewDate,
                last_review_date: updated.lastReviewDate,
                total_reviews: (prev[conceptId]?.repetitions ?? 0) + 1,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id,concept_id' }
            )
            .then(() => {
              supabase.from('activity_log').insert({
                user_id: userId,
                action: 'review',
                metadata: { concept_id: conceptId, quality },
              })
              syncingRef.current = false
            }, () => {
              syncingRef.current = false
            })
        }

        return { ...prev, [conceptId]: updated }
      })
    },
    [userId]
  )

  const dueCards = concepts.filter(
    (c) => cardStates[c.id] && isDueForReview(cardStates[c.id])
  )

  const getCardState = useCallback(
    (conceptId: string) => cardStates[conceptId],
    [cardStates]
  )

  return { cardStates, review, dueCards, getCardState, dueCount: dueCards.length }
}
