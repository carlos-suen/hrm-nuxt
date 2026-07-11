export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()

  const { error } = await supabaseAdmin
    .from('training')
    .delete()
    .neq('id', 0)

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { error: error.message }
    })
  }

  return { message: '所有培訓記錄已刪除' }
})