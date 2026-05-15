import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { MatchWithTeams } from '@/lib/db/types'

const PAGE_SIZE = 10

const STAGE_LABEL: Record<string, string> = {
  group_a: 'grupo a',
  group_b: 'grupo b',
  group_c: 'grupo c',
  group_d: 'grupo d',
  group_e: 'grupo e',
  group_f: 'grupo f',
  group_g: 'grupo g',
  group_h: 'grupo h',
  group_i: 'grupo i',
  group_j: 'grupo j',
  group_k: 'grupo k',
  group_l: 'grupo l',
  round_of_32: '16avos round of 32',
  round_of_16: 'octavos round of 16',
  quarterfinal: 'cuartos cuartos de final',
  semifinal: 'semifinal semis',
  third_place: 'tercer puesto bronce',
  final: 'final',
}

const dateFmt = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

function buildHaystack(m: MatchWithTeams): string {
  const parts = [
    m.home?.name,
    m.home?.id,
    m.home?.group_code,
    m.away?.name,
    m.away?.id,
    m.away?.group_code,
    STAGE_LABEL[m.stage] ?? m.stage,
    m.status,
    dateFmt.format(new Date(m.kickoff_at)),
  ]
  return normalize(parts.filter(Boolean).join(' '))
}

type Props = {
  matches: MatchWithTeams[]
  renderItem: (match: MatchWithTeams) => React.ReactNode
  emptyMessage?: string
  searchPlaceholder?: string
}

export function StageMatchesList({
  matches,
  renderItem,
  emptyMessage = 'No hay partidos.',
  searchPlaceholder = 'Buscar por equipo, código o fecha…',
}: Props) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo<MatchWithTeams[]>(() => {
    const q = normalize(query)
    if (!q) return matches
    if (q.length === 1) {
      return matches.filter((m) => buildHaystack(m).split(/\s+/).some((tok) => tok === q))
    }
    const tokens = q.split(/\s+/).filter(Boolean)
    return matches.filter((m) => {
      const hay = buildHaystack(m)
      const hayTokens = new Set(hay.split(/\s+/))
      return tokens.every((t) => (t.length === 1 ? hayTokens.has(t) : hay.includes(t)))
    })
  }, [matches, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [query])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, filtered.length)
  const pageItems = filtered.slice(start, end)

  return (
    <div className="flex flex-col gap-5">
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-soft)]"
          strokeWidth={2.5}
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Buscar partidos"
          className="pl-10 pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Limpiar búsqueda"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--ink-soft)] hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="panini-card p-8 text-center">
          <p className="panini-aside text-sm text-[var(--ink-soft)]">{emptyMessage}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="panini-card p-8 text-center">
          <p className="panini-aside text-sm text-[var(--ink-soft)]">
            Sin resultados para “{query}”.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-widest text-[var(--ink-soft)]">
            <span>
              {filtered.length === matches.length
                ? `${filtered.length} partidos`
                : `${filtered.length} de ${matches.length}`}
            </span>
            <span>
              Mostrando {start + 1}–{end}
            </span>
          </div>

          <ul className="flex flex-col gap-3">
            {pageItems.map((m) => (
              <li key={m.id}>{renderItem(m)}</li>
            ))}
          </ul>

          {totalPages > 1 && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (next: number) => void
}) {
  const pages = useMemo(() => pageRange(page, totalPages), [page, totalPages])

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-between gap-2 pt-2"
    >
      <Button
        variant="panini-outline"
        size="panini-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      <ul className="flex items-center gap-1">
        {pages.map((p, idx) =>
          p === '…' ? (
            <li
              key={`gap-${idx}`}
              aria-hidden
              className="px-2 text-sm font-mono text-[var(--ink-soft)]"
            >
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Ir a página ${p}`}
                className={cn(
                  'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border-2 px-2 text-xs font-black uppercase tracking-widest',
                  p === page
                    ? 'border-[var(--ink)] bg-primary text-primary-foreground shadow-[0_2px_0_var(--ink)]'
                    : 'border-[var(--ink)]/40 bg-paper text-foreground hover:border-[var(--ink)] hover:bg-accent',
                )}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>

      <Button
        variant="panini-outline"
        size="panini-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
      </Button>
    </nav>
  )
}

function pageRange(current: number, total: number): Array<number | '…'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const out: Array<number | '…'> = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)
  if (left > 2) out.push('…')
  for (let i = left; i <= right; i++) out.push(i)
  if (right < total - 1) out.push('…')
  out.push(total)
  return out
}
