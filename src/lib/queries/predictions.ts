import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/lib/auth/auth-context'
import { queryKeys } from './keys'
import type { Prediction } from '@/lib/db/types'

export function useMyPredictions() {
  const { user } = useAuth()
  return useQuery({
    queryKey: [...queryKeys.predictions.mine(), user?.id],
    enabled: isSupabaseConfigured && !!user,
    queryFn: async (): Promise<Prediction[]> => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user!.id)
      if (error) throw error
      return (data ?? []) as Prediction[]
    },
  })
}

type InsertInput = { matchId: number; homeScore: number; awayScore: number }

// Cromo inmutable: solo INSERT. La policy DB rechaza UPDATE.
// Si user intenta insertar dos veces, falla por PK unique (user_id, match_id).
export function useCreatePrediction() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: InsertInput): Promise<Prediction> => {
      if (!user) throw new Error('No autenticado')
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('predictions')
        .insert({
          user_id: user.id,
          match_id: input.matchId,
          home_score: input.homeScore,
          away_score: input.awayScore,
        })
        .select()
        .single()
      if (error) throw error
      return data as Prediction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.predictions.mine() })
      queryClient.invalidateQueries({ queryKey: queryKeys.ranking.all })
    },
  })
}
