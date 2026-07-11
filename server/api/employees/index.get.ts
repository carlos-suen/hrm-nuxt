export default defineEventHandler(async (event) => {
  const supabaseAdmin = useSupabaseAdmin()
  const query = getQuery(event)
  const { name, department, status } = query

  let dbQuery = supabaseAdmin
    .from('workers')
    .select('*')
    .order('created_at', { ascending: false })

  if (name) {
    dbQuery = dbQuery.ilike('name', `%${name}%`)
  }
  if (department && department !== 'all') {
    dbQuery = dbQuery.eq('department', department)
  }
  if (status && Number(status) !== 0) {
    dbQuery = dbQuery.eq('status', Number(status))
  }

  const { data, error } = await dbQuery

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { error: error.message }
    })
  }

  return data
})