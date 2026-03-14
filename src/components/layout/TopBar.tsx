import { useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/organizations': 'Organizaciones',
  '/dashboard/organizations/new': 'Nueva organización',
  '/dashboard/schools': 'Colegios',
  '/dashboard/schools/new': 'Nuevo colegio',
  '/dashboard/users': 'Usuarios',
}

function getPageTitle(pathname: string): string {
  // Exact match first
  if (routeTitles[pathname]) return routeTitles[pathname]

  // Dynamic segments (e.g. /dashboard/schools/:id/members)
  if (pathname.includes('/members/invite')) return 'Invitar miembro'
  if (pathname.includes('/members')) return 'Miembros'
  if (/\/dashboard\/organizations\/[^/]+$/.test(pathname)) return 'Organización'
  if (/\/dashboard\/schools\/[^/]+$/.test(pathname)) return 'Colegio'
  if (/\/dashboard\/users\/[^/]+$/.test(pathname)) return 'Usuario'

  return 'EduAdmin'
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function TopBar() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-base font-semibold text-gray-900">{getPageTitle(pathname)}</h1>

      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xs font-semibold">{getInitials(user.name)}</span>
          </div>
        </div>
      )}
    </header>
  )
}
