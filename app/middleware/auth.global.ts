export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  if (!auth.is_login && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (auth.is_login && to.path === '/login') {
    return navigateTo('/')
  }
})