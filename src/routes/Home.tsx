import { useMemo } from 'react'
import { Link } from 'react-router'

import { Skeleton } from '@/components/ui/skeleton'
import { MatchRow } from '@/components/match/match-row'
import { HeroCard } from '@/components/dashboard/hero-card'
import { RankingList } from '@/components/dashboard/ranking-list'
import { SectionHeader } from '@/components/ui-extras/section-header'
import { SupabaseNotConfigured } from '@/components/feedback/supabase-not-configured'
import { useAuth } from '@/lib/auth/auth-context'
import { useMyRanking, useRanking } from '@/lib/queries/ranking'
import { useUpcomingMatches } from '@/lib/queries/matches'
import { useMyPredictions } from '@/lib/queries/predictions'
import { useMyProfile } from '@/lib/queries/profile'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { Prediction } from '@/lib/db/types'

export default function Home() {
  const { user } = useAuth()
  const profile = useMyProfile()
  const myRanking = useMyRanking()
  const upcoming = useUpcomingMatches(3)
  const ranking = useRanking(5)
  const predictions = useMyPredictions().data

  const predictionByMatch = useMemo(() => {
    const map = new Map<number, Prediction>()
    predictions?.forEach((p) => map.set(p.match_id, p))
    return map
  }, [predictions])

  const greetName =
    profile.data?.display_name?.trim() ||
    user?.email?.split('@')[0] ||
    'jugador'

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-1 w-6 rounded-full bg-primary" />
          <p className="panini-eyebrow">Mundial 2026 · Álbum personal</p>
        </div>
        <h1 className="panini-display text-4xl sm:text-5xl">
          Hola, <span className="text-primary">{greetName}</span>
        </h1>
      </header>

      {!isSupabaseConfigured && <SupabaseNotConfigured />}

      <HeroCard
        loading={myRanking.isLoading}
        rank={myRanking.data?.rank}
        points={myRanking.data?.total_points}
        exactHits={myRanking.data?.exact_hits}
        nextMatch={upcoming.data?.[0]}
      />

      <section className="flex flex-col gap-4">
        <SectionHeader
          eyebrow="Cromo 002"
          title="Próximos partidos"
          action={
            <Link
              to="/fixtures"
              className="text-xs font-black uppercase tracking-wider underline decoration-2 underline-offset-4 text-foreground"
            >
              Ver todos →
            </Link>
          }
        />
        {upcoming.isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : upcoming.error ? (
          <ErrorBlock message="No se pudieron cargar los partidos." />
        ) : !upcoming.data || upcoming.data.length === 0 ? (
          <EmptyBlock message="Aún no hay partidos en esta hoja del álbum." />
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.data.map((m) => (
              <MatchRow
                key={m.id}
                match={m}
                prediction={predictionByMatch.get(m.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader eyebrow="Cromo 003" title="Tu colección · Ranking" />
        {ranking.isLoading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : ranking.error ? (
          <ErrorBlock message="No se pudo cargar el ranking." />
        ) : !ranking.data || ranking.data.length === 0 ? (
          <EmptyBlock message="Sé el primero en pegar un cromo." />
        ) : (
          <RankingList rows={ranking.data} currentUserId={user?.id} />
        )}
      </section>
    </div>
  )
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="panini-card p-6 text-center">
      <p className="panini-aside text-sm text-[var(--ink-soft)]">{message}</p>
    </div>
  )
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="border-2 border-destructive bg-destructive/10 text-foreground rounded-xl px-4 py-3 text-sm font-bold">
      {message}
    </div>
  )
}
