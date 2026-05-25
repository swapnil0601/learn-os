import type { Profile, CardStateRow, QuizAttempt, ActivityLog } from '@/types/database'
import { concepts } from '@/data/concepts'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function dateStr(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

const demoUsers: Profile[] = [
  {
    id: 'demo-admin',
    email: 'admin@example.com',
    display_name: 'You (Admin)',
    avatar_url: null,
    is_admin: true,
    created_at: daysAgo(30),
    last_login_at: daysAgo(0),
  },
  {
    id: 'demo-alice',
    email: 'alice@example.com',
    display_name: 'Alice Chen',
    avatar_url: null,
    is_admin: false,
    created_at: daysAgo(21),
    last_login_at: daysAgo(0),
  },
  {
    id: 'demo-bob',
    email: 'bob@example.com',
    display_name: 'Bob Kumar',
    avatar_url: null,
    is_admin: false,
    created_at: daysAgo(14),
    last_login_at: daysAgo(1),
  },
  {
    id: 'demo-carol',
    email: 'carol@example.com',
    display_name: 'Carol Martinez',
    avatar_url: null,
    is_admin: false,
    created_at: daysAgo(7),
    last_login_at: daysAgo(0),
  },
  {
    id: 'demo-dan',
    email: 'dan@example.com',
    display_name: 'Dan Osei',
    avatar_url: null,
    is_admin: false,
    created_at: daysAgo(3),
    last_login_at: daysAgo(3),
  },
]

function generateCardStates(userId: string, skill: 'advanced' | 'intermediate' | 'beginner'): CardStateRow[] {
  return concepts.map((c, i) => {
    const reps =
      skill === 'advanced' ? Math.min(8, i < 15 ? 5 + Math.floor(Math.random() * 4) : 2) :
      skill === 'intermediate' ? Math.min(6, Math.max(0, 4 - Math.floor(i / 4))) :
      Math.min(3, Math.max(0, 2 - Math.floor(i / 5)))

    const ease = 2.5 + (reps > 3 ? 0.3 : reps > 0 ? -0.1 : 0)
    const interval = reps === 0 ? 0 : Math.pow(2, reps)

    return {
      id: `${userId}-${c.id}`,
      user_id: userId,
      concept_id: c.id,
      ease_factor: ease,
      interval,
      repetitions: reps,
      next_review_date: dateStr(reps > 3 ? -interval : 0),
      last_review_date: dateStr(reps > 0 ? 1 : 0),
      total_reviews: reps + Math.floor(Math.random() * 3),
      updated_at: daysAgo(reps > 0 ? 1 : 0),
    }
  })
}

function generateQuizAttempts(userId: string, count: number, avgPct: number): QuizAttempt[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${userId}-quiz-${i}`,
    user_id: userId,
    score: Math.round((avgPct / 100) * 12 + (Math.random() * 4 - 2)),
    total: 12,
    completed_at: daysAgo(count - i),
  }))
}

function generateActivity(userId: string, _email: string, dayCount: number): ActivityLog[] {
  const logs: ActivityLog[] = []
  let id = 0
  for (let d = dayCount; d >= 0; d--) {
    // Login
    logs.push({
      id: `${userId}-act-${id++}`,
      user_id: userId,
      action: 'login',
      metadata: { timestamp: daysAgo(d) },
      created_at: daysAgo(d),
    })
    // Some reviews
    const reviewCount = Math.floor(Math.random() * 5) + 1
    for (let r = 0; r < reviewCount; r++) {
      const concept = concepts[Math.floor(Math.random() * concepts.length)]
      logs.push({
        id: `${userId}-act-${id++}`,
        user_id: userId,
        action: 'review',
        metadata: { concept_id: concept.id, quality: [0, 2, 4, 5][Math.floor(Math.random() * 4)] },
        created_at: daysAgo(d),
      })
    }
    // Occasional quiz
    if (Math.random() > 0.6) {
      logs.push({
        id: `${userId}-act-${id++}`,
        user_id: userId,
        action: 'quiz_complete',
        metadata: { score: Math.floor(Math.random() * 5) + 7, total: 12 },
        created_at: daysAgo(d),
      })
    }
  }
  return logs
}

export function getDemoProfiles(): Profile[] {
  return demoUsers
}

export function getDemoCardStates(): CardStateRow[] {
  return [
    ...generateCardStates('demo-admin', 'advanced'),
    ...generateCardStates('demo-alice', 'advanced'),
    ...generateCardStates('demo-bob', 'intermediate'),
    ...generateCardStates('demo-carol', 'intermediate'),
    ...generateCardStates('demo-dan', 'beginner'),
  ]
}

export function getDemoQuizAttempts(): QuizAttempt[] {
  return [
    ...generateQuizAttempts('demo-admin', 8, 85),
    ...generateQuizAttempts('demo-alice', 6, 78),
    ...generateQuizAttempts('demo-bob', 4, 65),
    ...generateQuizAttempts('demo-carol', 3, 72),
    ...generateQuizAttempts('demo-dan', 1, 50),
  ]
}

export function getDemoActivity(): ActivityLog[] {
  return [
    ...generateActivity('demo-admin', 'admin@example.com', 14),
    ...generateActivity('demo-alice', 'alice@example.com', 10),
    ...generateActivity('demo-bob', 'bob@example.com', 7),
    ...generateActivity('demo-carol', 'carol@example.com', 5),
    ...generateActivity('demo-dan', 'dan@example.com', 2),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export const DEMO_ADMIN_PROFILE: Profile = demoUsers[0]
