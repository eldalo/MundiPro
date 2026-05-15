import type { Prediction } from '@/lib/db/types'

export function PredictionResult({ prediction }: { prediction: Prediction }) {
  if (prediction.is_auto) {
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="panini-aside text-xs text-[var(--ink-soft)]">
          Sin cromo pegado · perdiste el pegote
        </span>
        <PointsBadge points={0} />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="panini-eyebrow">Tu cromo</span>
        <span className="font-mono text-base font-black tabular-nums">
          {prediction.home_score} – {prediction.away_score}
        </span>
      </div>
      {prediction.points != null && <PointsBadge points={prediction.points} />}
    </div>
  )
}

export function NoPredictionTag({ finished = false }: { finished?: boolean } = {}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="panini-aside text-xs text-[var(--ink-soft)]">
        {finished ? 'Sin cromo pegado · perdiste el pegote' : 'Sin cromo · ya no podés pegar'}
      </span>
      <span className="inline-flex items-center rounded-md border-2 border-[var(--ink)]/40 bg-paper px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--ink-soft)]">
        0 pts
      </span>
    </div>
  )
}

function PointsBadge({ points }: { points: number }) {
  if (points === 3) {
    return (
      <span className="inline-flex items-center rounded-md border-2 border-[var(--ink)] bg-[var(--success)] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-paper shadow-[2px_2px_0_var(--ink)]">
        ★ +3 exacto
      </span>
    )
  }
  if (points === 1) {
    return (
      <span className="inline-flex items-center rounded-md border-2 border-[var(--ink)] bg-[var(--gold)] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-foreground">
        +1 ganador
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-md border-2 border-[var(--ink)]/40 bg-paper px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--ink-soft)]">
      0 pts
    </span>
  )
}
