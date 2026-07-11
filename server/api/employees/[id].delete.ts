export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()
  const id = getRouterParam(event, 'id')

  const { error } = await supabaseAdmin
    .from('workers')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { error: error.message }
    })
  }

  return { success: true }
})