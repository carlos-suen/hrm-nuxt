<script setup lang="ts">
import { computed } from 'vue'

export interface DataCardItem {
  id: string
  label: string
  icon?: string
  value?: string
  desc?: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

const props = defineProps<{ data: DataCardItem; className?: string }>()

const bgColor = computed(() => {
  switch (props.data.color) {
    case 'blue':
      return 'bg-blue-50 dark:bg-blue-950'
    case 'green':
      return 'bg-blue-100 dark:bg-blue-950'
    case 'purple':
      return 'bg-purple-100 dark:bg-purple-950'
    case 'orange':
      return 'bg-orange-100 dark:bg-orange-950'
    default:
      return 'bg-white dark:bg-zinc-800'
  }
})
</script>

<template>
  <div
    :class="[
      'flex flex-col rounded-xl p-6 shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 gap-5',
      bgColor,
      props.className ?? '',
    ]"
  >
    <div class="dark:text-white space-x-3">
      <span>{{ data.label }}</span>
      <span class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950">{{ data.icon }}</span>
    </div>
    <span class="text-3xl font-bold text-slate-900 dark:text-slate-50">{{ data.value }}</span>
    <span class="text-xs text-slate-500 dark:text-slate-400">{{ data.desc }}</span>
  </div>
</template>