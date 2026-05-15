import { useQuery } from '@tanstack/react-query'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { queryKeys } from './keys'
import type { GroupStandingRow } from '@/lib/db/types'

export function useGroupStandings() {
  return useQuery({
    queryKey: queryKeys.standings.list(),
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<GroupStandingRow[]> => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('group_standings')
        .select('*')
      if (error) throw error
      // View already returns ordered. Re-sort client-side for safety.
      const rows = (data ?? []) as GroupStandingRow[]
      return rows.sort((a, b) => {
        if (a.group_code !== b.group_code) return a.group_code.localeCompare(b.group_code)
        if (a.pts !== b.pts) return b.pts - a.pts
        if (a.gd !== b.gd) return b.gd - a.gd
        if (a.gf !== b.gf) return b.gf - a.gf
        return b.fp_pts - a.fp_pts
      })
    },
  })
}
