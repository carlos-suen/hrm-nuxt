import bcrypt from 'bcryptjs'

const sanitizeUser = (u: Record<string, unknown>) => ({
  id: u.id,
  username: u.username,
  nickname: u.nickname,
  role: u.role,
  created_at: u.created_at,
  updated_at: u.updated_at,
})

export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()
  const body = await readBody(event)
  const username = body.username?.toLowerCase().trim()
  const password = body.password

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { error: '用戶名和密碼為必填項' }
    })
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !data) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: { error: '用戶名或密碼錯誤' }
    })
  }

  if (!bcrypt.compareSync(password, data.password as string)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: { error: '用戶名或密碼錯誤' }
    })
  }

  const token = signToken({
    userId: data.id as number,
    username: data.username as string,
    role: data.role as string,
  })

  return { token, user: sanitizeUser(data) }
})