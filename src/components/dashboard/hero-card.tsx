import { Star, Trophy } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TeamFlag } from '@/components/match/team-flag'
import { formatKickoff, formatTeamCode } from '@/lib/format'
import type { MatchWithTeams } from '@/lib/db/types'

type Props = {
  loading: boolean
  rank: number | undefined
  points: number | undefined
  exactHits: number | undefined
  nextMatch: MatchWithTeams | undefined
}

export function HeroCard({ loading, rank, points, exactHits, nextMatch }: Props) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -top-3 -right-3 h-full w-full rounded-3xl bg-primary"
      />
      <div className="relative panini-card p-6 sm:p-7 shadow-xl overflow-hidden">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span aria-hidden className="h-1.5 w-8 rounded-full bg-destructive" />
              <span className="panini-eyebrow">Cromo 001 · Tu cromo</span>
            </div>
            <h2 className="panini-display text-2xl sm:text-3xl flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" strokeWidth={2.5} />
              Tu posición
            </h2>
          </div>
          <div className="flex">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-3 w-3 fill-[var(--gold)] text-[var(--gold)] -ml-0.5" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          <Stat label="Ranking" value={loading ? null : rank == null ? '—' : `#${rank}`} accent="primary" />
          <Stat label="Puntos" value={loading ? null : points == null ? '0' : String(points)} accent="destructive" />
          <Stat label="Aciertos" value={loading ? null : exactHits == null ? '0' : String(exactHits)} accent="success" />
        </div>

        <div className="mt-6 pt-5 panini-dashed">
          <div className="flex items-center gap-2 mb-3">
            <span aria-hidden className="h-1 w-5 rounded-full bg-primary" />
            <span className="panini-eyebrow">Próximo cromo</span>
          </div>
          {nextMatch ? (
            <NextMatch match={nextMatch} />
          ) : loading ? (
            <Skeleton className="h-12 w-full rounded-lg" />
          ) : (
            <p className="panini-aside text-sm text-[var(--ink-soft)]">
              Sin partidos próximos en esta hoja.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string | null
  accent: 'primary' | 'destructive' | 'success'
}) {
  const colorClass =
    accent === 'primary' ? 'text-primary' : accent === 'destructive' ? 'text-destructive' : 'text-[var(--success)]'
  return (
    <div className="border-2 border-[var(--ink)]/40 rounded-xl bg-paper p-3 sm:p-4 flex flex-col gap-1">
      <span className="panini-eyebrow">{label}</span>
      {value === null ? (
        <Skeleton className="h-10 w-16" />
      ) : (
        <span className={`font-mono text-3xl sm:text-4xl font-black tabular-nums tracking-tight ${colorClass}`}>
          {value}
        </span>
      )}
    </div>
  )
}

function NextMatch({ match }: { match: MatchWithTeams }) {
  const { date, time } = formatKickoff(match.kickoff_at)
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <TeamFlag code={match.home?.id ?? match.home_team} name={match.home?.name} flagUrl={match.home?.flag_url ?? null} size="md" />
        <span className="font-mono text-sm font-black tracking-wider sm:text-base">
          {formatTeamCode(match.home?.id ?? match.home_team)}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <span className="font-mono text-lg font-black tabular-nums sm:text-xl">{time}</span>
        <span className="panini-eyebrow">{date}</span>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
        <span className="font-mono text-sm font-black tracking-wider sm:text-base">
          {formatTeamCode(match.away?.id ?? match.away_team)}
        </span>
        <TeamFlag code={match.away?.id ?? match.away_team} name={match.away?.name} flagUrl={match.away?.flag_url ?? null} size="md" />
      </div>
    </div>
  )
}
