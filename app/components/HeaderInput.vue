<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{ headerText: string; hintText?: string; isRequired?: boolean; className?: string }>(), {
  isRequired: true,
})

const value = ref('')
defineExpose({ value })
</script>

<template>
  <div :class="['flex flex-col gap-y-1', className ?? '']">
    <div v-if="isRequired" class="flex gap-1">
      <span class="text-black dark:text-white text-sm">{{ headerText }}</span>
      <span class="text-[14px] text-red-500">*</span>
    </div>
    <span v-else class="text-black dark:text-white text-sm">{{ headerText }}</span>
    <input
      v-model="value"
      class="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      :placeholder="hintText"
    />
  </div>
</template>