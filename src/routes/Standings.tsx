import { useMemo } from 'react'
import { Trophy } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { TeamFlag } from '@/components/match/team-flag'
import { SupabaseNotConfigured } from '@/components/feedback/supabase-not-configured'
import { useGroupStandings } from '@/lib/queries/standings'
import { useGroups } from '@/lib/queries/groups'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { GroupStandingRow } from '@/lib/db/types'

export default function Standings() {
  const standings = useGroupStandings()
  const groups = useGroups()

  const grouped = useMemo(() => {
    const out = new Map<string, GroupStandingRow[]>()
    standings.data?.forEach((row) => {
      const list = out.get(row.group_code) ?? []
      list.push(row)
      out.set(row.group_code, list)
    })
    return out
  }, [standings.data])

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-1 w-6 rounded-full bg-primary" />
          <span className="panini-eyebrow">Tabla por grupo · Top 2 pasan a R16</span>
        </div>
        <h1 className="panini-display text-4xl sm:text-5xl">Standings</h1>
        <p className="panini-aside text-sm text-[var(--ink-soft)] mt-1">
          Pts → diferencia de goles → goles a favor → fair play (-1 amarilla, -3 doble, -4 roja, -5 amarilla+roja).
        </p>
      </header>

      {!isSupabaseConfigured && <SupabaseNotConfigured />}

      {standings.isLoading || groups.isLoading ? (
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : standings.error ? (
        <div className="border-2 border-destructive bg-destructive/10 rounded-xl px-4 py-3 text-sm font-bold">
          No se pudo cargar el ranking.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {(groups.data ?? []).map((g) => (
            <GroupTable
              key={g.code}
              code={g.code}
              name={g.name}
              rows={grouped.get(g.code) ?? []}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function GroupTable({
  code,
  name,
  rows,
}: {
  code: string
  name: string
  rows: GroupStandingRow[]
}) {
  return (
    <section className="panini-card overflow-hidden p-0">
      <header className="flex items-center justify-between border-b-2 border-[var(--ink)]/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-primary text-primary-foreground font-black">
            {code}
          </span>
          <h2 className="panini-display text-lg">{name}</h2>
        </div>
        <span className="panini-eyebrow">{rows.length} equipos</span>
      </header>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-accent/20">
            <Th className="w-8 text-center">#</Th>
            <Th>Equipo</Th>
            <Th className="text-center"><HeaderTip label="PJ" hint="Partidos jugados" /></Th>
            <Th className="text-center"><HeaderTip label="G" hint="Victorias" /></Th>
            <Th className="text-center"><HeaderTip label="E" hint="Empates" /></Th>
            <Th className="text-center"><HeaderTip label="P" hint="Derrotas" /></Th>
            <Th className="text-center"><HeaderTip label="GF" hint="Goles a favor" /></Th>
            <Th className="text-center"><HeaderTip label="GC" hint="Goles en contra" /></Th>
            <Th className="text-center"><HeaderTip label="DG" hint="Diferencia de goles" /></Th>
            <Th className="text-center"><HeaderTip label="FP" hint="Fair play (negativo)" /></Th>
            <Th className="text-center bg-[var(--gold)]/30">Pts</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const position = idx + 1
            const qualifies = position <= 2
            return (
              <tr
                key={row.team_id}
                className={
                  'border-t-2 border-dashed border-[var(--ink)]/20 ' +
                  (qualifies ? 'bg-[var(--gold)]/20' : '')
                }
              >
                <td className="px-2 py-2.5 text-center font-mono font-black tabular-nums">
                  {position}
                </td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <TeamFlag
                      code={row.team_id}
                      name={row.team_name}
                      flagUrl={row.flag_url}
                      size="sm"
                    />
                    <span className="font-mono text-xs font-black tracking-wider">
                      {row.team_id}
                    </span>
                    <span className="truncate text-xs">{row.team_name}</span>
                    {qualifies && (
                      <Trophy
                        className="ml-auto h-3.5 w-3.5 text-[var(--gold)]"
                        strokeWidth={2.5}
                      />
                    )}
                  </div>
                </td>
                <Td>{row.mp}</Td>
                <Td>{row.w}</Td>
                <Td>{row.d}</Td>
                <Td>{row.l}</Td>
                <Td>{row.gf}</Td>
                <Td>{row.ga}</Td>
                <Td className={row.gd > 0 ? 'text-[var(--success)]' : row.gd < 0 ? 'text-destructive' : ''}>
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </Td>
                <Td className={row.fp_pts < 0 ? 'text-destructive' : 'text-[var(--ink-soft)]'}>
                  {row.fp_pts}
                </Td>
                <Td className="bg-[var(--gold)]/30 font-black">{row.pts}</Td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

function Th({
  className,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={
        'px-2 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--ink-soft)] ' +
        (className ?? '')
      }
      {...rest}
    />
  )
}

function HeaderTip({ label, hint }: { label: string; hint: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} aria-label={hint} className="cursor-help">
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent>{hint}</TooltipContent>
    </Tooltip>
  )
}

function Td({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <td
      className={
        'px-2 py-2.5 text-center font-mono text-xs tabular-nums ' + (className ?? '')
      }
    >
      {children}
    </td>
  )
}
