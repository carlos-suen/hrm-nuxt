<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { EChartsOption } from 'echarts'
import { useTheme } from '~/composables/useTheme'

// 延遲加載 vue-echarts：SSR 不會執行 import，避免 document is not defined
const VChart = defineAsyncComponent(() => import('vue-echarts'))

interface DeptSalaryData {
  name: string
  average: number
  median: number
}

const deptSalaryData: DeptSalaryData[] = [
  { name: 'Engineering', average: 22000, median: 20500 },
  { name: 'Marketing', average: 17500, median: 16000 },
  { name: 'Sales', average: 18500, median: 17000 },
  { name: 'HR', average: 16000, median: 15000 },
  { name: 'Finance', average: 15000, median: 14500 },
]

interface SalaryRangeData {
  name: string
  value: number
}

const salaryRangeData: SalaryRangeData[] = [
  { name: '<10K', value: 2 },
  { name: '10-15K', value: 10 },
  { name: '15-20K', value: 20 },
  { name: '20-25K', value: 10 },
  { name: '25-30K', value: 4 },
]

const rangeColors = ['#dbeafe', '#bfdbfe', '#93c5fd', '#bfdbfe', '#dbeafe']

const { isDark } = useTheme()
const textColor = computed(() => (isDark.value ? '#94a3b8' : '#64748b'))
const splitColor = computed(() => (isDark.value ? '#334155' : '#e2e8f0'))

const deptOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  textStyle: { color: textColor.value },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: (params: unknown) => {
      const arr = params as Array<{ name: string; seriesName: string; value: number }>
      return `${arr[0]?.name ?? ''}<br/>${arr
        .map((p) => `${p.seriesName}: ¥${Number(p.value).toLocaleString()}`)
        .join('<br/>')}`
    },
  },
  legend: { data: ['平均', '中位數'], textStyle: { color: textColor.value } },
  grid: { left: 10, right: 60, top: 30, bottom: 10, containLabel: true },
  xAxis: { type: 'value', show: false },
  yAxis: {
    type: 'category',
    data: deptSalaryData.map((d) => d.name),
    axisLabel: { color: textColor.value, fontSize: 13 },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  series: [
    {
      name: '平均',
      type: 'bar',
      barWidth: 12,
      itemStyle: { color: '#3b82f6', borderRadius: [0, 4, 4, 0] },
      data: deptSalaryData.map((d) => d.average),
    },
    {
      name: '中位數',
      type: 'bar',
      barWidth: 12,
      itemStyle: { color: '#22c55e', borderRadius: [0, 4, 4, 0] },
      data: deptSalaryData.map((d) => d.median),
    },
  ],
}))

const rangeOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  textStyle: { color: textColor.value },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 10, right: 20, top: 30, bottom: 10, containLabel: true },
  xAxis: {
    type: 'category',
    data: salaryRangeData.map((d) => d.name),
    axisLabel: { color: textColor.value, fontSize: 12 },
    axisLine: { lineStyle: { color: splitColor.value } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: textColor.value, fontSize: 12 },
    splitLine: { lineStyle: { color: splitColor.value, type: 'dashed' } },
  },
  series: [
    {
      name: '人數',
      type: 'bar',
      barWidth: 48,
      itemStyle: { borderRadius: [6, 6, 0, 0] },
      data: salaryRangeData.map((d, i) => ({
        value: d.value,
        itemStyle: { color: rangeColors[i % rangeColors.length] },
      })),
    },
  ],
}))

const cardClasses = 'bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-slate-700'
</script>

<template>
  <section>
    <!-- 標題 -->
    <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">薪資分析報表</h2>

    <!-- 工具欄 -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <ToolbarTextField prefix-icon="📅 開始:" type="select" />
      <ToolbarTextField prefix-icon="📅 結束:" type="select" />
      <ToolbarTextField prefix-icon=" 部門:" type="select" />
      <button
        class="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
      >
        導出 CSV
      </button>
    </div>

    <!-- 匯總卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">全公司平均薪資</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">¥18,500</div>
      </div>
      <div class="bg-green-50 dark:bg-green-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">全公司中位數</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">¥17,200</div>
      </div>
      <div class="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-5">
        <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">薪資總成本</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">
          ¥888,000<span class="text-sm font-normal text-slate-400 ml-1">/月</span>
        </div>
      </div>
    </div>

    <!-- 圖表區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 部門薪資對比 -->
      <div :class="[cardClasses, 'p-6']">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">部門薪資對比</h3>
          <div class="flex items-center gap-4 text-xs">
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 bg-blue-500 rounded-sm" />
              平均
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 bg-green-500 rounded-sm" />
              中位數
            </span>
          </div>
        </div>
        <ClientOnly>
          <VChart :option="deptOption" autoresize style="height: 300px; width: 100%" />
          <template #fallback>
            <div style="height: 300px; width: 100%" class="flex items-center justify-center text-slate-400">圖表載入中...</div>
          </template>
        </ClientOnly>
      </div>

      <!-- 薪資分佈 -->
      <div :class="[cardClasses, 'p-6']">
        <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-4">薪資分佈</h3>
        <ClientOnly>
          <VChart :option="rangeOption" autoresize style="height: 300px; width: 100%" />
          <template #fallback>
            <div style="height: 300px; width: 100%" class="flex items-center justify-center text-slate-400">圖表載入中...</div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>