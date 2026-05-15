import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const FALLBACK_URL = 'https://owleijnbrdjqlbswyvnk.supabase.co'
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93bGVpam5icmRqcWxic3d5dm5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MjEyMDIsImV4cCI6MjA5NDE5NzIwMn0.emzfO0s5q2MvnyCBpVD_Z3E4X-tIk7BjXJqpX9hKux8'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY

let _client: SupabaseClient | null = null

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  return _client
}
