import { useMemo } from 'react'
import { useParams } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { MatchRow } from '@/components/match/match-row'
import { StageTabs } from '@/components/match/stage-tabs'
import { StageMatchesList } from '@/components/match/stage-matches-list'
import { SupabaseNotConfigured } from '@/components/feedback/supabase-not-configured'
import { useMatches } from '@/lib/queries/matches'
import { useMyPredictions } from '@/lib/queries/predictions'
import { isSupabaseConfigured } from '@/lib/supabase'
import { isStageGroupActive, STAGE_GROUPS, type StageGroupKey } from '@/lib/match/stages'
import type { Prediction } from '@/lib/db/types'

const VALID_KEYS = new Set<StageGroupKey>(STAGE_GROUPS.map((g) => g.key))

export default function Fixtures() {
  const { stage } = useParams<{ stage?: string }>()
  const activeKey: StageGroupKey = stage && VALID_KEYS.has(stage as StageGroupKey)
    ? (stage as StageGroupKey)
    : 'groups'
  const group = STAGE_GROUPS.find((g) => g.key === activeKey)!

  const matches = useMatches()
  const predictions = useMyPredictions().data

  const predictionByMatch = useMemo(() => {
    const map = new Map<number, Prediction>()
    predictions?.forEach((p) => map.set(p.match_id, p))
    return map
  }, [predictions])

  const stageMatches = useMemo(() => {
    return (matches.data ?? []).filter((m) => group.stages.includes(m.stage))
  }, [matches.data, group])

  const isActive = isStageGroupActive(group, matches.data)

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-1 w-6 rounded-full bg-primary" />
          <span className="panini-eyebrow">Calendario · {group.shortLabel}</span>
        </div>
        <h1 className="panini-display text-4xl sm:text-5xl">{group.title}</h1>
        {!isActive && (
          <p className="panini-aside text-sm text-[var(--ink-soft)] mt-1">Pronto</p>
        )}
      </header>

      <StageTabs active={activeKey} mode="user" />

      {!isSupabaseConfigured && <SupabaseNotConfigured />}

      {matches.isLoading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : matches.error ? (
        <div className="border-2 border-destructive bg-destructive/10 text-foreground rounded-xl px-4 py-3 text-sm font-bold">
          No se pudieron cargar los partidos.
        </div>
      ) : !isActive ? (
        <div className="panini-card p-8 text-center">
          <p className="panini-aside text-sm text-[var(--ink-soft)]">
            Esta etapa aún no está disponible. Cuando se confirmen los equipos clasificados podrás ver los cruces y pronosticar.
          </p>
        </div>
      ) : (
        <StageMatchesList
          matches={stageMatches}
          emptyMessage="Aún no hay partidos en esta etapa."
          renderItem={(m) => (
            <MatchRow match={m} prediction={predictionByMatch.get(m.id)} />
          )}
        />
      )}
    </div>
  )
}
