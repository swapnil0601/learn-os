import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { SystemDesign } from '@/components/review/SystemDesign'
import { DsaDashboard } from '@/components/dsa/DsaDashboard'
import { DailyJargonFlash } from '@/components/jargon/DailyJargonFlash'
import { QuizModule } from '@/components/quiz/QuizModule'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { LoginPage } from '@/components/layout/LoginPage'
import { useAuth } from '@/hooks/useAuth'
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition'
import { useJargonDiscovery } from '@/hooks/useJargonDiscovery'
import { useJargonSR } from '@/hooks/useJargonSR'
import { useDsaSR } from '@/hooks/useDsaSR'
import { SimulatorDashboard } from '@/components/simulator/SimulatorDashboard'
import { useSimSR } from '@/hooks/useSimSR'
import { useTheme } from '@/hooks/useTheme'

function AppContent() {
  const { user, profile, isAdmin, isDemoMode, signOut, loading } = useAuth()
  const { review, dueCards, getCardState, dueCount } = useSpacedRepetition(user?.id)
  const jargon = useJargonDiscovery()
  const jargonSR = useJargonSR(jargon.discoveredTerms)
  const dsaSR = useDsaSR()
  const simSR = useSimSR()
  const { theme, toggle: toggleTheme } = useTheme()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        dueCount={dueCount}
        dsaDueCount={dsaSR.dueCount}
        simDueCount={simSR.dueCount}
        profile={profile}
        isAdmin={isAdmin}
        isDemoMode={isDemoMode}
        onSignOut={signOut}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <Breadcrumbs />

      <Routes>
        <Route
          path="/"
          element={
            <SystemDesign
              dueCards={dueCards}
              getCardState={getCardState}
              onReview={review}
              discoveredTerms={jargon.discoveredTerms}
              onConceptViewed={jargon.discoverTermsForConcept}
              earnedBadges={jargon.earnedBadges}
              onConceptNavigate={() => {}}
              dueTerms={jargonSR.dueTerms}
              onJargonReview={jargonSR.review}
              jargonDueCount={jargonSR.dueCount}
            />
          }
        />
        <Route
          path="/dsa"
          element={
            <DsaDashboard
              getCardState={dsaSR.getCardState}
              onReview={dsaSR.review}
              dueCount={dsaSR.dueCount}
            />
          }
        />
        <Route path="/simulator" element={<SimulatorDashboard />} />
        <Route path="/quiz" element={<QuizModule userId={user.id} />} />
        {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {jargon.shouldShowDailyFlash && jargon.dailyFlashTerm && (
        <DailyJargonFlash
          term={jargon.dailyFlashTerm}
          onLearnMore={() => {
            jargon.dismissDailyFlash()
          }}
          onDismiss={jargon.dismissDailyFlash}
        />
      )}
    </div>
  )
}

function App() {
  return <AppContent />
}

export default App
