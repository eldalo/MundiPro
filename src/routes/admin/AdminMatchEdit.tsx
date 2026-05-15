import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, ChevronDown, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { MatchCard } from '@/components/match/match-card'
import { TeamFlag } from '@/components/match/team-flag'
import { useMatch, useUpdateMatch } from '@/lib/queries/matches'
import { useTeams } from '@/lib/queries/groups'
import { cn } from '@/lib/utils'
import { formatTeamCode } from '@/lib/format'
import type { MatchStage, MatchStatus, Team } from '@/lib/db/types'

const MAX_SCORE = 30
const MAX_CARDS = 20

const STATUS_LABEL: Record<MatchStatus, string> = {
  scheduled: 'Programado',
  live: 'En vivo',
  finished: 'Finalizado',
}

const KO_STAGES: MatchStage[] = [
  'round_of_32',
  'round_of_16',
  'quarterfinal',
  'semifinal',
  'third_place',
  'final',
]

const isKnockout = (stage: MatchStage) => KO_STAGES.includes(stage)

const scoreSchema = z
  .string()
  .regex(/^\d{0,2}$/, 'Solo dígitos (máx 2)')
  .refine((v) => v === '' || Number(v) <= MAX_SCORE, `Máximo ${MAX_SCORE}`)

const cardSchema = z
  .string()
  .regex(/^\d{0,2}$/, 'Solo dígitos (máx 2)')
  .refine((v) => v === '' || Number(v) <= MAX_CARDS, `Máximo ${MAX_CARDS}`)

const schema = z
  .object({
    home_team: z.string(),
    away_team: z.string(),
    home_score: scoreSchema,
    away_score: scoreSchema,
    status: z.enum(['scheduled', 'live', 'finished']),
    winner_team: z.string(),
    home_yellow_cards: cardSchema,
    home_double_yellows: cardSchema,
    home_red_cards: cardSchema,
    home_yellow_red_cards: cardSchema,
    away_yellow_cards: cardSchema,
    away_double_yellows: cardSchema,
    away_red_cards: cardSchema,
    away_yellow_red_cards: cardSchema,
  })
  .refine(
    (v) => v.status !== 'finished' || (v.home_score !== '' && v.away_score !== ''),
    { message: 'Marcador requerido si el partido está finalizado', path: ['home_score'] },
  )
  .refine((v) => v.home_team === '' || v.away_team === '' || v.home_team !== v.away_team, {
    message: 'Equipos deben ser distintos',
    path: ['away_team'],
  })

type FormValues = z.infer<typeof schema>

const intOrZero = (s: string) => (s === '' ? 0 : Number.parseInt(s, 10))
const intOrNull = (s: string) =>
  s === '' ? null : Number.parseInt(s, 10)

