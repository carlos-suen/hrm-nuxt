<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ isMobile?: boolean; className?: string }>(), {
  isMobile: false,
  className: '',
})

const auth = useAuthStore()

const displayName = computed(() =>
  auth.is_login && auth.user ? auth.user.nickname || auth.user.username : null,
)
const displayDesc = computed(() =>
  auth.is_login && auth.user
    ? auth.user.role === 'admin'
      ? '管理員'
      : '普通用戶'
    : '點擊此處進行登錄...',
)

function handlePressed() {
  if (auth.is_login) {
    if (import.meta.client && window.confirm('確定要登出嗎？')) {
      auth.logout()
    }
  }
}
</script>

<template>
  <div
    :class="['flex gap-2 cursor-pointer', props.className]"
    @click="handlePressed"
  >
    <div
      class="rounded-full bg-blue-500 dark:bg-blue-600 w-10 h-10 text-md text-white flex items-center justify-center"
    >
      {{ displayName && displayName.length > 0 ? displayName[0] : '登' }}
    </div>

    <div v-if="!props.isMobile" class="flex flex-col justify-center">
      <span class="text-md font-bold text-black dark:text-white">
        {{ displayName ?? '未登錄' }}
      </span>
      <span class="text-[12px] text-gray-500 dark:text-gray-600">
        {{ displayDesc }}
      </span>
    </div>
  </div>
</template>