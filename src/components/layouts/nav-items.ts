import { BarChart3, Calendar, Home, Settings, Star, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/fixtures', label: 'Partidos', icon: Calendar },
  { to: '/standings', label: 'Tabla', icon: BarChart3 },
  { to: '/bonus', label: 'Bonos', icon: Star },
  { to: '/profile', label: 'Perfil', icon: User },
]

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { to: '/admin/matches', label: 'Partidos', icon: Settings },
]
