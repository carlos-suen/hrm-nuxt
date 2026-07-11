export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()
  const body = await readBody(event)
  const records = Array.isArray(body) ? body : [body]

  const { data, error } = await supabaseAdmin
    .from('workers')
    .insert(records)
    .select()

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { error: error.message }
    })
  }

  return data
})