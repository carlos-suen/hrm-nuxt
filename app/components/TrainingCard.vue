<script setup lang="ts">
import { cardClasses } from '~/constants/themeClasses'
import type { TrainingCourseInfo } from '~/types'

const props = defineProps<{ course: TrainingCourseInfo }>()
const emit = defineEmits<{
  (e: 'enroll', id: number): void
  (e: 'detail', id: number): void
}>()

const typeBadgeClasses: Record<string, string> = {
  技術: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  管理: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  合規: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  入職: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

const statusBadgeClasses: Record<string, string> = {
  即將開始: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  進行中: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  已結束: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

function isFull(c: TrainingCourseInfo) {
  if (!c.maxPeople || !c.currentJoin) return false
  return c.currentJoin >= c.maxPeople
}

const full = isFull(props.course)
const progressPercent =
  props.course.maxPeople && props.course.currentJoin
    ? Math.round((props.course.currentJoin / props.course.maxPeople) * 100)
    : 0
</script>

<template>
  <div :class="[cardClasses, 'p-5']">
    <div class="flex items-center justify-between mb-3">
      <span :class="['px-2 py-0.5 rounded text-xs font-medium', typeBadgeClasses[course.type]]">
        {{ course.type }}
      </span>
      <span :class="['px-2 py-0.5 rounded text-xs font-medium', statusBadgeClasses[course.status || '']]">
        {{ course.status }}
      </span>
    </div>

    <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">{{ course.title }}</h3>

    <p class="text-sm text-slate-500 dark:text-slate-400 mb-2">講師：{{ course.instructor }}</p>

    <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
      <div class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {{ course.startTime }}{{ course.endTime ? ` ~ ${course.endTime}` : '' }}
      </div>
      <div class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {{ course.location }}
      </div>
    </div>

    <div class="mb-4">
      <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
        <span>報名人數</span>
        <span>{{ course.currentJoin }}/{{ course.maxPeople }}</span>
      </div>
      <div class="w-full bg-slate-100 dark:bg-zinc-700 rounded-full h-2">
        <div
          :class="['h-2 rounded-full transition-all', full ? 'bg-red-500' : 'bg-blue-500']"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
    </div>

    <div class="flex gap-3">
      <CommonButton
        :title="full ? '已滿' : '報名'"
        :bg-color="full ? 'grey' : 'blue'"
        @pressed="emit('enroll', course.id)"
      />
      <CommonButton title="詳情" bg-color="green" @pressed="emit('detail', course.id)" />
    </div>
  </div>
</template>