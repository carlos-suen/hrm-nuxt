<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { EChartsOption } from 'echarts'
import type { ChartData } from '~/types'
import { useTheme } from '~/composables/useTheme'

// 延遲加載 vue-echarts：SSR 不會執行 import，避免 document is not defined
const VChart = defineAsyncComponent(() => import('vue-echarts'))

const gradeDistributionData: ChartData[] = [
  { name: 'S', value: 1, fill: '#a855f7' },
  { name: 'A', value: 3, fill: '#3b82f6' },
  { name: 'B', value: 3, fill: '#22c55e' },
  { name: 'C', value: 1, fill: '#f97316' },
  { name: 'D', value: 0, fill: '#ef4444' },
]

interface DeptPerformance {
  name: string
  avgScore: number
  topCount: number
}

const deptData: DeptPerformance[] = [
  { name: 'Engineering', avgScore: 4.2, topCount: 3 },
  { name: 'HR', avgScore: 4.1, topCount: 1 },
  { name: 'Marketing', avgScore: 3.3, topCount: 0 },
  { name: 'Finance', avgScore: 3.3, topCount: 0 },
  { name: 'Sales', avgScore: 3.0, topCount: 0 },
]

const { isDark } = useTheme()
const textColor = computed(() => (isDark.value ? '#94a3b8' : '#64748b'))
const splitColor = computed(() => (isDark.value ? '#334155' : '#e2e8f0'))

const deptOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  textStyle: { color: textColor.value },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 10, right: 20, top: 30, bottom: 10, containLabel: true },
  xAxis: {
    type: 'category',
    data: deptData.map((d) => d.name),
    axisLabel: { color: textColor.value, fontSize: 12 },
    axisLine: { lineStyle: { color: splitColor.value } },
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 5,
    axisLabel: { color: textColor.value, fontSize: 12 },
    splitLine: { lineStyle: { color: splitColor.value, type: 'dashed' } },
  },
  series: [
    {
      name: '平均績效分',
      type: 'bar',
      barWidth: 32,
      itemStyle: { color: '#3b82f6', borderRadius: [6, 6, 0, 0] },
      data: deptData.map((d) => d.avgScore),
    },
  ],
}))

const thClass = 'text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400'
const cardClasses = 'bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-slate-700'
</script>

<template>
  <section>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">績效分析報表</h2>

    <!-- 工具欄 -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <ToolbarTextField prefix-icon="📅 週期:" type="select" />
      <ToolbarTextField prefix-icon="🏢 部門:" type="select" />
      <button
        class="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
      >
        導出 CSV
      </button>
    </div>

    <!-- 匯總卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">平均績效分</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">3.7 / 5.0</div>
      </div>
      <div class="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">S/A 級佔比</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">50%</div>
      </div>
      <div class="bg-green-50 dark:bg-green-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">本期評估人數</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">8</div>
      </div>
    </div>

    <!-- 圖表區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <ChartCard :data="gradeDistributionData" type="bar" title="等級分佈" class-name="flex-1" />
      <div :class="[cardClasses, 'p-6']">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-4">部門績效對比</h3>
        <ClientOnly>
          <VChart :option="deptOption" autoresize style="height: 300px; width: 100%" />
          <template #fallback>
            <div style="height: 300px; width: 100%" class="flex items-center justify-center text-slate-400">圖表載入中...</div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- 部門明細 -->
    <div :class="[cardClasses, 'overflow-x-auto']">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-700">
            <th :class="thClass">部門</th>
            <th :class="thClass">平均績效分</th>
            <th :class="thClass">S/A 級人數</th>
            <th :class="thClass">評級</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in deptData"
            :key="row.name"
            class="border-b border-slate-100 dark:border-slate-800 last:border-0"
          >
            <td class="py-3 px-4 text-slate-900 dark:text-white font-medium">{{ row.name }}</td>
            <td class="py-3 px-4 text-blue-600 dark:text-blue-400 font-medium">{{ row.avgScore.toFixed(1) }}</td>
            <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ row.topCount }}</td>
            <td class="py-3 px-4">
              <span
                :class="[
                  'inline-block px-2 py-1 rounded text-xs font-medium',
                  row.avgScore >= 4
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : row.avgScore >= 3
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
                ]"
              >
                {{ row.avgScore >= 4 ? '優秀' : row.avgScore >= 3 ? '良好' : '待改進' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>