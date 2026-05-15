import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/lib/auth/auth-context'
import { queryKeys } from './keys'
import type { Profile } from '@/lib/db/types'

export function useMyProfile() {
  const { user } = useAuth()
  return useQuery({
    queryKey: [...queryKeys.profile.me(), user?.id],
    enabled: isSupabaseConfigured && !!user,
    queryFn: async (): Promise<Profile> => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()
      if (error) throw error
      return data as Profile
    },
  })
}

type UpdateInput = Partial<Pick<Profile, 'display_name' | 'avatar_url'>>

export function useUpdateMyProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateInput): Promise<Profile> => {
      if (!user) throw new Error('No autenticado')
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('profiles')
        .update(input)
        .eq('id', user.id)
        .select()
        .single()
      if (error) throw error
      return data as Profile
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() })
      queryClient.invalidateQueries({ queryKey: queryKeys.ranking.all })
    },
  })
}
