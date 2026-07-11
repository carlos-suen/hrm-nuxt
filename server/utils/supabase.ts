import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type SupabaseAdmin = SupabaseClient

export function useSupabaseAdmin(): SupabaseAdmin {
  const config = useRuntimeConfig()
  return createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}