export default function AdminMatchEdit() {
  const params = useParams<{ id: string }>()
  const id = params.id ? Number.parseInt(params.id, 10) : undefined
  const match = useMatch(id)
  const teams = useTeams()
  const update = useUpdateMatch()
  const navigate = useNavigate()
  const [fpOpen, setFpOpen] = useState(false)

  const defaults: FormValues = useMemo(
    () => ({
      home_team: match.data?.home_team ?? '',
      away_team: match.data?.away_team ?? '',
      home_score: match.data?.home_score?.toString() ?? '',
      away_score: match.data?.away_score?.toString() ?? '',
      status: match.data?.status ?? 'scheduled',
      winner_team: match.data?.winner_team ?? '',
      home_yellow_cards: (match.data?.home_yellow_cards ?? 0).toString(),
      home_double_yellows: (match.data?.home_double_yellows ?? 0).toString(),
      home_red_cards: (match.data?.home_red_cards ?? 0).toString(),
      home_yellow_red_cards: (match.data?.home_yellow_red_cards ?? 0).toString(),
      away_yellow_cards: (match.data?.away_yellow_cards ?? 0).toString(),
      away_double_yellows: (match.data?.away_double_yellows ?? 0).toString(),
      away_red_cards: (match.data?.away_red_cards ?? 0).toString(),
      away_yellow_red_cards: (match.data?.away_yellow_red_cards ?? 0).toString(),
    }),
    [
      match.data?.home_team,
      match.data?.away_team,
      match.data?.home_score,
      match.data?.away_score,
      match.data?.status,
      match.data?.winner_team,
      match.data?.home_yellow_cards,
      match.data?.home_double_yellows,
      match.data?.home_red_cards,
      match.data?.home_yellow_red_cards,
      match.data?.away_yellow_cards,
      match.data?.away_double_yellows,
      match.data?.away_red_cards,
      match.data?.away_yellow_red_cards,
    ],
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: defaults,
  })

  const { control, register, handleSubmit, formState, watch } = form

  if (id == null || Number.isNaN(id)) {
    return <ErrorBlock message="Partido inválido." />
  }

  if (match.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    )
  }

  if (match.error || !match.data) {
    return <ErrorBlock message="No se pudo cargar el partido." />
  }

  const stage = match.data.stage
  const showWinner = isKnockout(stage)
  const allowTeamEdit = isKnockout(stage)
  const homeScoreVal = Number(watch('home_score') || '0')
  const awayScoreVal = Number(watch('away_score') || '0')
  const watchedHomeTeam = watch('home_team')
  const watchedAwayTeam = watch('away_team')
  const winnerRequired = showWinner && homeScoreVal === awayScoreVal && watch('status') === 'finished'

  const onSubmit = (values: FormValues) => {
    update.mutate(
      {
        id,
        ...(allowTeamEdit && {
          home_team: values.home_team === '' ? null : values.home_team,
          away_team: values.away_team === '' ? null : values.away_team,
        }),
        home_score: intOrNull(values.home_score),
        away_score: intOrNull(values.away_score),
        status: values.status,
        winner_team: showWinner && values.winner_team !== '' ? values.winner_team : null,
        home_yellow_cards: intOrZero(values.home_yellow_cards),
        home_double_yellows: intOrZero(values.home_double_yellows),
        home_red_cards: intOrZero(values.home_red_cards),
        home_yellow_red_cards: intOrZero(values.home_yellow_red_cards),
        away_yellow_cards: intOrZero(values.away_yellow_cards),
        away_double_yellows: intOrZero(values.away_double_yellows),
        away_red_cards: intOrZero(values.away_red_cards),
        away_yellow_red_cards: intOrZero(values.away_yellow_red_cards),
      },
      {
        onSuccess: () => {
          toast.success('Cromo actualizado', {
            description:
              values.status === 'finished'
                ? 'Puntos + standings recalculados.'
                : undefined,
          })
          navigate('/admin/matches')
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : 'No se pudo guardar'
          toast.error('Error', { description: message })
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/admin/matches"
        className="text-[var(--ink-soft)] hover:text-foreground flex w-fit items-center gap-2 text-xs font-black uppercase tracking-widest"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
        Volver
      </Link>

      <MatchCard match={match.data} />

      <div className="panini-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <span aria-hidden className="h-1 w-6 rounded-full bg-destructive" />
          <span className="panini-eyebrow">Editar marcador</span>
        </div>
        <h2 className="panini-display text-2xl">Resultado</h2>
        <p className="panini-aside text-sm text-[var(--ink-soft)] mt-1 mb-5">
          Cambia el estado a "Finalizado" cuando ingreses el marcador final.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            {allowTeamEdit && (
              <div className="rounded-xl border-2 border-dashed border-[var(--ink)]/40 bg-paper p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-5 rounded-full bg-primary" />
                  <span className="panini-eyebrow">Equipos clasificados</span>
                </div>
                <p className="panini-aside text-xs text-[var(--ink-soft)]">
                  Asigna los dos equipos que disputan este cruce. Hasta que ambos estén definidos, los jugadores no pueden pronosticar.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-3 sm:gap-4">
                  <TeamSelect
                    id="home_team"
                    label="Local"
                    teams={teams.data ?? []}
                    isLoading={teams.isLoading}
                    excludeId={watchedAwayTeam}
                    control={control}
                    name="home_team"
                  />
                  <span className="font-mono text-sm font-black tracking-widest text-[var(--ink-soft)] pb-3 uppercase text-center hidden sm:inline">
                    vs
                  </span>
                  <TeamSelect
                    id="away_team"
                    label="Visitante"
                    teams={teams.data ?? []}
                    isLoading={teams.isLoading}
                    excludeId={watchedHomeTeam}
                    control={control}
                    name="away_team"
                  />
                </div>
                {formState.errors.away_team && (
                  <p className="text-destructive text-xs font-bold">
                    {formState.errors.away_team.message}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 rounded-xl border-2 border-dashed border-[var(--ink)]/40 bg-accent/20 p-4 sm:gap-5">
              <ScoreField
                id="home_score"
                code={match.data.home?.id ?? match.data.home_team}
                teamName={match.data.home?.name ?? null}
                flagUrl={match.data.home?.flag_url ?? null}
                align="left"
                error={!!formState.errors.home_score}
                {...register('home_score')}
              />
              <span className="font-mono text-sm font-black tracking-widest text-[var(--ink-soft)] pb-4 uppercase">
                vs
              </span>
              <ScoreField
                id="away_score"
                code={match.data.away?.id ?? match.data.away_team}
                teamName={match.data.away?.name ?? null}
                flagUrl={match.data.away?.flag_url ?? null}
                align="right"
                error={!!formState.errors.away_score}
                {...register('away_score')}
              />
            </div>
            {formState.errors.home_score && (
              <p className="text-destructive text-xs font-bold">
                {formState.errors.home_score.message}
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="status"
                className="text-[10px] font-black uppercase tracking-widest text-foreground"
              >
                Estado
              </Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="status"
                      ref={field.ref}
                      className="h-12 w-full border-2 border-[var(--ink)] rounded-xl bg-paper"
                    >
                      <SelectValue placeholder="Selecciona…">
                        {STATUS_LABEL[field.value as MatchStatus] ?? 'Selecciona…'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(['scheduled', 'live', 'finished'] as const).map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {showWinner && (
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="winner_team"
                  className="text-[10px] font-black uppercase tracking-widest text-foreground"
                >
                  Ganador (desempate KO)
                </Label>
                <Controller
                  control={control}
                  name="winner_team"
                  render={({ field }) => {
                    const v = field.value || '__none__'
                    const teamLookup = new Map<string, Team>(
                      (teams.data ?? []).map((t) => [t.id, t]),
                    )
                    const homeId = watchedHomeTeam || match.data!.home_team || ''
                    const awayId = watchedAwayTeam || match.data!.away_team || ''
                    const homeName = teamLookup.get(homeId)?.name ?? match.data!.home?.name ?? homeId
                    const awayName = teamLookup.get(awayId)?.name ?? match.data!.away?.name ?? awayId
                    const labelMap: Record<string, string> = {
                      __none__: '— Sin desempate —',
                      ...(homeId ? { [homeId]: `${homeName} (${homeId})` } : {}),
                      ...(awayId ? { [awayId]: `${awayName} (${awayId})` } : {}),
                    }
                    return (
                      <Select
                        key={`${homeId}|${awayId}|${v}`}
                        value={v}
                        onValueChange={(newVal) => field.onChange(newVal === '__none__' ? '' : newVal)}
                      >
                        <SelectTrigger
                          id="winner_team"
                          ref={field.ref}
                          className="h-12 w-full border-2 border-[var(--ink)] rounded-xl bg-paper"
                        >
                          <SelectValue placeholder="Sin desempate">{labelMap[v]}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">— Sin desempate —</SelectItem>
                          {homeId && (
                            <SelectItem value={homeId}>
                              {homeName} ({homeId})
                            </SelectItem>
                          )}
                          {awayId && (
                            <SelectItem value={awayId}>
                              {awayName} ({awayId})
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )
                  }}
                />
                {winnerRequired && watch('winner_team') === '' && (
                  <p className="text-destructive text-xs font-bold">
                    Empate en KO requiere seleccionar ganador (prórroga/penales).
                  </p>
                )}
              </div>
            )}

            <FairPlayPanel
              open={fpOpen}
              onToggle={() => setFpOpen((v) => !v)}
              home={{
                code: match.data!.home?.id ?? match.data!.home_team ?? '',
                name: match.data!.home?.name ?? null,
                flagUrl: match.data!.home?.flag_url ?? null,
              }}
              away={{
                code: match.data!.away?.id ?? match.data!.away_team ?? '',
                name: match.data!.away?.name ?? null,
                flagUrl: match.data!.away?.flag_url ?? null,
              }}
              register={register}
            />
          </div>

          <div className="mt-6 pt-5 border-t-2 border-dashed border-[var(--ink)]/30 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="panini-ghost"
              size="panini-sm"
              onClick={() => navigate('/admin/matches')}
              disabled={update.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="panini"
              size="panini-sm"
              disabled={update.isPending || !formState.isDirty}
            >
              {update.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

type TeamMeta = { code: string; name: string | null; flagUrl: string | null }

function FairPlayPanel({
  open,
  onToggle,
  home,
  away,
  register,
}: {
  open: boolean
  onToggle: () => void
  home: TeamMeta
  away: TeamMeta
  register: ReturnType<typeof useForm<FormValues>>['register']
}) {
  return (
    <div className="rounded-xl border-2 border-[var(--ink)]/40 bg-paper">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-1 w-5 rounded-full bg-[var(--gold)]" />
          <span className="panini-eyebrow">Fair Play · Tarjetas</span>
        </div>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
          strokeWidth={2.5}
        />
      </button>
      {open && (
        <div className="border-t-2 border-dashed border-[var(--ink)]/30 px-4 py-4 space-y-4">
          <p className="panini-aside text-xs text-[var(--ink-soft)]">
            Tarjetas por equipo. Suma puntos negativos para desempate en tabla:
            amarilla -1 · doble amarilla -3 · roja directa -4 · amarilla + roja -5.
          </p>
          <TeamFpRow side="home" team={home} register={register} />
          <TeamFpRow side="away" team={away} register={register} />
        </div>
      )}
    </div>
  )
}

function TeamFpRow({
  side,
  team,
  register,
}: {
  side: 'home' | 'away'
  team: TeamMeta
  register: ReturnType<typeof useForm<FormValues>>['register']
}) {
  const fields: { name: keyof FormValues; label: string; max: number }[] = [
    { name: `${side}_yellow_cards` as keyof FormValues, label: '🟨', max: -1 },
    { name: `${side}_double_yellows` as keyof FormValues, label: '🟨🟨', max: -3 },
    { name: `${side}_red_cards` as keyof FormValues, label: '🟥', max: -4 },
    { name: `${side}_yellow_red_cards` as keyof FormValues, label: '🟨🟥', max: -5 },
  ]
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <TeamFlag code={team.code} name={team.name} flagUrl={team.flagUrl} size="sm" />
        <span className="font-mono text-xs font-black tracking-wider">{team.code}</span>
        {team.name && (
          <span className="text-xs text-[var(--ink-soft)]">{team.name}</span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {fields.map((f) => (
          <div key={f.name} className="flex flex-col gap-1">
            <Label
              htmlFor={f.name}
              className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-soft)] flex items-center justify-between"
            >
              <span>{f.label}</span>
              <span className="font-mono">{f.max}</span>
            </Label>
            <Input
              id={f.name}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              className="h-10 text-center font-mono text-sm font-black tabular-nums px-0"
              {...register(f.name)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

type ScoreFieldProps = React.ComponentProps<typeof Input> & {
  id: string
  code: string | null | undefined
  teamName: string | null
  flagUrl: string | null
  align: 'left' | 'right'
  error: boolean
}

const ScoreField = function ScoreField({
  id,
  code,
  teamName,
  flagUrl,
  align,
  error,
  className,
  ...rest
}: ScoreFieldProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        align === 'right' ? 'items-end' : 'items-start',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2',
          align === 'right' ? 'flex-row-reverse' : '',
        )}
      >
        <TeamFlag code={code} name={teamName} flagUrl={flagUrl} size="md" />
        <span className="font-mono text-sm font-black tracking-wider">
          {formatTeamCode(code)}
        </span>
      </div>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={2}
        aria-invalid={error}
        className={cn(
          'h-14 w-20 text-center font-mono text-2xl font-black tabular-nums px-0',
          error && 'border-destructive focus-visible:ring-destructive/30',
          className,
        )}
        {...rest}
      />
    </div>
  )
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="border-2 border-destructive bg-destructive/10 rounded-xl px-4 py-3 text-sm font-bold">
      {message}
    </div>
  )
}

type TeamSelectProps = {
  id: string
  label: string
  teams: Team[]
  isLoading: boolean
  excludeId?: string
  control: ReturnType<typeof useForm<FormValues>>['control']
  name: 'home_team' | 'away_team'
}

function TeamSelect({ id, label, teams, isLoading, excludeId, control, name }: TeamSelectProps) {
  const sorted = useMemo(() => {
    return [...teams].sort((a, b) => {
      const gA = a.group_code ?? 'Z'
      const gB = b.group_code ?? 'Z'
      if (gA !== gB) return gA.localeCompare(gB)
      return a.name.localeCompare(b.name)
    })
  }, [teams])

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest text-foreground">
        {label}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const v = field.value || '__none__'
          const selected = teams.find((t) => t.id === field.value)
          return (
            <Select
              key={v}
              value={v}
              onValueChange={(next) => field.onChange(next === '__none__' ? '' : next)}
              disabled={isLoading}
            >
              <SelectTrigger
                id={id}
                ref={field.ref}
                className="h-12 w-full border-2 border-[var(--ink)] rounded-xl bg-paper"
              >
                <SelectValue placeholder="Selecciona equipo">
                  {selected ? `${selected.name} (${selected.id})` : '— Sin asignar —'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— Sin asignar —</SelectItem>
                {sorted.map((t) => (
                  <SelectItem key={t.id} value={t.id} disabled={t.id === excludeId}>
                    {t.group_code ? `Grupo ${t.group_code} · ` : ''}
                    {t.name} ({t.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }}
      />
    </div>
  )
}
