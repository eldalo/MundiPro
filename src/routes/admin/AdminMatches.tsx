import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { ChevronRight } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import { MatchCard } from '@/components/match/match-card'
import { StageTabs } from '@/components/match/stage-tabs'
import { StageMatchesList } from '@/components/match/stage-matches-list'
import { SupabaseNotConfigured } from '@/components/feedback/supabase-not-configured'
import { useMatches } from '@/lib/queries/matches'
import { isSupabaseConfigured } from '@/lib/supabase'
import { isStageGroupActive, STAGE_GROUPS, type StageGroupKey } from '@/lib/match/stages'

const VALID_KEYS = new Set<StageGroupKey>(STAGE_GROUPS.map((g) => g.key))

export default function AdminMatches() {
  const { stage } = useParams<{ stage?: string }>()
  const activeKey: StageGroupKey = stage && VALID_KEYS.has(stage as StageGroupKey)
    ? (stage as StageGroupKey)
    : 'groups'
  const group = STAGE_GROUPS.find((g) => g.key === activeKey)!

  const matches = useMatches()

  const stageMatches = useMemo(() => {
    return (matches.data ?? []).filter((m) => group.stages.includes(m.stage))
  }, [matches.data, group])

  const isActive = isStageGroupActive(group, matches.data)

  return (
    <div className="flex flex-col gap-7">
      <header>
        <div className="flex items-center gap-2 mb-1">
          <span aria-hidden className="h-1 w-6 rounded-full bg-destructive" />
          <span className="panini-eyebrow">Admin · {group.shortLabel}</span>
        </div>
        <h1 className="panini-display text-3xl sm:text-4xl">{group.title}</h1>
        {isActive ? (
          <p className="panini-aside text-sm text-[var(--ink-soft)] mt-1">
            Carga marcadores finales. El sistema calcula puntos automáticamente.
          </p>
        ) : (
          <p className="panini-aside text-sm text-[var(--ink-soft)] mt-1">Pronto</p>
        )}
      </header>

      <StageTabs active={activeKey} mode="admin" />

      {!isSupabaseConfigured && <SupabaseNotConfigured />}

      {matches.isLoading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : matches.error ? (
        <div className="border-2 border-destructive bg-destructive/10 rounded-xl px-4 py-3 text-sm font-bold">
          No se pudieron cargar los partidos.
        </div>
      ) : !isActive ? (
        <div className="panini-card p-8 text-center">
          <p className="panini-aside text-sm text-[var(--ink-soft)]">
            Asigna los equipos clasificados para activar esta etapa. Mientras no haya equipos, esta página permanece bloqueada.
          </p>
        </div>
      ) : (
        <StageMatchesList
          matches={stageMatches}
          emptyMessage="No hay partidos en esta etapa."
          renderItem={(m) => (
            <Link
              to={`/admin/matches/edit/${m.id}`}
              className="focus-visible:ring-2 focus-visible:ring-ring block rounded-2xl transition focus-visible:outline-none"
              aria-label={`Editar partido ${m.home_team ?? 'TBD'} vs ${m.away_team ?? 'TBD'}`}
            >
              <MatchCard
                match={m}
                footer={
                  <div className="flex items-center justify-end gap-1 text-xs font-black uppercase tracking-widest text-foreground">
                    Editar cromo
                    <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                }
              />
            </Link>
          )}
        />
      )}
    </div>
  )
}
