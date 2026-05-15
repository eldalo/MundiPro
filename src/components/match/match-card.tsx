import { cn } from '@/lib/utils'
import { formatKickoff, formatTeamCode } from '@/lib/format'
import { TeamFlag } from './team-flag'
import { StageBadge } from './stage-badge'
import type { MatchWithTeams } from '@/lib/db/types'

export function MatchCard({
  match,
  footer,
}: {
  match: MatchWithTeams
  footer?: React.ReactNode
}) {
  const { date, time } = formatKickoff(match.kickoff_at)
  const hasScore = match.home_score != null && match.away_score != null
  const isLive = match.status === 'live'

  return (
    <div
      className={cn(
        'panini-card overflow-hidden p-0',
        isLive && 'ring-2 ring-destructive ring-offset-2 ring-offset-background',
      )}
    >
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <StageBadge stage={match.stage} />
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-destructive bg-destructive/10 px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase text-destructive">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive">
                <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-75" />
              </span>
              En vivo
            </span>
          ) : hasScore ? (
            <span className="panini-eyebrow">Final</span>
          ) : (
            <span className="panini-eyebrow">{date}</span>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
          <TeamSide
            code={match.home?.id ?? match.home_team}
            name={match.home?.name ?? null}
            flagUrl={match.home?.flag_url ?? null}
            align="left"
          />
          <div className="flex flex-col items-center gap-0.5">
            {hasScore ? (
              <div className="font-mono text-4xl font-black tabular-nums tracking-tight sm:text-5xl">
                <span>{match.home_score}</span>
                <span className="text-[var(--ink-soft)] mx-2 font-normal">–</span>
                <span>{match.away_score}</span>
              </div>
            ) : (
              <>
                <div className="font-mono text-2xl font-black tabular-nums sm:text-3xl">
                  {time}
                </div>
                <div className="panini-eyebrow">hora</div>
              </>
            )}
          </div>
          <TeamSide
            code={match.away?.id ?? match.away_team}
            name={match.away?.name ?? null}
            flagUrl={match.away?.flag_url ?? null}
            align="right"
          />
        </div>
      </div>
      {footer && (
        <div className="border-t-2 border-dashed border-[var(--ink)]/30 bg-accent/30 px-4 py-3 sm:px-5">
          {footer}
        </div>
      )}
    </div>
  )
}

function TeamSide({
  code,
  name,
  flagUrl,
  align,
}: {
  code: string | null | undefined
  name: string | null
  flagUrl: string | null
  align: 'left' | 'right'
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-2',
        align === 'right' ? 'items-end text-right' : 'items-start',
      )}
    >
      <TeamFlag code={code} name={name} flagUrl={flagUrl} size="lg" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-mono text-base font-black tracking-wider sm:text-lg">
          {formatTeamCode(code)}
        </span>
        {name && (
          <span className="text-[var(--ink-soft)] max-w-[10ch] truncate text-xs sm:max-w-[16ch]">
            {name}
          </span>
        )}
      </div>
    </div>
  )
}
