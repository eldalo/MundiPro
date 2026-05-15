import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { queryKeys } from './keys'
import type { Match, MatchStatus, MatchWithTeams } from '@/lib/db/types'

const TEAM_FIELDS = 'id,name,group_code,flag_url,created_at,updated_at'
const MATCH_WITH_TEAMS_SELECT =
  `*, home:home_team(${TEAM_FIELDS}), away:away_team(${TEAM_FIELDS})`

export function useUpcomingMatches(limit = 5) {
  return useQuery({
    queryKey: queryKeys.matches.upcoming(limit),
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<MatchWithTeams[]> => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('matches')
        .select(MATCH_WITH_TEAMS_SELECT)
        .neq('status', 'finished')
        .not('home_team', 'is', null)
        .not('away_team', 'is', null)
        .gte('kickoff_at', new Date().toISOString())
        .order('kickoff_at', { ascending: true })
        .limit(limit)
      if (error) throw error
      return (data ?? []) as unknown as MatchWithTeams[]
    },
  })
}

export function useMatches() {
  return useQuery({
    queryKey: queryKeys.matches.list(),
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<MatchWithTeams[]> => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('matches')
        .select(MATCH_WITH_TEAMS_SELECT)
        .order('kickoff_at', { ascending: true })
      if (error) throw error
      return (data ?? []) as unknown as MatchWithTeams[]
    },
  })
}

export function useMatch(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.matches.detail(id ?? -1),
    enabled: isSupabaseConfigured && id != null,
    queryFn: async (): Promise<MatchWithTeams> => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('matches')
        .select(MATCH_WITH_TEAMS_SELECT)
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as unknown as MatchWithTeams
    },
  })
}

type UpdateMatchInput = {
  id: number
  home_score: number | null
  away_score: number | null
  status: MatchStatus
  home_team?: string | null
  away_team?: string | null
  winner_team?: string | null
  home_yellow_cards?: number
  home_double_yellows?: number
  home_red_cards?: number
  home_yellow_red_cards?: number
  away_yellow_cards?: number
  away_double_yellows?: number
  away_red_cards?: number
  away_yellow_red_cards?: number
}

export function useUpdateMatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateMatchInput): Promise<Match> => {
      const supabase = getSupabase()
      const { id, ...patch } = input
      const { data, error } = await supabase
        .from('matches')
        .update(patch)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Match
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.matches.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.matches.detail(vars.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.predictions.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.ranking.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.standings.list() })
    },
  })
}
