export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()
  const id = getRouterParam(event, 'id')

  const { data, error } = await supabaseAdmin
    .from('performance')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      data: { error: error.message }
    })
  }

  return data
})