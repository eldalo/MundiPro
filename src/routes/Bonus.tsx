import { useState } from 'react'
import { toast } from 'sonner'
import { Crown, Loader2, Lock, Medal, Star, Trophy, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { InputField } from '@/components/ui-extras/input-field'
import { SupabaseNotConfigured } from '@/components/feedback/supabase-not-configured'
import { TeamFlag } from '@/components/match/team-flag'
import {
  useBonusOpen,
  useCreateExtraPrediction,
  useMyExtraPrediction,
  useTournamentOutcomes,
} from '@/lib/queries/extras'
import { useTeams } from '@/lib/queries/groups'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { Team } from '@/lib/db/types'

export default function Bonus() {
  const teamsQuery = useTeams()
  const myExtras = useMyExtraPrediction()
  const bonusOpen = useBonusOpen()
  const outcomes = useTournamentOutcomes()

  const teams = teamsQuery.data ?? []

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-1 w-6 rounded-full bg-destructive" />
          <span className="panini-eyebrow">Cromo dorado · Pronóstico Mundial</span>
        </div>
        <h1 className="panini-display text-4xl sm:text-5xl">Bonos del torneo</h1>
        <p className="panini-aside text-sm text-[var(--ink-soft)] mt-1">
          Cuatro apuestas grandes que pegás una sola vez antes de cerrar la fase de grupos.
        </p>
      </header>

      {!isSupabaseConfigured && <SupabaseNotConfigured />}

      <PointsLegend />

      {myExtras.isLoading || teamsQuery.isLoading || bonusOpen.isLoading ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : myExtras.data ? (
        <ExistingPrediction extras={myExtras.data} teams={teams} outcomesLocked={!bonusOpen.data} />
      ) : !bonusOpen.data ? (
        <ClosedBlock />
      ) : (
        <CreateForm teams={teams} />
      )}

      {outcomes.data && hasOutcomes(outcomes.data) && (
        <OutcomesBlock outcomes={outcomes.data} teams={teams} />
      )}
    </div>
  )
}

function PointsLegend() {
  const items = [
    { icon: Crown, label: 'Campeón', points: 50, accent: 'text-primary' },
    { icon: Medal, label: 'Sub-campeón', points: 20, accent: 'text-[var(--gold)]' },
    { icon: Star, label: 'Goleador', points: 35, accent: 'text-destructive' },
    { icon: User, label: 'MVP', points: 15, accent: 'text-[var(--success)]' },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-xl border-2 border-[var(--ink)]/40 bg-paper p-3 flex flex-col gap-1"
        >
          <div className={`flex items-center gap-1.5 ${it.accent}`}>
            <it.icon className="h-4 w-4" strokeWidth={2.5} />
            <span className="panini-eyebrow">{it.label}</span>
          </div>
          <span className="font-mono text-2xl font-black tabular-nums">+{it.points}</span>
        </div>
      ))}
    </div>
  )
}

function ClosedBlock() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -top-3 -right-3 h-full w-full rounded-3xl bg-destructive"
      />
      <div className="relative panini-card p-7 text-center">
        <Lock className="h-10 w-10 mx-auto mb-3 text-destructive" strokeWidth={2.5} />
        <h2 className="panini-display text-2xl mb-1">Bonos cerrados</h2>
        <p className="panini-aside text-sm text-[var(--ink-soft)]">
          La fase de grupos ya terminó y no llenaste tus bonos. No se puede agregar después.
        </p>
      </div>
    </div>
  )
}

