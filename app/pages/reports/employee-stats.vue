<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { EChartsOption } from 'echarts'
import type { ChartData } from '~/types'
import { useTheme } from '~/composables/useTheme'

// 延遲加載 vue-echarts：SSR 不會執行 import，避免 document is not defined
const VChart = defineAsyncComponent(() => import('vue-echarts'))

interface MonthlyDetail {
  month: string
  total: number
  newHire: number
  resigned: number
  netGrowth: number
  attendanceRate: string
  trend: 'up' | 'down' | 'flat'
}

const headcountTrendData: ChartData[] = [
  { name: '1月', total: 42, newHire: 40 },
  { name: '2月', total: 43, newHire: 41 },
  { name: '3月', total: 45, newHire: 42 },
  { name: '4月', total: 47, newHire: 42 },
  { name: '5月', total: 48, newHire: 43 },
  { name: '6月', total: 50, newHire: 44 },
]

const deptDistributionData: ChartData[] = [
  { name: 'Engineering', value: 35, fill: '#3b82f6' },
  { name: 'Marketing', value: 20, fill: '#22c55e' },
  { name: 'Sales', value: 15, fill: '#f97316' },
  { name: 'HR', value: 15, fill: '#a855f7' },
  { name: 'Finance', value: 15, fill: '#ec4899' },
]

const monthlyDetails: MonthlyDetail[] = [
  { month: '2026-01', total: 48, newHire: 3, resigned: 1, netGrowth: 2, attendanceRate: '96.2%', trend: 'up' },
  { month: '2026-02', total: 50, newHire: 4, resigned: 2, netGrowth: 2, attendanceRate: '95.8%', trend: 'up' },
  { month: '2026-03', total: 52, newHire: 3, resigned: 1, netGrowth: 2, attendanceRate: '97.1%', trend: 'up' },
  { month: '2026-04', total: 53, newHire: 2, resigned: 1, netGrowth: 1, attendanceRate: '96.5%', trend: 'flat' },
  { month: '2026-05', total: 55, newHire: 4, resigned: 2, netGrowth: 2, attendanceRate: '95.3%', trend: 'up' },
]

const trendIconMap: Record<MonthlyDetail['trend'], string> = { up: '↑', down: '↓', flat: '→' }
const trendColorMap: Record<MonthlyDetail['trend'], string> = {
  up: 'text-green-600 dark:text-green-400',
  down: 'text-red-600 dark:text-red-400',
  flat: 'text-slate-400',
}

const { isDark } = useTheme()
const textColor = computed(() => (isDark.value ? '#94a3b8' : '#64748b'))
const splitColor = computed(() => (isDark.value ? '#334155' : '#e2e8f0'))

const trendOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  textStyle: { color: textColor.value },
  tooltip: { trigger: 'axis' },
  legend: { data: ['總人數', '新入職'], textStyle: { color: textColor.value } },
  grid: { left: 10, right: 20, top: 30, bottom: 10, containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: headcountTrendData.map((d) => d.name),
    axisLabel: { color: textColor.value, fontSize: 12 },
    axisLine: { lineStyle: { color: splitColor.value } },
  },
  yAxis: {
    type: 'value',
    min: 40,
    max: 55,
    axisLabel: { color: textColor.value, fontSize: 12 },
    splitLine: { lineStyle: { color: splitColor.value, type: 'dashed' } },
  },
  series: [
    {
      name: '總人數',
      type: 'line',
      smooth: true,
      data: headcountTrendData.map((d) => d.total),
      itemStyle: { color: '#3b82f6' },
      lineStyle: { color: '#3b82f6' },
      areaStyle: { color: '#3b82f6', opacity: 0.1 },
    },
    {
      name: '新入職',
      type: 'line',
      smooth: true,
      data: headcountTrendData.map((d) => d.newHire),
      itemStyle: { color: '#22c55e' },
      lineStyle: { color: '#22c55e' },
      areaStyle: { color: '#22c55e', opacity: 0.1 },
    },
  ],
}))

const thClass = 'text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400'
const cardClasses = 'bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-slate-700'
</script>

<template>
  <section class="align-middle">
    <!-- 標題 -->
    <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">人數統計報表</h2>

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

    <!-- 圖表區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 人數趨勢 -->
      <div :class="[cardClasses, 'p-6']">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">人數趨勢</h3>
          <div class="flex items-center gap-4 text-xs">
            <span class="flex items-center gap-1">
              <span class="w-3 h-0.5 bg-blue-500 rounded" />
              總人數
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-0.5 bg-green-500 rounded" />
              新入職
            </span>
          </div>
        </div>
        <ClientOnly>
          <VChart :option="trendOption" autoresize style="height: 250px; width: 100%" />
          <template #fallback>
            <div style="height: 250px; width: 100%" class="flex items-center justify-center text-slate-400">圖表載入中...</div>
          </template>
        </ClientOnly>
      </div>

      <!-- 部門分佈 -->
      <ChartCard :data="deptDistributionData" type="pie" title="部門分佈" />
    </div>

    <!-- 月度明細 -->
    <div :class="[cardClasses, 'overflow-x-auto']">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-700">
            <th :class="thClass">月份</th>
            <th :class="thClass">總人數</th>
            <th :class="thClass">新入職</th>
            <th :class="thClass">離職</th>
            <th :class="thClass">淨增長</th>
            <th :class="thClass">出勤率</th>
            <th :class="thClass">趨勢</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in monthlyDetails"
            :key="row.month"
            class="border-b border-slate-100 dark:border-slate-800 last:border-0"
          >
            <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ row.month }}</td>
            <td class="py-3 px-4 text-slate-900 dark:text-white font-medium">{{ row.total }}</td>
            <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ row.newHire }}</td>
            <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ row.resigned }}</td>
            <td class="py-3 px-4 text-green-600 dark:text-green-400 font-medium">+{{ row.netGrowth }}</td>
            <td class="py-3 px-4 text-slate-900 dark:text-white">{{ row.attendanceRate }}</td>
            <td :class="['py-3 px-4 font-medium', trendColorMap[row.trend]]">{{ trendIconMap[row.trend] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>