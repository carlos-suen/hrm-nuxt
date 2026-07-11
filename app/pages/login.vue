<script setup lang="ts">
import { ref } from 'vue'

type Mode = 'login' | 'register'

const router = useRouter()
const auth = useAuthStore()
const { login, register } = useAuthApi()

const mode = ref<Mode>('login')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const nickname = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const isRegister = () => mode.value === 'register'

function switchMode() {
  mode.value = isRegister() ? 'login' : 'register'
  error.value = null
  password.value = ''
  confirmPassword.value = ''
}

async function handleSubmit() {
  error.value = null

  if (!username.value.trim() || !password.value) {
    error.value = '請輸入用戶名和密碼'
    return
  }

  if (isRegister()) {
    if (password.value.length < 6) {
      error.value = '密碼長度至少 6 位'
      return
    }
    if (password.value !== confirmPassword.value) {
      error.value = '兩次輸入的密碼不一致'
      return
    }
  }

  loading.value = true
  try {
    if (isRegister()) {
      await register(username.value.trim(), password.value, nickname.value.trim() || undefined)
      const { token, user } = await login(username.value.trim(), password.value)
      auth.setAuth(token, user)
    } else {
      const { token, user } = await login(username.value.trim(), password.value)
      auth.setAuth(token, user)
    }
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '操作失敗，請稍後重試'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: false,
})
</script>

<template>
  <section class="min-h-screen bg-white flex items-center justify-center px-4">
    <div class="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
      <h1 class="text-xl font-bold text-slate-900 text-center mb-6">
        {{ isRegister() ? '註冊' : '登錄' }}
      </h1>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <input
          v-model="username"
          type="text"
          placeholder="用戶名"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />

        <input
          v-if="isRegister()"
          v-model="nickname"
          type="text"
          placeholder="暱稱（可選）"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />

        <input
          v-model="password"
          type="password"
          placeholder="密碼"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />

        <input
          v-if="isRegister()"
          v-model="confirmPassword"
          type="password"
          placeholder="確認密碼"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />

        <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {{ loading ? '處理中...' : isRegister() ? '註冊' : '登錄' }}
        </button>
      </form>

      <div class="flex justify-center gap-4 mt-4">
        <button type="button" class="text-sm text-blue-500 hover:underline" @click="switchMode">
          {{ isRegister() ? '返回登錄' : '註冊用戶' }}
        </button>
        <button
          type="button"
          disabled
          class="text-sm text-slate-400 cursor-not-allowed"
          title="暫未實現"
        >
          忘記密碼
        </button>
      </div>
    </div>
  </section>
</template>