function CreateForm({ teams }: { teams: Team[] }) {
  const [champion, setChampion] = useState('')
  const [runnerUp, setRunnerUp] = useState('')
  const [topScorer, setTopScorer] = useState('')
  const [mvp, setMvp] = useState('')
  const [attempted, setAttempted] = useState(false)
  const create = useCreateExtraPrediction()

  const rawErrors = {
    champion: champion === '' ? 'Selecciona el campeón' : undefined,
    runner_up:
      runnerUp === ''
        ? 'Selecciona el subcampeón'
        : runnerUp === champion
          ? 'No puede ser el mismo que el campeón'
          : undefined,
    top_scorer: topScorer.trim().length < 2 ? 'Mínimo 2 caracteres' : undefined,
    mvp: mvp.trim().length < 2 ? 'Mínimo 2 caracteres' : undefined,
  }
  const errors = attempted
    ? rawErrors
    : { champion: undefined, runner_up: undefined, top_scorer: undefined, mvp: undefined }
  const valid =
    !rawErrors.champion && !rawErrors.runner_up && !rawErrors.top_scorer && !rawErrors.mvp
  const canSubmit = !create.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAttempted(true)
    if (!valid || !canSubmit) return
    create.mutate(
      {
        champion_team: champion,
        runner_up_team: runnerUp,
        top_scorer: topScorer,
        mvp,
      },
      {
        onSuccess: () =>
          toast.success('Cromo dorado pegado', {
            description: 'Tus 4 bonos quedaron sellados. No se pueden editar.',
          }),
        onError: (err) => {
          const message = err instanceof Error ? err.message : 'No se pudo guardar'
          toast.error('Error', { description: message })
        },
      },
    )
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -top-3 -right-3 h-full w-full rounded-3xl bg-primary"
      />
      <div className="relative panini-card p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span aria-hidden className="h-1 w-6 rounded-full bg-destructive" />
          <span className="panini-eyebrow">Pegar bonos · una sola oportunidad</span>
        </div>
        <h2 className="panini-display text-2xl sm:text-3xl">Tus 4 apuestas</h2>
        <p className="panini-aside text-sm text-[var(--ink-soft)] mt-1 mb-6">
          Después de pegar el cromo dorado, no se puede cambiar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <TeamSelectField
            id="champion"
            label="Campeón"
            icon={Crown}
            value={champion}
            onChange={setChampion}
            teams={teams}
            error={errors.champion}
            excludeCode={runnerUp}
          />

          <TeamSelectField
            id="runner_up"
            label="Sub-campeón"
            icon={Medal}
            value={runnerUp}
            onChange={setRunnerUp}
            teams={teams}
            error={errors.runner_up}
            excludeCode={champion}
          />

          <InputField
            id="top_scorer"
            label="Goleador"
            icon={Star}
            placeholder="Ej. Lionel Messi"
            autoComplete="off"
            value={topScorer}
            onChange={(e) => setTopScorer(e.target.value)}
            hint="Nombre completo del jugador."
            error={errors.top_scorer}
          />

          <InputField
            id="mvp"
            label="MVP del Mundial"
            icon={User}
            placeholder="Ej. Kylian Mbappé"
            autoComplete="off"
            value={mvp}
            onChange={(e) => setMvp(e.target.value)}
            hint="Mejor jugador del torneo."
            error={errors.mvp}
          />

          <Button
            type="submit"
            variant="panini"
            size="panini"
            className="w-full"
            disabled={!canSubmit}
          >
            {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {create.isPending ? 'Pegando cromo dorado…' : 'Pegar cromo dorado →'}
          </Button>
        </form>
      </div>
    </div>
  )
}

function TeamSelectField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  teams,
  error,
  excludeCode,
}: {
  id: string
  label: string
  icon: typeof Crown
  value: string
  onChange: (v: string) => void
  teams: Team[]
  error?: string
  excludeCode?: string
}) {
  const sorted = [...teams].sort((a, b) => {
    if (a.group_code !== b.group_code) {
      return (a.group_code ?? '').localeCompare(b.group_code ?? '')
    }
    return a.name.localeCompare(b.name)
  })
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1.5"
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className="h-12 border-2 border-[var(--ink)] rounded-xl bg-paper"
        >
          <SelectValue placeholder="Selecciona equipo…" />
        </SelectTrigger>
        <SelectContent>
          {sorted.map((t) => (
            <SelectItem
              key={t.id}
              value={t.id}
              disabled={excludeCode === t.id}
            >
              <span className="flex items-center gap-2">
                <TeamFlag
                  code={t.id}
                  name={t.name}
                  flagUrl={t.flag_url}
                  size="sm"
                />
                <span className="font-mono text-xs font-black tracking-wider">
                  {t.id}
                </span>
                <span className="text-sm">{t.name}</span>
                <span className="panini-eyebrow ml-auto">Grupo {t.group_code}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-destructive text-xs font-bold">{error}</p>
      )}
    </div>
  )
}

