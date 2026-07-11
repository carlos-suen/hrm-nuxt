<script setup lang="ts">
import type { EmployeePerformanceData } from '~/types'

defineProps<{
  heads: string[]
  data: EmployeePerformanceData[]
  className?: string
}>()

const tHeadClass = 'text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400'

const statusBadgeClasses: Record<number, string> = {
  0: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  2: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

const statusLabels: Record<number, string> = {
  0: 'Self Review',
  1: 'Manager Review',
  2: 'Completed',
}

const levelBadgeClasses: Record<string, string> = {
  S: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  A: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  B: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  C: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  D: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function goDetail(id: number) {
  navigateTo({ path: '/performance-detail', query: { id } })
}
</script>

<template>
  <table class="w-full text-sm">
    <thead>
      <tr class="border-b border-slate-200 dark:border-slate-700">
        <th v-for="(head, index) in heads" :key="index" :class="tHeadClass">{{ head }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="data.length === 0">
        <td :colspan="heads.length">
          <EmptyHolder icon="😊" title="暫無相關數據" desc="點擊右上方按鈕開始添加數據吧!" />
        </td>
      </tr>
      <tr
        v-for="record in data"
        v-else
        :key="record.id"
        class="border-b border-slate-100 dark:border-slate-800 last:border-0"
      >
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <ColoredAvatar :level="record.level" :first-name="record.name[0] ?? ''" />
            <div class="font-medium text-slate-900 dark:text-white">{{ record.name }}</div>
          </div>
        </td>
        <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ record.duration }}</td>
        <td class="py-3 px-4 text-slate-900 dark:text-white font-medium">{{ record.score }}</td>
        <td class="py-3 px-4">
          <span
            :class="[
              'inline-block px-2 py-1 rounded text-xs font-medium',
              levelBadgeClasses[record.level] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
            ]"
          >
            {{ record.level }}
          </span>
        </td>
        <td class="py-3 px-4">
          <span
            :class="[
              'inline-block px-2 py-1 rounded text-xs font-medium',
              statusBadgeClasses[record.status] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
            ]"
          >
            {{ statusLabels[record.status] ?? record.status }}
          </span>
        </td>
        <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ record.monitor }}</td>
        <td class="py-3 px-4">
          <button
            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
            @click="goDetail(record.id)"
          >
            詳情
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
