import { Link, useLocation } from 'react-router'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { isStageGroupActive, STAGE_GROUPS, type StageGroupKey } from '@/lib/match/stages'
import { useMatches } from '@/lib/queries/matches'

type Props = {
  active: StageGroupKey
  mode: 'user' | 'admin'
}

export function StageTabs({ active, mode }: Props) {
  const matches = useMatches()
  const location = useLocation()

  return (
    <nav
      aria-label="Etapas del torneo"
      className="-mx-2 overflow-x-auto pb-3"
    >
      <ul className="flex min-w-max items-center gap-2 px-2 py-1">
        {STAGE_GROUPS.map((group) => {
          const isActive = isStageGroupActive(group, matches.data)
          const isCurrent = active === group.key
          const to = mode === 'admin' ? group.adminPath : group.userPath
          const disabled = !isActive

          const base =
            'inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-colors'
          const states = disabled
            ? isCurrent
              ? 'border-[var(--ink)] bg-paper/60 text-[var(--ink-soft)] cursor-not-allowed shadow-[2px_2px_0_var(--ink)]'
              : 'border-[var(--ink)]/30 bg-paper/60 text-[var(--ink-soft)]/70 cursor-not-allowed'
            : isCurrent
              ? 'border-[var(--ink)] bg-primary text-primary-foreground shadow-[2px_2px_0_var(--ink)]'
              : 'border-[var(--ink)]/40 bg-paper text-foreground hover:border-[var(--ink)] hover:bg-accent'

          if (disabled) {
            return (
              <li key={group.key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      aria-disabled="true"
                      aria-current={isCurrent ? 'page' : undefined}
                      tabIndex={0}
                      className={cn(base, states)}
                    >
                      <Lock className="h-3 w-3" strokeWidth={2.5} />
                      {group.shortLabel}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Pronto</TooltipContent>
                </Tooltip>
              </li>
            )
          }

          return (
            <li key={group.key}>
              <Link
                to={to}
                state={location.state}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(base, states)}
              >
                {group.shortLabel}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
