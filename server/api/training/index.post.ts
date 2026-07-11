export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()
  const body = await readBody(event)

  const { data, error } = await supabaseAdmin
    .from('training')
    .insert(body)
    .select()

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { error: error.message }
    })
  }

  return data[0]
})