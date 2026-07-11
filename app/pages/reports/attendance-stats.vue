<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { EChartsOption } from 'echarts'
import { useTheme } from '~/composables/useTheme'

// 延遲加載 vue-echarts：SSR 不會執行 import，避免 document is not defined
const VChart = defineAsyncComponent(() => import('vue-echarts'))

interface MonthlyAttendance {
  month: string
  attendanceRate: number
  lateRate: number
  earlyLeaveRate: number
  absentRate: number
}

const monthlyData: MonthlyAttendance[] = [
  { month: '2026-01', attendanceRate: 96.2, lateRate: 2.1, earlyLeaveRate: 1.0, absentRate: 0.7 },
  { month: '2026-02', attendanceRate: 95.8, lateRate: 2.5, earlyLeaveRate: 1.2, absentRate: 0.5 },
  { month: '2026-03', attendanceRate: 97.1, lateRate: 1.8, earlyLeaveRate: 0.7, absentRate: 0.4 },
  { month: '2026-04', attendanceRate: 96.5, lateRate: 2.0, earlyLeaveRate: 1.0, absentRate: 0.5 },
  { month: '2026-05', attendanceRate: 95.3, lateRate: 2.8, earlyLeaveRate: 1.3, absentRate: 0.6 },
]

const { isDark } = useTheme()
const textColor = computed(() => (isDark.value ? '#94a3b8' : '#64748b'))
const splitColor = computed(() => (isDark.value ? '#334155' : '#e2e8f0'))

const trendOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  textStyle: { color: textColor.value },
  tooltip: { trigger: 'axis' },
  legend: { data: ['出勤率', '遲到率', '早退率', '缺勤率'], textStyle: { color: textColor.value } },
  grid: { left: 10, right: 20, top: 30, bottom: 10, containLabel: true },
  xAxis: {
    type: 'category',
    data: monthlyData.map((d) => d.month),
    axisLabel: { color: textColor.value, fontSize: 12 },
    axisLine: { lineStyle: { color: splitColor.value } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: textColor.value, fontSize: 12, formatter: '{value}%' },
    splitLine: { lineStyle: { color: splitColor.value, type: 'dashed' } },
  },
  series: [
    { name: '出勤率', type: 'line', smooth: true, data: monthlyData.map((d) => d.attendanceRate), itemStyle: { color: '#22c55e' } },
    { name: '遲到率', type: 'line', smooth: true, data: monthlyData.map((d) => d.lateRate), itemStyle: { color: '#f97316' } },
    { name: '早退率', type: 'line', smooth: true, data: monthlyData.map((d) => d.earlyLeaveRate), itemStyle: { color: '#a855f7' } },
    { name: '缺勤率', type: 'line', smooth: true, data: monthlyData.map((d) => d.absentRate), itemStyle: { color: '#ef4444' } },
  ],
}))

const thClass = 'text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400'
const cardClasses = 'bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-slate-700'
</script>

<template>
  <section>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">考勤統計報表</h2>

    <!-- 工具欄 -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <ToolbarTextField prefix-icon="📅 開始:" type="select" />
      <ToolbarTextField prefix-icon="📅 結束:" type="select" />
      <ToolbarTextField prefix-icon="🏢 部門:" type="select" />
      <button
        class="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
      >
        導出 CSV
      </button>
    </div>

    <!-- 匯總卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-green-50 dark:bg-green-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">平均出勤率</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">96.2%</div>
      </div>
      <div class="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">平均遲到率</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">2.2%</div>
      </div>
      <div class="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">平均早退率</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">1.0%</div>
      </div>
      <div class="bg-red-50 dark:bg-red-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">平均缺勤率</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">0.5%</div>
      </div>
    </div>

    <!-- 趨勢圖 -->
    <div :class="[cardClasses, 'p-6 mb-6']">
      <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-4">考勤趨勢</h3>
      <ClientOnly>
        <VChart :option="trendOption" autoresize style="height: 320px; width: 100%" />
        <template #fallback>
          <div style="height: 320px; width: 100%" class="flex items-center justify-center text-slate-400">圖表載入中...</div>
        </template>
      </ClientOnly>
    </div>

    <!-- 月度明細 -->
    <div :class="[cardClasses, 'overflow-x-auto']">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-700">
            <th :class="thClass">月份</th>
            <th :class="thClass">出勤率</th>
            <th :class="thClass">遲到率</th>
            <th :class="thClass">早退率</th>
            <th :class="thClass">缺勤率</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in monthlyData"
            :key="row.month"
            class="border-b border-slate-100 dark:border-slate-800 last:border-0"
          >
            <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ row.month }}</td>
            <td class="py-3 px-4 text-green-600 dark:text-green-400 font-medium">{{ row.attendanceRate }}%</td>
            <td class="py-3 px-4 text-orange-600 dark:text-orange-400">{{ row.lateRate }}%</td>
            <td class="py-3 px-4 text-purple-600 dark:text-purple-400">{{ row.earlyLeaveRate }}%</td>
            <td class="py-3 px-4 text-red-600 dark:text-red-400">{{ row.absentRate }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>