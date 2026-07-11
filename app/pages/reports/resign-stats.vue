<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { EChartsOption } from 'echarts'
import { useTheme } from '~/composables/useTheme'

// 延遲加載 vue-echarts：SSR 不會執行 import，避免 document is not defined
const VChart = defineAsyncComponent(() => import('vue-echarts'))

interface MonthlyTurnover {
  month: string
  headcount: number
  resigned: number
  rate: number
}

const monthlyData: MonthlyTurnover[] = [
  { month: '2026-01', headcount: 48, resigned: 1, rate: 2.1 },
  { month: '2026-02', headcount: 50, resigned: 2, rate: 4.0 },
  { month: '2026-03', headcount: 52, resigned: 1, rate: 1.9 },
  { month: '2026-04', headcount: 53, resigned: 1, rate: 1.9 },
  { month: '2026-05', headcount: 55, resigned: 2, rate: 3.6 },
]

const reasonData = [
  { name: '薪資待遇', value: 3, fill: '#ef4444' },
  { name: '職業發展', value: 2, fill: '#f97316' },
  { name: '工作壓力', value: 1, fill: '#a855f7' },
  { name: '家庭因素', value: 1, fill: '#3b82f6' },
  { name: '其他', value: 0, fill: '#94a3b8' },
]

const { isDark } = useTheme()
const textColor = computed(() => (isDark.value ? '#94a3b8' : '#64748b'))
const splitColor = computed(() => (isDark.value ? '#334155' : '#e2e8f0'))

const trendOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  textStyle: { color: textColor.value },
  tooltip: { trigger: 'axis' },
  legend: { data: ['離職人數', '離職率(%)'], textStyle: { color: textColor.value } },
  grid: { left: 10, right: 40, top: 30, bottom: 10, containLabel: true },
  xAxis: {
    type: 'category',
    data: monthlyData.map((d) => d.month),
    axisLabel: { color: textColor.value, fontSize: 12 },
    axisLine: { lineStyle: { color: splitColor.value } },
  },
  yAxis: [
    {
      type: 'value',
      name: '人數',
      axisLabel: { color: textColor.value, fontSize: 12 },
      splitLine: { lineStyle: { color: splitColor.value, type: 'dashed' } },
    },
    {
      type: 'value',
      name: '離職率(%)',
      axisLabel: { color: textColor.value, fontSize: 12, formatter: '{value}%' },
    },
  ],
  series: [
    {
      name: '離職人數',
      type: 'bar',
      barWidth: 28,
      itemStyle: { color: '#ef4444', borderRadius: [6, 6, 0, 0] },
      data: monthlyData.map((d) => d.resigned),
    },
    {
      name: '離職率(%)',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      data: monthlyData.map((d) => d.rate),
      itemStyle: { color: '#f97316' },
      lineStyle: { color: '#f97316' },
    },
  ],
}))

const reasonOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  textStyle: { color: textColor.value },
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: textColor.value } },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: { color: textColor.value },
      data: reasonData.map((r) => ({ name: r.name, value: r.value, itemStyle: { color: r.fill } })),
    },
  ],
}))

const avgRate = computed(() => {
  const sum = monthlyData.reduce((a, b) => a + b.rate, 0)
  return (sum / monthlyData.length).toFixed(2)
})

const totalResigned = computed(() => monthlyData.reduce((a, b) => a + b.resigned, 0))

const thClass = 'text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400'
const cardClasses = 'bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-slate-700'
</script>

<template>
  <section>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">離職率分析報表</h2>

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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-red-50 dark:bg-red-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">累計離職人數</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ totalResigned }}</div>
      </div>
      <div class="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">平均離職率</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ avgRate }}%</div>
      </div>
      <div class="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">當前在職人數</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">55</div>
      </div>
    </div>

    <!-- 圖表區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div :class="[cardClasses, 'p-6']">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-4">離職趨勢</h3>
        <ClientOnly>
          <VChart :option="trendOption" autoresize style="height: 300px; width: 100%" />
          <template #fallback>
            <div style="height: 300px; width: 100%" class="flex items-center justify-center text-slate-400">圖表載入中...</div>
          </template>
        </ClientOnly>
      </div>
      <div :class="[cardClasses, 'p-6']">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-4">離職原因分佈</h3>
        <ClientOnly>
          <VChart :option="reasonOption" autoresize style="height: 300px; width: 100%" />
          <template #fallback>
            <div style="height: 300px; width: 100%" class="flex items-center justify-center text-slate-400">圖表載入中...</div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- 月度明細 -->
    <div :class="[cardClasses, 'overflow-x-auto']">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-700">
            <th :class="thClass">月份</th>
            <th :class="thClass">在職人數</th>
            <th :class="thClass">離職人數</th>
            <th :class="thClass">離職率</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in monthlyData"
            :key="row.month"
            class="border-b border-slate-100 dark:border-slate-800 last:border-0"
          >
            <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ row.month }}</td>
            <td class="py-3 px-4 text-slate-900 dark:text-white font-medium">{{ row.headcount }}</td>
            <td class="py-3 px-4 text-red-600 dark:text-red-400">{{ row.resigned }}</td>
            <td class="py-3 px-4 text-orange-600 dark:text-orange-400 font-medium">{{ row.rate }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>