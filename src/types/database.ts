export interface Profile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  last_login_at: string
}

export interface CardStateRow {
  id: string
  user_id: string
  concept_id: string
  ease_factor: number
  interval: number
  repetitions: number
  next_review_date: string
  last_review_date: string
  total_reviews: number
  updated_at: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  score: number
  total: number
  completed_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  metadata: Record<string, unknown> | null
  created_at: string
}
