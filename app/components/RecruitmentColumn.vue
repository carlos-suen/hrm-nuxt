<script setup lang="ts">
import type { RecruitmentJob, RecruitmentStatus } from '~/types'

const props = defineProps<{
  title: string
  jobs: RecruitmentJob[]
  status: RecruitmentStatus
  className?: string
  onEdit?: (id: number) => void
}>()

const emit = defineEmits<{ (e: 'edit', id: number): void }>()

const columnBgClasses: Record<RecruitmentStatus, string> = {
  open: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800',
  paused: 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800',
  closed: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700',
}

const dotColorClasses: Record<RecruitmentStatus, string> = {
  open: 'bg-green-500',
  paused: 'bg-yellow-500',
  closed: 'bg-slate-400',
}

const textColorClass: Record<string, string> = {
  開放中: 'text-green-500',
  暫停: 'text-yellow-500',
  已關閉: 'text-slate-400',
}

function handleEdit(id: number) {
  props.onEdit?.(id)
  emit('edit', id)
}
</script>

<template>
  <div :class="[columnBgClasses[status], 'rounded-xl p-4 border flex flex-col h-full', props.className ?? '']">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span :class="['w-2.5 h-2.5 rounded-full', dotColorClasses[status]]" />
        <h2 :class="['font-sm', textColorClass[title]]">{{ title }}</h2>
      </div>
      <span class="text-sm text-slate-500 dark:text-slate-400">{{ jobs.length }}</span>
    </div>

    <div class="space-y-3 overflow-y-auto flex-1">
      <JobCard
        v-for="job in jobs"
        :key="job.id"
        :id="job.id"
        :title="job.title"
        :department="job.department"
        :location="job.location"
        :salary-min="job.salaryMin"
        :salary-max="job.salaryMax"
        :applicant-count="job.applicantCount"
        :type="job.type"
        @edit="handleEdit"
      />
    </div>
  </div>
</template>