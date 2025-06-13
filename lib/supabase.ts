import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// For client components (singleton pattern)
let clientSupabase: ReturnType<typeof createSupabaseClient> | null = null

export const getSupabaseClient = () => {
  if (!clientSupabase) {
    clientSupabase = createSupabaseClient()
  }
  return clientSupabase
}

export default createSupabaseClient