function ExistingPrediction({
  extras,
  teams,
  outcomesLocked,
}: {
  extras: import('@/lib/db/types').ExtraPrediction
  teams: Team[]
  outcomesLocked: boolean
}) {
  const champion = teams.find((t) => t.id === extras.champion_team)
  const runnerUp = teams.find((t) => t.id === extras.runner_up_team)

  const rows = [
    {
      icon: Crown,
      label: 'Campeón',
      max: 50,
      value: champion ? `${champion.name} (${champion.id})` : extras.champion_team,
      flag: champion,
      points: extras.champion_points,
    },
    {
      icon: Medal,
      label: 'Sub-campeón',
      max: 20,
      value: runnerUp ? `${runnerUp.name} (${runnerUp.id})` : extras.runner_up_team,
      flag: runnerUp,
      points: extras.runner_up_points,
    },
    {
      icon: Star,
      label: 'Goleador',
      max: 35,
      value: extras.top_scorer,
      flag: null,
      points: extras.top_scorer_points,
    },
    {
      icon: User,
      label: 'MVP',
      max: 15,
      value: extras.mvp,
      flag: null,
      points: extras.mvp_points,
    },
  ]

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -top-3 -right-3 h-full w-full rounded-3xl bg-[var(--gold)]"
      />
      <div className="relative panini-card p-6 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" strokeWidth={2.5} />
            <span className="panini-eyebrow">Cromo dorado · Sellado</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md border-2 border-[var(--ink)] bg-paper px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
            <Lock className="h-3 w-3" strokeWidth={2.5} /> Inmutable
          </span>
        </div>

        <h2 className="panini-display text-2xl sm:text-3xl mb-1">Tus 4 apuestas</h2>
        <p className="panini-aside text-sm text-[var(--ink-soft)] mb-5">
          {outcomesLocked
            ? 'Fase de grupos cerró. Estos son tus bonos definitivos.'
            : 'Bonos pegados. Esperando resultados finales del Mundial.'}
        </p>

        <div className="border-t-2 border-dashed border-[var(--ink)]/30">
          {rows.map((row, idx) => (
            <div
              key={row.label}
              className={
                'flex items-center justify-between gap-3 py-3' +
                (idx > 0
                  ? ' border-t-2 border-dashed border-[var(--ink)]/20'
                  : '')
              }
            >
              <div className="flex items-center gap-2 min-w-0">
                <row.icon className="h-4 w-4 text-[var(--ink-soft)]" strokeWidth={2.5} />
                <span className="panini-eyebrow">{row.label}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                {row.flag && (
                  <TeamFlag
                    code={row.flag.id}
                    name={row.flag.name}
                    flagUrl={row.flag.flag_url}
                    size="sm"
                  />
                )}
                <span className="font-bold text-sm truncate max-w-[40ch]">
                  {row.value ?? '—'}
                </span>
                <BonusBadge points={row.points} max={row.max} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t-2 border-dashed border-[var(--ink)]/30 flex items-center justify-between">
          <span className="panini-eyebrow">Total bonos</span>
          <span className="font-mono text-2xl font-black tabular-nums text-primary">
            {extras.bonus_points} pts
          </span>
        </div>
      </div>
    </div>
  )
}

function BonusBadge({ points, max }: { points: number | null; max: number }) {
  if (points == null) {
    return (
      <span className="inline-flex items-center rounded-md border-2 border-[var(--ink)]/30 bg-paper px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--ink-soft)]">
        Pendiente
      </span>
    )
  }
  if (points > 0) {
    return (
      <span className="inline-flex items-center rounded-md border-2 border-[var(--ink)] bg-[var(--success)] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-paper shadow-[2px_2px_0_var(--ink)]">
        ★ +{points}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-md border-2 border-[var(--ink)]/40 bg-paper px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--ink-soft)]">
      0/{max}
    </span>
  )
}

function OutcomesBlock({
  outcomes,
  teams,
}: {
  outcomes: import('@/lib/db/types').TournamentOutcomes
  teams: Team[]
}) {
  const champion = teams.find((t) => t.id === outcomes.champion_team)
  const runnerUp = teams.find((t) => t.id === outcomes.runner_up_team)
  return (
    <div className="panini-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="h-4 w-4 text-primary" strokeWidth={2.5} />
        <span className="panini-eyebrow">Resultados oficiales</span>
      </div>
      <ul className="space-y-1 text-sm">
        {outcomes.champion_team && (
          <li>
            <strong>Campeón:</strong> {champion?.name ?? outcomes.champion_team}
          </li>
        )}
        {outcomes.runner_up_team && (
          <li>
            <strong>Sub-campeón:</strong> {runnerUp?.name ?? outcomes.runner_up_team}
          </li>
        )}
        {outcomes.top_scorer && (
          <li>
            <strong>Goleador:</strong> {outcomes.top_scorer}
          </li>
        )}
        {outcomes.mvp && (
          <li>
            <strong>MVP:</strong> {outcomes.mvp}
          </li>
        )}
      </ul>
    </div>
  )
}

function hasOutcomes(o: import('@/lib/db/types').TournamentOutcomes): boolean {
  return !!(o.champion_team || o.runner_up_team || o.top_scorer || o.mvp)
}
