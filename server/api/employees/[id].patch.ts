export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const { data, error } = await supabaseAdmin
    .from('workers')
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

  return data[0]
})