import { useState, useEffect } from 'react'
import {
  Users,
  Activity,
  BookOpen,
  HelpCircle,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Shield,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import {
  getDemoProfiles,
  getDemoCardStates,
  getDemoQuizAttempts,
  getDemoActivity,
} from '@/utils/demoData'
import type { Profile, QuizAttempt, CardStateRow, ActivityLog } from '@/types/database'
import { cn } from '@/lib/utils'

interface UserSummary {
  profile: Profile
  totalReviews: number
  conceptsMastered: number
  conceptsInProgress: number
  quizzesTaken: number
  avgQuizScore: number
  lastActivity: string | null
  streak: number
}

export function AdminDashboard() {
  const { isDemoMode } = useAuth()
  const [users, setUsers] = useState<UserSummary[]>([])
  const [recentActivity, setRecentActivity] = useState<(ActivityLog & { email?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [userCardStates, setUserCardStates] = useState<Record<string, CardStateRow[]>>({})

  useEffect(() => {
    loadDashboardData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadDashboardData() {
    setLoading(true)

    let profiles: Profile[]
    let allCardStates: CardStateRow[]
    let allQuizAttempts: QuizAttempt[]
    let allActivity: ActivityLog[]

    if (isDemoMode) {
      // Use generated demo data
      profiles = getDemoProfiles()
      allCardStates = getDemoCardStates()
      allQuizAttempts = getDemoQuizAttempts()
      allActivity = getDemoActivity().slice(0, 50)
    } else {
      const [profilesRes, cardStatesRes, quizRes, activityRes] = await Promise.all([
        supabase.from('profiles').select('*').order('last_login_at', { ascending: false }),
        supabase.from('card_states').select('*'),
        supabase.from('quiz_attempts').select('*'),
        supabase
          .from('activity_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
      ])

      profiles = profilesRes.data || []
      allCardStates = cardStatesRes.data || []
      allQuizAttempts = quizRes.data || []
      allActivity = activityRes.data || []
    }

    // Build per-user card states map
    const cardStatesMap: Record<string, CardStateRow[]> = {}
    for (const cs of allCardStates) {
      if (!cardStatesMap[cs.user_id]) cardStatesMap[cs.user_id] = []
      cardStatesMap[cs.user_id].push(cs)
    }
    setUserCardStates(cardStatesMap)

    // Build user summaries
    const summaries: UserSummary[] = profiles.map((profile) => {
      const cards = cardStatesMap[profile.id] || []
      const quizzes = allQuizAttempts.filter((q: QuizAttempt) => q.user_id === profile.id)
      const userActivity = allActivity.filter((a: ActivityLog) => a.user_id === profile.id)

      const totalReviews = cards.reduce((sum, c) => sum + c.total_reviews, 0)
      const conceptsMastered = cards.filter((c) => c.repetitions >= 5 && c.ease_factor >= 2.5).length
      const conceptsInProgress = cards.filter((c) => c.repetitions > 0 && c.repetitions < 5).length
      const avgQuizScore =
        quizzes.length > 0
          ? Math.round(
              quizzes.reduce((sum: number, q: QuizAttempt) => sum + (q.score / q.total) * 100, 0) /
                quizzes.length
            )
          : 0

      // Calculate streak (consecutive days with activity)
      const streak = calculateStreak(userActivity)

      return {
        profile,
        totalReviews,
        conceptsMastered,
        conceptsInProgress,
        quizzesTaken: quizzes.length,
        avgQuizScore,
        lastActivity: userActivity[0]?.created_at || null,
        streak,
      }
    })

    setUsers(summaries)

    // Enrich activity log with emails
    const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p.email]))
    setRecentActivity(
      allActivity.map((a: ActivityLog) => ({ ...a, email: profileMap[a.user_id] }))
    )

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="text-muted-foreground text-sm">Loading admin dashboard...</div>
      </div>
    )
  }

  // Aggregate stats
  const totalUsers = users.length
  const activeToday = users.filter((u) => {
    if (!u.lastActivity) return false
    return u.lastActivity.split('T')[0] === new Date().toISOString().split('T')[0]
  }).length
  const totalReviewsAll = users.reduce((s, u) => s + u.totalReviews, 0)
  const totalQuizzesAll = users.reduce((s, u) => s + u.quizzesTaken, 0)
  const avgMastered =
    users.length > 0
      ? Math.round(users.reduce((s, u) => s + u.conceptsMastered, 0) / users.length)
      : 0
  const activeThisWeek = users.filter((u) => {
    if (!u.lastActivity) return false
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(u.lastActivity) >= weekAgo
  }).length

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">
          {totalUsers} users
        </span>
      </div>

      {/* Top-level Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <MetricCard icon={Users} label="Total Users" value={totalUsers} />
        <MetricCard icon={Activity} label="Active Today" value={activeToday} accent="green" />
        <MetricCard icon={Users} label="Active This Week" value={activeThisWeek} accent="blue" />
        <MetricCard icon={BookOpen} label="Total Reviews" value={totalReviewsAll} />
        <MetricCard icon={HelpCircle} label="Quizzes Taken" value={totalQuizzesAll} />
        <MetricCard icon={TrendingUp} label="Avg Mastered" value={avgMastered} accent="purple" />
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">User Progress</h2>
        </div>
        <div className="divide-y divide-border">
          {users.map((u) => (
            <UserRow
              key={u.profile.id}
              user={u}
              expanded={expandedUser === u.profile.id}
              onToggle={() =>
                setExpandedUser(expandedUser === u.profile.id ? null : u.profile.id)
              }
              cardStates={userCardStates[u.profile.id] || []}
            />
          ))}
          {users.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No users yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border max-h-80 overflow-y-auto">
          {recentActivity.map((a) => (
            <div key={a.id} className="px-4 py-2.5 flex items-center gap-3 text-sm">
              <ActivityIcon action={a.action} />
              <span className="text-muted-foreground truncate flex-1">
                <span className="text-foreground font-medium">{a.email || 'Unknown'}</span>
                {' '}
                {actionLabel(a.action)}
                {a.metadata && a.action === 'review' && (
                  <span className="text-muted-foreground">
                    {' '}{String((a.metadata as Record<string, unknown>).concept_id || '').replace(/-/g, ' ')}
                  </span>
                )}
                {a.metadata && a.action === 'quiz_complete' && (
                  <span className="text-muted-foreground">
                    {' '}({String((a.metadata as Record<string, unknown>).score)}/{String((a.metadata as Record<string, unknown>).total)})
                  </span>
                )}
              </span>
              <span className="text-xs text-muted-foreground shrink-0">
                {timeAgo(a.created_at)}
              </span>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No activity yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users
  label: string
  value: number
  accent?: 'green' | 'blue' | 'purple'
}) {
  const valueColor = accent
    ? { green: 'text-green-400', blue: 'text-blue-400', purple: 'text-purple-400' }[accent]
    : 'text-foreground'

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span className={cn('text-xl font-bold', valueColor)}>{value}</span>
    </div>
  )
}

function UserRow({
  user,
  expanded,
  onToggle,
  cardStates,
}: {
  user: UserSummary
  expanded: boolean
  onToggle: () => void
  cardStates: CardStateRow[]
}) {
  const { profile } = user

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors text-left"
      >
        {/* Avatar */}
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt=""
            className="w-8 h-8 rounded-full shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {(profile.display_name || profile.email)[0].toUpperCase()}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">
            {profile.display_name || profile.email}
          </div>
          <div className="text-xs text-muted-foreground">{profile.email}</div>
        </div>

        {/* Quick stats */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
          <span title="Reviews">{user.totalReviews} reviews</span>
          <span title="Mastered" className="text-green-400">{user.conceptsMastered} mastered</span>
          <span title="Quizzes">{user.quizzesTaken} quizzes</span>
          <span title="Avg Score">{user.avgQuizScore}% avg</span>
          <span title="Streak" className="text-amber-400">{user.streak}d streak</span>
        </div>

        {/* Last login */}
        <div className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {profile.last_login_at ? timeAgo(profile.last_login_at) : 'Never'}
        </div>

        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 bg-secondary/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <MiniStat label="Total Reviews" value={user.totalReviews} />
            <MiniStat label="Concepts Mastered" value={user.conceptsMastered} accent="green" />
            <MiniStat label="In Progress" value={user.conceptsInProgress} accent="blue" />
            <MiniStat label="Not Started" value={Math.max(0, 21 - user.conceptsMastered - user.conceptsInProgress)} />
            <MiniStat label="Quizzes Taken" value={user.quizzesTaken} />
            <MiniStat label="Avg Quiz Score" value={`${user.avgQuizScore}%`} accent="purple" />
            <MiniStat label="Current Streak" value={`${user.streak}d`} accent="amber" />
            <MiniStat label="Joined" value={new Date(profile.created_at).toLocaleDateString()} />
          </div>

          {/* Per-concept progress */}
          {cardStates.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Concept Progress</h4>
              <div className="flex flex-wrap gap-1.5">
                {cardStates
                  .sort((a, b) => b.repetitions - a.repetitions)
                  .map((cs) => (
                    <span
                      key={cs.concept_id}
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded border',
                        cs.repetitions >= 5
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : cs.repetitions > 0
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                            : 'bg-secondary border-border text-muted-foreground'
                      )}
                      title={`${cs.repetitions} reps, ease: ${cs.ease_factor.toFixed(2)}, next: ${cs.next_review_date}`}
                    >
                      {cs.concept_id.replace(/-/g, ' ')}
                      {cs.repetitions > 0 && ` (${cs.repetitions})`}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string
  value: string | number
  accent?: 'green' | 'blue' | 'purple' | 'amber'
}) {
  const colors = accent
    ? {
        green: 'text-green-400',
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        amber: 'text-amber-400',
      }[accent]
    : 'text-foreground'

  return (
    <div className="bg-card border border-border rounded-md px-3 py-2">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className={cn('text-sm font-bold', colors)}>{value}</div>
    </div>
  )
}

function ActivityIcon({ action }: { action: string }) {
  const cls = 'h-3.5 w-3.5'
  switch (action) {
    case 'login':
      return <Users className={cn(cls, 'text-blue-400')} />
    case 'review':
      return <BookOpen className={cn(cls, 'text-green-400')} />
    case 'quiz_complete':
      return <HelpCircle className={cn(cls, 'text-purple-400')} />
    default:
      return <Activity className={cn(cls, 'text-muted-foreground')} />
  }
}

function actionLabel(action: string): string {
  switch (action) {
    case 'login':
      return 'logged in'
    case 'review':
      return 'reviewed'
    case 'quiz_complete':
      return 'completed quiz'
    case 'concept_view':
      return 'viewed concept'
    default:
      return action
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function calculateStreak(activity: ActivityLog[]): number {
  if (activity.length === 0) return 0

  const uniqueDays = new Set(
    activity.map((a) => a.created_at.split('T')[0])
  )

  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    if (uniqueDays.has(key)) {
      streak++
    } else if (i === 0) {
      // Today might not have activity yet, skip
      continue
    } else {
      break
    }
  }
  return streak
}
