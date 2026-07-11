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
  const nickname = body.nickname

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { error: '用戶名和密碼為必填項' }
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { error: '密碼長度至少 6 位' }
    })
  }

  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle()

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Conflict',
      data: { error: '用戶名已被註冊' }
    })
  }

  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      username,
      password: hashedPassword,
      salt,
      nickname: nickname || username,
      role: 'user',
    })
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { error: error.message }
    })
  }

  return { user: sanitizeUser(data) }
})