import { useQuery } from '@tanstack/react-query'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/lib/auth/auth-context'
import { queryKeys } from './keys'
import type { RankingRow } from '@/lib/db/types'

const ORDER = [
  { column: 'total_points', ascending: false },
  { column: 'exact_hits', ascending: false },
  { column: 'winner_hits', ascending: false },
] as const

export function useRanking(limit = 10) {
  return useQuery({
    queryKey: queryKeys.ranking.top(limit),
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<RankingRow[]> => {
      const supabase = getSupabase()
      let q = supabase.from('ranking').select('*')
      for (const { column, ascending } of ORDER) {
        q = q.order(column, { ascending })
      }
      const { data, error } = await q.limit(limit)
      if (error) throw error
      return (data ?? []) as RankingRow[]
    },
  })
}

export type MyRanking = RankingRow & { rank: number }

export function useMyRanking() {
  const { user } = useAuth()
  return useQuery({
    queryKey: [...queryKeys.ranking.mine(), user?.id],
    enabled: isSupabaseConfigured && !!user,
    queryFn: async (): Promise<MyRanking | null> => {
      const supabase = getSupabase()
      let q = supabase.from('ranking').select('*')
      for (const { column, ascending } of ORDER) {
        q = q.order(column, { ascending })
      }
      const { data, error } = await q
      if (error) throw error
      const rows = (data ?? []) as RankingRow[]
      const idx = rows.findIndex((r) => r.user_id === user!.id)
      if (idx === -1) return null
      return { ...rows[idx], rank: idx + 1 }
    },
  })
}
