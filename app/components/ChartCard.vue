<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { EChartsOption } from 'echarts'
import type { ChartData } from '~/types'

// 延遲加載 vue-echarts：SSR 不會執行 import，避免 document is not defined
const VChart = defineAsyncComponent(() => import('vue-echarts'))

type ChartType = 'pie' | 'bar' | 'line' | 'area' | 'horizontal-bar'

const props = withDefaults(
  defineProps<{
    data: ChartData[]
    type?: ChartType
    className?: string
    title?: string
    valueFormatter?: (value: number) => string
  }>(),
  {
    type: 'bar',
    className: '',
    title: '',
  },
)

const { isDark } = useTheme()

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7']

const textColor = computed(() => (isDark.value ? '#94a3b8' : '#64748b'))
const splitColor = computed(() => (isDark.value ? '#334155' : '#e2e8f0'))
const axisColor = computed(() => (isDark.value ? '#475569' : '#cbd5e1'))

const cardClasses =
  'bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700'

const option = computed<EChartsOption>(() => {
  const base: EChartsOption = {
    backgroundColor: 'transparent',
    textStyle: { color: textColor.value },
    tooltip: { trigger: 'item' },
  }

  switch (props.type) {
    case 'pie':
      return {
        ...base,
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { bottom: 0, textStyle: { color: textColor.value } },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: true,
            label: { formatter: '{b} {d}%', color: textColor.value },
            data: props.data.map((d, i) => ({
              name: d.name,
              value: d.value ?? 0,
              itemStyle: { color: d.fill || COLORS[i % COLORS.length] },
            })),
          },
        ],
      }

    case 'bar':
      return {
        ...base,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          ...(props.valueFormatter
            ? { valueFormatter: (val) => props.valueFormatter!(Number(val)) }
            : {}),
        },
        grid: { left: 10, right: 20, top: 30, bottom: 10, containLabel: true },
        xAxis: {
          type: 'category',
          data: props.data.map((d) => d.name),
          axisLabel: { color: textColor.value, fontSize: 12 },
          axisLine: { lineStyle: { color: axisColor.value } },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: textColor.value,
            fontSize: 12,
            ...(props.valueFormatter
              ? { formatter: (val) => props.valueFormatter!(Number(val)) }
              : {}),
          },
          splitLine: { lineStyle: { color: splitColor.value } },
        },
        series: [
          {
            type: 'bar',
            name: '工資',
            barWidth: '60%',
            itemStyle: { borderRadius: [4, 4, 0, 0] },
            label: {
              show: true,
              position: 'top',
              fontSize: 12,
              color: '#64748b',
              ...(props.valueFormatter
                ? { formatter: (params: any) => props.valueFormatter!(Number(params.value)) }
                : {}),
            },
            data: props.data.map((d, i) => ({
              value: d.value ?? 0,
              itemStyle: { color: d.fill || COLORS[i % COLORS.length] },
            })),
          },
        ],
      }

    case 'horizontal-bar':
      return {
        ...base,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: 10, right: 40, top: 20, bottom: 10, containLabel: true },
        xAxis: {
          type: 'value',
          show: false,
        },
        yAxis: {
          type: 'category',
          data: props.data.map((d) => d.name),
          axisLabel: { color: textColor.value, fontSize: 14 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        series: [
          {
            type: 'bar',
            name: '績效分',
            barWidth: 20,
            itemStyle: { borderRadius: [0, 4, 4, 0] },
            label: { show: true, position: 'right', fontSize: 12, color: '#64748b' },
            data: props.data.map((d, i) => ({
              value: d.value ?? 0,
              itemStyle: {
                color: d.fill || `rgba(59, 130, 246, ${1 - i * 0.15})`,
              },
            })),
          },
        ],
      }

    case 'line':
      return {
        ...base,
        tooltip: { trigger: 'axis' },
        legend: { textStyle: { color: textColor.value } },
        grid: { left: 10, right: 20, top: 30, bottom: 10, containLabel: true },
        xAxis: {
          type: 'category',
          data: props.data.map((d) => d.name),
          axisLabel: { color: textColor.value },
          axisLine: { lineStyle: { color: axisColor.value } },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: textColor.value },
          splitLine: { lineStyle: { color: splitColor.value } },
        },
        series: [
          {
            type: 'line',
            name: '數值',
            smooth: true,
            data: props.data.map((d) => d.value ?? 0),
            itemStyle: { color: '#3b82f6' },
            lineStyle: { color: '#3b82f6' },
          },
        ],
      }

    case 'area':
      return {
        ...base,
        tooltip: { trigger: 'axis' },
        legend: { textStyle: { color: textColor.value } },
        grid: { left: 10, right: 20, top: 30, bottom: 10, containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: props.data.map((d) => d.name),
          axisLabel: { color: textColor.value, fontSize: 12 },
          axisLine: { lineStyle: { color: axisColor.value } },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: textColor.value, fontSize: 12 },
          splitLine: { lineStyle: { color: splitColor.value } },
        },
        series: [
          {
            type: 'line',
            name: '出勤',
            smooth: true,
            data: props.data.map((d) => d.attendance ?? 0),
            itemStyle: { color: '#3b82f6' },
            lineStyle: { color: '#3b82f6' },
            areaStyle: { color: '#3b82f6', opacity: 0.1 },
          },
          {
            type: 'line',
            name: '遲到',
            smooth: true,
            data: props.data.map((d) => d.late ?? 0),
            itemStyle: { color: '#f59e0b' },
            lineStyle: { color: '#f59e0b' },
            areaStyle: { color: '#f59e0b', opacity: 0.1 },
          },
        ],
      }

    default:
      return base
  }
})
</script>

<template>
  <div :class="[cardClasses, props.className]">
    <h3 v-if="props.title" class="text-lg font-medium text-slate-900 dark:text-white mb-4">
      {{ props.title }}
    </h3>
    <ClientOnly>
      <VChart :option="option" autoresize style="height: 300px; width: 100%" />
      <template #fallback>
        <div style="height: 300px; width: 100%" class="flex items-center justify-center text-slate-400">
          圖表載入中...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>