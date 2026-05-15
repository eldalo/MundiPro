import { Link, NavLink } from 'react-router'
import { toast } from 'sonner'
import { Loader2, LogOut, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSignOutMutation } from '@/lib/auth/auth-mutations'
import { useMyProfile } from '@/lib/queries/profile'
import { ADMIN_NAV_ITEMS, NAV_ITEMS, type NavItem } from './nav-items'

export function Sidebar() {
  const profile = useMyProfile()
  const isAdmin = profile.data?.is_admin ?? false
  const signOut = useSignOutMutation()

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => toast.success('Sesión cerrada'),
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'No se pudo cerrar sesión'
        toast.error('Error', { description: message })
      },
    })
  }

  return (
    <aside className="bg-sidebar text-sidebar-foreground border-[var(--ink)]/40 hidden h-svh w-64 shrink-0 flex-col border-r-2 lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex">
      <div className="flex items-center px-5 py-5 border-b-2 border-[var(--ink)]/30">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-primary text-primary-foreground">
            <Trophy className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-base font-black uppercase tracking-wider">Mundi Pro</span>
        </Link>
      </div>

      <nav aria-label="Navegación lateral" className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-5">
        <NavList items={NAV_ITEMS} />
        {isAdmin && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3">
              <span className="h-1 w-5 rounded-full bg-destructive" />
              <span className="panini-eyebrow">Admin</span>
            </div>
            <NavList items={ADMIN_NAV_ITEMS} />
          </div>
        )}
      </nav>

      <div className="flex flex-col gap-3 border-t-2 border-dashed border-[var(--ink)]/30 px-4 py-4">
        <Button
          variant="panini-outline"
          size="panini-sm"
          onClick={handleSignOut}
          disabled={signOut.isPending}
          className="w-full"
        >
          {signOut.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Cerrar sesión
        </Button>
        <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-[var(--ink-soft)] text-center">
          Quiniela Mundial 2026
        </div>
      </div>
    </aside>
  )
}

function NavList({ items }: { items: NavItem[] }) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ to, label, icon: Icon, end }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                isActive
                  ? 'bg-sidebar-accent text-foreground'
                  : 'text-[var(--ink-soft)] hover:bg-sidebar-accent/60 hover:text-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    aria-hidden
                    className="bg-primary absolute inset-y-2 left-0 w-1 rounded-full"
                  />
                )}
                <Icon className="h-5 w-5" strokeWidth={2} />
                <span className="uppercase tracking-wider text-xs">{label}</span>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
