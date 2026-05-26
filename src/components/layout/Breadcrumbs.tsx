import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const routeLabels: Record<string, string> = {
  '/': 'System Design',
  '/dsa': 'DSA',
  '/simulator': 'Simulator',
  '/quiz': 'Quiz',
  '/admin': 'Admin',
}

export function Breadcrumbs() {
  const { pathname } = useLocation()

  const label = routeLabels[pathname]
  if (!label || pathname === '/') return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{label}</span>
      </nav>
    </div>
  )
}
