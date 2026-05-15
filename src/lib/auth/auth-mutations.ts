import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabase } from '@/lib/supabase'

type Credentials = { email: string; password: string }

export function useSignInMutation() {
  return useMutation({
    mutationFn: async ({ email, password }: Credentials) => {
      const supabase = getSupabase()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    },
  })
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: async ({ email, password }: Credentials) => {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      return { needsConfirmation: !data.session }
    },
  })
}

export function useSignOutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const supabase = getSupabase()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
