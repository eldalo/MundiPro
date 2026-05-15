import { MatchCard } from './match-card'
import { PredictionForm } from './prediction-form'
import { NoPredictionTag, PredictionResult } from './prediction-result'
import type { MatchWithTeams, Prediction } from '@/lib/db/types'

export function MatchRow({
  match,
  prediction,
}: {
  match: MatchWithTeams
  prediction?: Prediction
}) {
  const kickoffPast = new Date(match.kickoff_at) <= new Date()
  const matchClosed = match.status !== 'scheduled' || kickoffPast

  // Reglas:
  // - Si user ya pegó cromo → mostrar resultado (cromo inmutable).
  // - Si match cerró (kickoff pasó o status != scheduled) y no pegó → "Sin cromo pegado".
  // - Caso normal → form para pegar.
  let footer: React.ReactNode
  if (prediction) {
    footer = <PredictionResult prediction={prediction} />
  } else if (matchClosed) {
    footer = <NoPredictionTag finished={match.status === 'finished'} />
  } else {
    footer = <PredictionForm match={match} />
  }

  return <MatchCard match={match} footer={footer} />
}
