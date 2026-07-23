export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()

  // 在生產環境檢查必要的環境變數
  if (process.env.NODE_ENV === 'production') {
    if (!config.supabaseUrl) {
      console.error('❌ SUPABASE_URL 未設置')
    }
    if (!config.supabaseServiceRoleKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY 未設置')
    }
    if (!config.jwtSecret) {
      console.error('❌ JWT_SECRET 未設置')
    }
    if (!config.public.supabaseAnonKey) {
      console.error('❌ SUPABASE_ANON_KEY 未設置')
    }
  }
})