import { Crown, Medal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { RankingRow } from '@/lib/db/types'

type Props = {
  rows: RankingRow[]
  currentUserId?: string
}

export function RankingList({ rows, currentUserId }: Props) {
  const top = rows[0]?.match_points ?? rows[0]?.total_points ?? 0
  const max = Math.max(top, 1)
  return (
    <div className="panini-card overflow-hidden p-0">
      {rows.map((row, idx) => (
        <RankRow
          key={row.user_id}
          row={row}
          rank={idx + 1}
          ratio={(row.match_points ?? row.total_points) / max}
          highlight={row.user_id === currentUserId}
          showSeparator={idx > 0}
        />
      ))}
    </div>
  )
}

function RankRow({
  row,
  rank,
  ratio,
  highlight,
  showSeparator,
}: {
  row: RankingRow
  rank: number
  ratio: number
  highlight: boolean
  showSeparator: boolean
}) {
  const name = row.display_name?.trim() || 'Anónimo'
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div
      className={cn(
        'relative flex items-center gap-3 px-4 py-3 sm:px-5',
        showSeparator && 'border-t-2 border-dashed border-[var(--ink)]/20',
        highlight && 'bg-accent/30',
      )}
    >
      {highlight && (
        <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-primary" />
      )}
      <RankBadge rank={rank} />
      <Avatar className="h-10 w-10 border-2 border-[var(--ink)]">
        {row.avatar_url ? (
          <AvatarImage src={row.avatar_url} alt="" />
        ) : (
          <AvatarFallback className="text-xs font-black bg-accent text-foreground">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold">{name}</div>
        <div className="relative mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--ink)]/10">
          <span
            className={cn(
              'absolute inset-y-0 left-0 rounded-full',
              rank === 1
                ? 'bg-[var(--gold)]'
                : rank === 2
                  ? 'bg-[var(--ink-soft)]'
                  : rank === 3
                    ? 'bg-destructive'
                    : 'bg-primary/70',
            )}
            style={{ width: `${Math.max(ratio * 100, 6)}%` }}
          />
        </div>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="font-mono text-lg font-black tabular-nums text-foreground">
          {row.match_points ?? row.total_points}
          <span className="panini-eyebrow ml-1">pts</span>
        </span>
        {row.bonus_points > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary">
            +{row.bonus_points}
            <span className="panini-eyebrow !text-primary !tracking-widest">bono</span>
          </span>
        )}
      </div>
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--gold)] text-[var(--ink)] shadow-[2px_2px_0_var(--ink)]">
        <Crown className="h-4 w-4" strokeWidth={2.5} />
      </span>
    )
  }
  if (rank === 2) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-paper text-[var(--ink-soft)] shadow-[2px_2px_0_var(--ink)]">
        <Medal className="h-4 w-4" strokeWidth={2.5} />
      </span>
    )
  }
  if (rank === 3) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-destructive/80 text-paper shadow-[2px_2px_0_var(--ink)]">
        <Medal className="h-4 w-4" strokeWidth={2.5} />
      </span>
    )
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ink)]/40 font-mono text-sm font-black tabular-nums text-[var(--ink-soft)]">
      {rank}
    </span>
  )
}
