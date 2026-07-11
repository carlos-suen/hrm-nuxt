export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()

  const { data, error } = await supabaseAdmin
    .from('recruitment')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { error: error.message }
    })
  }

  return data
})