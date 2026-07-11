export default defineEventHandler(async (event) => {
  const currentUser = await authMiddleware(event)
  const supabaseAdmin = useSupabaseAdmin()

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, username, nickname, role, created_at, updated_at')
    .eq('id', currentUser.userId)
    .single()

  if (error || !data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      data: { error: '用戶不存在' }
    })
  }

  return { user: data }
})