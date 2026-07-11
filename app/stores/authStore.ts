import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 用戶信息（與後端 sanitizeUser 對齊）
export interface AuthUser {
  id: number
  username: string
  nickname: string
  role: string
  created_at: string
  updated_at: string
}

const TOKEN_COOKIE_KEY = 'hrm-token'
const USER_COOKIE_KEY = 'hrm-user'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 1 day

// 單 token 機制：使用 useCookie 實現 SSR 兼容的持久化
// useCookie 在 server 端讀取請求 cookie，在 client 端雙向同步，無需 localStorage
export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>(TOKEN_COOKIE_KEY, {
    default: () => null,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
  })

  const userCookie = useCookie<AuthUser | null>(USER_COOKIE_KEY, {
    default: () => null,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
  })

  const user = ref<AuthUser | null>(userCookie.value)

  // computed is_login：token 與 user 皆存在即視為登錄
  const is_login = computed(() => !!token.value && !!user.value)

  function setAuth(newToken: string, newUser: AuthUser) {
    token.value = newToken
    user.value = newUser
    userCookie.value = newUser
  }

  function setUser(newUser: AuthUser) {
    user.value = newUser
    userCookie.value = newUser
  }

  function logout() {
    token.value = null
    user.value = null
    userCookie.value = null
  }

  return { token, is_login, user, setAuth, setUser, logout }
})
