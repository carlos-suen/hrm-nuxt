export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const { data, error } = await supabaseAdmin
    .from('approvals')
    .update(body)
    .eq('id', id)
    .select()

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { error: error.message }
    })
  }

  if (!data || data.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      data: { error: 'Approval not found' }
    })
  }

  return data[0]
})