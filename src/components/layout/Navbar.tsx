import { BookOpen, Code2, HelpCircle, Gamepad2, Shield, LogOut, Sun, Moon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/database'

interface NavbarProps {
  dueCount: number
  dsaDueCount?: number
  simDueCount?: number
  profile?: Profile | null
  isAdmin?: boolean
  isDemoMode?: boolean
  onSignOut?: () => void
  theme?: 'light' | 'dark'
  onToggleTheme?: () => void
}

const navItems = [
  { path: '/', label: 'System Design', icon: BookOpen },
  { path: '/dsa', label: 'DSA', icon: Code2 },
  { path: '/simulator', label: 'Simulator', icon: Gamepad2 },
  { path: '/quiz', label: 'Quiz', icon: HelpCircle },
]

export function Navbar({
  dueCount,
  dsaDueCount,
  simDueCount,
  profile,
  isAdmin,
  isDemoMode,
  onSignOut,
  theme,
  onToggleTheme,
}: NavbarProps) {
  const { pathname } = useLocation()

  function isActive(path: string) {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm tracking-tight">
              Learn OS
            </span>
            {isDemoMode && (
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-medium">
                DEMO
              </span>
            )}
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive(path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {path === '/' && dueCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                    {dueCount}
                  </span>
                )}
                {path === '/dsa' && dsaDueCount && dsaDueCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                    {dsaDueCount}
                  </span>
                )}
                {path === '/simulator' && simDueCount && simDueCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                    {simDueCount}
                  </span>
                )}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive('/admin')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-secondary transition-colors"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}

            {profile && (
              <>
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="w-7 h-7 rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {(profile.display_name || profile.email)[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-muted-foreground hidden sm:block max-w-[120px] truncate">
                  {profile.display_name || profile.email}
                </span>
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
