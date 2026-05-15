import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/lib/auth/auth-context'
import { queryKeys } from './keys'
import type { ExtraPrediction, TournamentOutcomes } from '@/lib/db/types'

export function useTournamentOutcomes() {
  return useQuery({
    queryKey: queryKeys.outcomes.singleton(),
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<TournamentOutcomes | null> => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('tournament_outcomes')
        .select('*')
        .eq('id', 'singleton')
        .maybeSingle()
      if (error) throw error
      return data as TournamentOutcomes | null
    },
  })
}

// Deadline derivado: group_stage_complete() en DB. Lo replicamos client-side
// inspeccionando matches: si TODOS los group_a..h tienen status='finished' → cerrado.
export function useBonusOpen() {
  return useQuery({
    queryKey: queryKeys.outcomes.bonusOpen(),
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<boolean> => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('matches')
        .select('status', { count: 'exact', head: false })
        .in('stage', [
          'group_a', 'group_b', 'group_c', 'group_d',
          'group_e', 'group_f', 'group_g', 'group_h',
          'group_i', 'group_j', 'group_k', 'group_l',
        ])
        .neq('status', 'finished')
        .limit(1)
      if (error) throw error
      // Si hay ≥1 group match pendiente → bonus abierto.
      return (data ?? []).length > 0
    },
  })
}

export function useMyExtraPrediction() {
  const { user } = useAuth()
  return useQuery({
    queryKey: [...queryKeys.extras.mine(), user?.id],
    enabled: isSupabaseConfigured && !!user,
    queryFn: async (): Promise<ExtraPrediction | null> => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('extra_predictions')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle()
      if (error) throw error
      return data as ExtraPrediction | null
    },
  })
}

type CreateExtraInput = {
  champion_team: string
  runner_up_team: string
  top_scorer: string
  mvp: string
}

export function useCreateExtraPrediction() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateExtraInput): Promise<ExtraPrediction> => {
      if (!user) throw new Error('No autenticado')
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('extra_predictions')
        .insert({
          user_id: user.id,
          champion_team: input.champion_team,
          runner_up_team: input.runner_up_team,
          top_scorer: input.top_scorer.trim(),
          mvp: input.mvp.trim(),
        })
        .select()
        .single()
      if (error) throw error
      return data as ExtraPrediction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.extras.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.ranking.all })
    },
  })
}
