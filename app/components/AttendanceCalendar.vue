<script setup lang="ts">
import { cardClasses } from '~/constants/themeClasses'

export type CalendarItemType = 'Normal' | 'Late' | 'ELeave' | 'Absent' | 'OLeave' | 'Future' | 'Weekend'

export interface CalendarAreaData {
  tagColor: string
  title: string
}

export interface CalenderItemData {
  title: string
  type: CalendarItemType
}

defineProps<{
  headerTitle: string
  data: CalenderItemData[]
  areas?: CalendarAreaData[]
}>()

const weekdayHeaders = ['日', '一', '二', '三', '四', '五', '六']

const bgColorClasses: Record<CalendarItemType, string> = {
  Normal: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  ELeave: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Absent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  OLeave: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Future: 'bg-slate-50 text-slate-400 dark:bg-slate-900/30 dark:text-slate-400',
  Weekend: 'bg-slate-100 text-slate-400 dark:bg-slate-900/30 dark:text-slate-400',
}

const legendItems: { type: CalendarItemType; label: string }[] = [
  { type: 'Normal', label: '正常' },
  { type: 'Late', label: '遲到' },
  { type: 'Absent', label: '缺勤' },
  { type: 'OLeave', label: '請假' },
  { type: 'Future', label: '未來' },
]

const emptyCells = Array.from({ length: 1 }, (_, i) => i)
</script>

<template>
  <div :class="cardClasses">
    <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-4">{{ headerTitle }}</h3>

    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="day in weekdayHeaders"
        :key="day"
        class="text-center text-sm text-slate-400 dark:text-slate-500 font-medium py-1"
      >
        {{ day }}
      </div>

      <div v-for="(_, index) in emptyCells" :key="`empty-${index}`" class="min-h-[40px]" />

      <div
        v-for="(item, index) in data"
        :key="index"
        :class="[
          bgColorClasses[item.type],
          'rounded-lg p-2 text-center text-sm font-medium min-h-[40px] flex items-center justify-center',
        ]"
      >
        {{ item.title }}
      </div>
    </div>

    <div class="flex flex-wrap gap-4 mt-4 pt-4 dark:border-slate-700">
      <div v-for="legend in legendItems" :key="legend.type" class="flex items-center gap-2">
        <div :class="['w-3 h-3 rounded', bgColorClasses[legend.type].split(' ')[0]]" />
        <span class="text-sm text-slate-600 dark:text-slate-400">{{ legend.label }}</span>
      </div>
    </div>
  </div>
</template>