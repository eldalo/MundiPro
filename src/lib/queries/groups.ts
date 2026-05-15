import { useQuery } from '@tanstack/react-query'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { queryKeys } from './keys'
import type { Group, Team } from '@/lib/db/types'

export function useGroups() {
  return useQuery({
    queryKey: queryKeys.groups.list(),
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<Group[]> => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('display_order', { ascending: true })
      if (error) throw error
      return (data ?? []) as Group[]
    },
  })
}

export function useTeams() {
  return useQuery({
    queryKey: queryKeys.teams.list(),
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<Team[]> => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('group_code', { ascending: true })
        .order('name', { ascending: true })
      if (error) throw error
      return (data ?? []) as Team[]
    },
  })
}

export function useTeamsByGroup(code: string | undefined) {
  return useQuery({
    queryKey: queryKeys.teams.byGroup(code ?? ''),
    enabled: isSupabaseConfigured && !!code,
    queryFn: async (): Promise<Team[]> => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('group_code', code!)
        .order('name', { ascending: true })
      if (error) throw error
      return (data ?? []) as Team[]
    },
  })
}
