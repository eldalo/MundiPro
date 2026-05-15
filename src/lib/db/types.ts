export type MatchStatus = 'scheduled' | 'live' | 'finished'

export type MatchStage =
  | 'group_a' | 'group_b' | 'group_c' | 'group_d'
  | 'group_e' | 'group_f' | 'group_g' | 'group_h'
  | 'group_i' | 'group_j' | 'group_k' | 'group_l'
  | 'round_of_32' | 'round_of_16' | 'quarterfinal' | 'semifinal' | 'third_place' | 'final'

export type GroupCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'

export type Group = {
  code: GroupCode
  name: string
  display_order: number
  created_at: string
  updated_at: string
}

export type Team = {
  id: string
  name: string
  group_code: GroupCode | null
  flag_url: string | null
  created_at: string
  updated_at: string
}

export type Match = {
  id: number
  kickoff_at: string
  stage: MatchStage
  home_team: string | null
  away_team: string | null
  home_score: number | null
  away_score: number | null
  status: MatchStatus
  winner_team: string | null
  home_yellow_cards: number
  home_double_yellows: number
  home_red_cards: number
  home_yellow_red_cards: number
  away_yellow_cards: number
  away_double_yellows: number
  away_red_cards: number
  away_yellow_red_cards: number
  created_at: string
  updated_at: string
}

export type GroupStandingRow = {
  team_id: string
  team_name: string
  group_code: GroupCode
  flag_url: string | null
  mp: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  gd: number
  pts: number
  fp_pts: number
}

export type MatchWithTeams = Match & {
  home: Team | null
  away: Team | null
}

export type Prediction = {
  id: number
  user_id: string
  match_id: number
  home_score: number
  away_score: number
  points: number | null
  is_auto: boolean
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export type RankingRow = {
  user_id: string
  display_name: string | null
  avatar_url: string | null
  match_points: number
  bonus_points: number
  total_points: number
  exact_hits: number
  winner_hits: number
  scored_predictions: number
}

export type TournamentOutcomes = {
  id: 'singleton'
  champion_team: string | null
  runner_up_team: string | null
  top_scorer: string | null
  mvp: string | null
  created_at: string
  updated_at: string
}

export type ExtraPrediction = {
  user_id: string
  champion_team: string | null
  runner_up_team: string | null
  top_scorer: string | null
  mvp: string | null
  champion_points: number | null
  runner_up_points: number | null
  top_scorer_points: number | null
  mvp_points: number | null
  bonus_points: number
  created_at: string
  updated_at: string
}
