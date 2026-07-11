export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()

  const { data, error } = await supabaseAdmin
    .from('workers')
    .select('department, sal')

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { error: error.message }
    })
  }

  const departmentSalary: Record<string, { total: number; count: number }> = {}
  data?.forEach(item => {
    if (!departmentSalary[item.department]) {
      departmentSalary[item.department] = { total: 0, count: 0 }
    }
    departmentSalary[item.department].total += item.sal
    departmentSalary[item.department].count += 1
  })

  const result = Object.entries(departmentSalary).map(([name, { total, count }]) => ({
    name,
    value: Math.round(total / count)
  }))

  return result
})