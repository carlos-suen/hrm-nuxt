<script setup lang="ts">
import { watch, onUnmounted, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title: string
    content?: string
    cancelText?: string
    confirmText?: string
    className?: string
    isDelete?: boolean
    maxWidth?: string
  }>(),
  {
    content: '',
    cancelText: '取消',
    confirmText: '確定',
    isDelete: false,
    maxWidth: 'max-w-lg',
  },
)

const emit = defineEmits<{ (e: 'confirm'): void; (e: 'cancel'): void }>()
const slots = useSlots()

watch(
  () => props.isOpen,
  (open) => {
    if (import.meta.client) {
      document.body.style.overflow = open ? 'hidden' : ''
    }
  },
)
onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div
          :class="[
            'relative z-10 w-full mx-4 p-6 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-slate-700 shadow-xl',
            props.maxWidth,
            props.className ?? '',
          ]"
        >
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">{{ title }}</h3>
          <div class="text-sm text-slate-600 dark:text-slate-400 mb-6">
            <slot>{{ content }}</slot>
          </div>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-700"
              @click="emit('cancel')"
            >
              {{ cancelText }}
            </button>
            <button
              :class="[
                'px-4 py-2 text-sm rounded-lg text-white',
                isDelete ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600',
              ]"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>