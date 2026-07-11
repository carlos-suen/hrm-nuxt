import { computed } from 'vue'

type ThemeMode = 'light' | 'dark'

const THEME_COOKIE_KEY = 'hrm-theme'

// 使用 useCookie 實現 SSR 兼容的主題持久化，避免 hydration mismatch
// useCookie 在 composable 函數內調用，Nuxt 會按請求緩存實例
export function useTheme() {
  const theme = useCookie<ThemeMode>(THEME_COOKIE_KEY, {
    default: () => 'light',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  const isDark = computed(() => theme.value === 'dark')

  // 透過 useHead 同步 dark class 到 <html>，SSR 與 client 皆生效
  useHead({
    htmlAttrs: {
      class: computed(() => (theme.value === 'dark' ? 'dark' : 'light')),
    },
  })

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, isDark, toggleTheme }
}
