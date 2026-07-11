<script setup lang="ts">
import { cardClasses } from '~/constants/themeClasses'
import type { JobCardProps, JobType } from '~/types'

const props = defineProps<JobCardProps & { onEdit?: (id: number) => void; onDetail?: (id: number) => void }>()

const emit = defineEmits<{
  (e: 'edit', id: number): void
  (e: 'detail', id: number): void
}>()

const typeBadgeClasses: Record<JobType, string> = {
  全職: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  實習: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  兼職: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

function handleEdit() {
  props.onEdit?.(props.id)
  emit('edit', props.id)
}
function handleDetail() {
  props.onDetail?.(props.id)
  emit('detail', props.id)
}
</script>

<template>
  <div :class="[cardClasses, 'p-5']">
    <div class="flex items-start justify-between mb-3">
      <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ title }}</h3>
      <span :class="['px-3 py-1 rounded-lg text-sm font-semibold', typeBadgeClasses[type]]">{{ type }}</span>
    </div>

    <p class="text-base text-slate-500 dark:text-slate-400 mb-3">{{ department }} · {{ location }}</p>

    <p class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">¥{{ salaryMin }} - ¥{{ salaryMax }}</p>

    <div class="flex items-center gap-2 text-base text-slate-500 dark:text-slate-400 mb-4">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        />
      </svg>
      {{ applicantCount }} 位候選人
    </div>

    <div class="border-t border-slate-200 dark:border-slate-700 my-4" />

    <div class="flex gap-3">
      <CommonButton title="編輯" @pressed="handleEdit" />
      <CommonButton title="詳細" bg-color="green" @pressed="handleDetail" />
    </div>
  </div>
</template>