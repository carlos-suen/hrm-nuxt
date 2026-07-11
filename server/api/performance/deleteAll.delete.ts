export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()

  const { error } = await supabaseAdmin
    .from('performance')
    .delete()
    .gt('id', 0)

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { error: error.message }
    })
  }

  return { success: true }
})