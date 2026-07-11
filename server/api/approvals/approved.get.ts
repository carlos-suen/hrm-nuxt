export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()

  const { data, error } = await supabaseAdmin
    .from('approvals')
    .select('*')
    .eq('status', 1)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { error: error.message }
    })
  }

  return data
})