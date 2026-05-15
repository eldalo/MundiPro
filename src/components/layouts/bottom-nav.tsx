import { NavLink } from 'react-router'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './nav-items'

export function BottomNav() {
  return (
    <nav
      aria-label="Navegación principal"
      className="bg-paper border-t-2 border-[var(--ink)] fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'group relative flex h-16 flex-col items-center justify-center gap-1 transition-colors',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  isActive ? 'text-foreground' : 'text-[var(--ink-soft)] hover:text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute top-1.5 h-1.5 w-8 rounded-full bg-primary"
                    />
                  )}
                  <Icon
                    className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-[10px] uppercase tracking-widest font-black">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
