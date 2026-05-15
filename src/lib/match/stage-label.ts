import type { MatchStage } from '@/lib/db/types'

const KNOCKOUT_LABEL: Partial<Record<MatchStage, string>> = {
  round_of_32: '16avos',
  round_of_16: 'Octavos',
  quarterfinal: 'Cuartos',
  semifinal: 'Semifinal',
  third_place: '3er lugar',
  final: 'Final',
}

export function stageLabel(stage: MatchStage): string {
  if (stage.startsWith('group_')) return `Grupo ${stage.slice(-1).toUpperCase()}`
  return KNOCKOUT_LABEL[stage] ?? stage
}
