export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()

  const { data, error } = await supabaseAdmin
    .from('workers')
    .select('department')

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { error: error.message }
    })
  }

  const departmentCount: Record<string, number> = {}
  data?.forEach(item => {
    departmentCount[item.department] = (departmentCount[item.department] || 0) + 1
  })

  const result = Object.entries(departmentCount).map(([name, value]) => ({
    name,
    value
  }))

  return result
})