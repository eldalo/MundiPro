import type { MatchStage } from '@/lib/db/types'

export type StageGroupKey = 'groups' | 'r32' | 'r16' | 'qf' | 'sf' | 'finals'

export type StageGroup = {
  key: StageGroupKey
  title: string
  shortLabel: string
  stages: MatchStage[]
  userPath: string
  adminPath: string
}

export const GROUP_STAGES: MatchStage[] = [
  'group_a', 'group_b', 'group_c', 'group_d',
  'group_e', 'group_f', 'group_g', 'group_h',
  'group_i', 'group_j', 'group_k', 'group_l',
]

export const STAGE_GROUPS: StageGroup[] = [
  {
    key: 'groups',
    title: 'Fase de Grupos',
    shortLabel: 'Grupos',
    stages: GROUP_STAGES,
    userPath: '/fixtures',
    adminPath: '/admin/matches',
  },
  {
    key: 'r32',
    title: '16avos de final',
    shortLabel: '16avos',
    stages: ['round_of_32'],
    userPath: '/fixtures/r32',
    adminPath: '/admin/matches/r32',
  },
  {
    key: 'r16',
    title: 'Octavos de final',
    shortLabel: 'Octavos',
    stages: ['round_of_16'],
    userPath: '/fixtures/r16',
    adminPath: '/admin/matches/r16',
  },
  {
    key: 'qf',
    title: 'Cuartos de final',
    shortLabel: 'Cuartos',
    stages: ['quarterfinal'],
    userPath: '/fixtures/qf',
    adminPath: '/admin/matches/qf',
  },
  {
    key: 'sf',
    title: 'Semifinales',
    shortLabel: 'Semis',
    stages: ['semifinal'],
    userPath: '/fixtures/sf',
    adminPath: '/admin/matches/sf',
  },
  {
    key: 'finals',
    title: 'Final y Tercer puesto',
    shortLabel: 'Final',
    stages: ['third_place', 'final'],
    userPath: '/fixtures/finals',
    adminPath: '/admin/matches/finals',
  },
]

export function getStageGroup(key: StageGroupKey): StageGroup {
  const found = STAGE_GROUPS.find((g) => g.key === key)
  if (!found) throw new Error(`Unknown stage group: ${key}`)
  return found
}

export function isStageGroupActive(
  group: StageGroup,
  matches: ReadonlyArray<{ stage: MatchStage; home_team: string | null; away_team: string | null }> | undefined,
): boolean {
  if (group.key === 'groups') return true
  if (!matches) return false
  const ofStage = matches.filter((m) => group.stages.includes(m.stage))
  if (ofStage.length === 0) return false
  return ofStage.every((m) => !!m.home_team && !!m.away_team)
}
