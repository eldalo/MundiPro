import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useCreatePrediction } from '@/lib/queries/predictions'
import type { MatchWithTeams } from '@/lib/db/types'

const MAX_SCORE = 20

type Props = {
  match: MatchWithTeams
}

// Cromo se pega UNA SOLA VEZ. No editable. MatchRow esconde el form si ya existe.
export function PredictionForm({ match }: Props) {
  const [home, setHome] = useState<string>('')
  const [away, setAway] = useState<string>('')
  const create = useCreatePrediction()

  const validate = (raw: string): number | null => {
    if (raw === '') return null
    const n = Number.parseInt(raw, 10)
    if (!Number.isInteger(n) || n < 0 || n > MAX_SCORE) return null
    return n
  }

  const homeVal = validate(home)
  const awayVal = validate(away)
  const valid = homeVal !== null && awayVal !== null
  const canSubmit = valid && !create.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || homeVal === null || awayVal === null) return
    create.mutate(
      { matchId: match.id, homeScore: homeVal, awayScore: awayVal },
      {
        onSuccess: () =>
          toast.success('Cromo pegado', { description: 'Tu pronóstico quedó sellado.' }),
        onError: (err) => {
          const message = err instanceof Error ? err.message : 'No se pudo guardar'
          toast.error('Error', { description: message })
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span aria-hidden className="h-1 w-4 rounded-full bg-primary" />
        <span className="panini-eyebrow">Tu cromo</span>
      </div>
      <div className="flex items-center gap-2">
        <ScoreInput
          id={`pred-home-${match.id}`}
          ariaLabel={`Marcador local ${match.home?.id ?? match.home_team ?? ''}`}
          value={home}
          onChange={setHome}
        />
        <span className="text-[var(--ink-soft)] font-mono text-base font-black">–</span>
        <ScoreInput
          id={`pred-away-${match.id}`}
          ariaLabel={`Marcador visitante ${match.away?.id ?? match.away_team ?? ''}`}
          value={away}
          onChange={setAway}
        />
        <Button type="submit" variant="panini" size="panini-sm" disabled={!canSubmit}>
          {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Pegar
        </Button>
      </div>
    </form>
  )
}

function ScoreInput({
  id,
  ariaLabel,
  value,
  onChange,
}: {
  id: string
  ariaLabel: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Input
      id={id}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={2}
      value={value}
      onChange={(e) => {
        const next = e.target.value.replace(/[^0-9]/g, '').slice(0, 2)
        onChange(next)
      }}
      aria-label={ariaLabel}
      className={cn(
        'h-10 w-12 px-0 text-center font-mono text-lg font-black tabular-nums',
      )}
    />
  )
}
