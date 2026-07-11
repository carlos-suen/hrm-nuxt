export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (body.current_join === 1) {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('training')
      .select('current_join, max_people')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        data: { error: fetchError.message }
      })
    }

    if (existing.current_join >= existing.max_people) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: { error: '課程已滿員' }
      })
    }

    const { data, error } = await supabaseAdmin
      .from('training')
      .update({ current_join: (existing.current_join || 0) + 1 })
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
  }

  const { data, error } = await supabaseAdmin
    .from('training')
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