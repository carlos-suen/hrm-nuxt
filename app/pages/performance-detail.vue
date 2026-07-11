<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import type { EChartsOption } from 'echarts'
import { useTheme } from '~/composables/useTheme'

// 延遲加載 vue-echarts：SSR 不會執行 import，避免 document is not defined
const VChart = defineAsyncComponent(() => import('vue-echarts'))

interface PerformanceRecord {
  id: number
  name: string
  duration: string
  score: number
  level: string
  status: number
  monitor: string
  scores?: Record<string, number>
  created_at: string
  updated_at: string
}

interface ApprovalStep {
  label: string
  status: 'completed' | 'current' | 'pending'
}

const router = useRouter()
const { isDark } = useTheme()

const { getById } = usePerformanceApi()

const record = ref<PerformanceRecord | null>(null)
const loading = ref(true)

const dimensionLabels = ['質量', '效率', '協作', '主動', '溝通']
const cardClass = 'bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700'

const statusLabels: Record<number, string> = {
  0: '自評中',
  1: '主管審核中',
  2: '已完成',
}

function getApprovalSteps(status: number): ApprovalStep[] {
  return [
    { label: '自評', status: 'completed' },
    { label: '主管審核', status: status >= 1 ? 'completed' : 'current' },
    { label: 'HR審核', status: status >= 2 ? 'completed' : status === 1 ? 'current' : 'pending' },
    { label: '完成', status: status >= 2 ? 'completed' : 'pending' },
  ]
}

const textColor = computed(() => (isDark.value ? '#94a3b8' : '#64748b'))

const radarOption = computed<EChartsOption>(() => {
  const scores = record.value?.scores || {}
  const indicator = dimensionLabels.map((dim) => ({ name: dim, max: 5 }))
  const current = dimensionLabels.map((dim) => scores[dim] || 0)
  const previous = dimensionLabels.map((dim) => (scores[dim] || 0) - 0.3)

  return {
    backgroundColor: 'transparent',
    textStyle: { color: textColor.value },
    tooltip: { trigger: 'item' },
    legend: {
      data: ['本期', '上期'],
      bottom: 0,
      textStyle: { color: textColor.value },
    },
    radar: {
      indicator,
      radius: '65%',
      axisName: { color: textColor.value, fontSize: 12 },
      splitLine: { lineStyle: { color: isDark.value ? '#334155' : '#e2e8f0' } },
      splitArea: { areaStyle: { color: ['transparent'] } },
      axisLine: { lineStyle: { color: isDark.value ? '#475569' : '#cbd5e1' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: current,
            name: '本期',
            itemStyle: { color: '#3b82f6' },
            areaStyle: { color: '#3b82f6', opacity: 0.2 },
            lineStyle: { color: '#3b82f6' },
          },
          {
            value: previous,
            name: '上期',
            itemStyle: { color: '#94a3b8' },
            areaStyle: { color: '#94a3b8', opacity: 0.1 },
            lineStyle: { color: '#94a3b8', type: 'dashed' },
          },
        ],
      },
    ],
  }
})

const scoreDetails = computed(() => {
  const scores = record.value?.scores || {}
  return dimensionLabels.map((dim) => {
    const current = scores[dim] || 0
    const previous = (scores[dim] || 0) - 0.3
    return {
      name: dim,
      score: current,
      previous,
      change: current - previous,
    }
  })
})

const approvalSteps = computed(() => (record.value ? getApprovalSteps(record.value.status) : []))

const levelBadgeClass = computed(() => {
  const level = record.value?.level
  if (!level) return ''
  const map: Record<string, string> = {
    S: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    A: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    B: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    C: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    D: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }
  return map[level] ?? ''
})

function defaultOnBack() {
  router.back()
}

onMounted(() => {
  const id = router.currentRoute.value.query.id as string | undefined
  if (!id) {
    loading.value = false
    return
  }
  getById(Number(id))
    .then((data) => {
      record.value = data
    })
    .catch((e) => {
      console.error('Failed to fetch performance detail:', e)
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<template>
  <div v-if="loading" class="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center">
    <div class="text-slate-400">載入中...</div>
  </div>

  <div v-else-if="!record" class="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center">
    <div class="text-slate-400">找不到該績效記錄</div>
  </div>

  <div v-else class="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6 overflow-y-auto">
    <div class="max-w-5xl mx-auto w-full space-y-4 pb-8">
      <!-- 頂部標題 -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">績效詳情 — {{ record.name }}</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {{ record.duration }} | 監管人: {{ record.monitor }}
          </p>
        </div>
      </div>

      <!-- 員工資訊卡片 -->
      <div :class="[cardClass, 'p-4 flex items-center justify-between']">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {{ record.name[0] }}
          </div>
          <div>
            <div class="font-semibold text-slate-900 dark:text-white">{{ record.name }}</div>
            <div class="text-sm text-slate-500 dark:text-slate-400">{{ record.monitor }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-slate-500 dark:text-slate-400">評估週期</div>
          <div class="font-semibold text-slate-900 dark:text-white">{{ record.duration }}</div>
        </div>
      </div>

      <!-- 雷達圖 + 評分明細 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- 雷達圖 -->
        <div :class="[cardClass, 'p-4']">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-4">五維能力雷達圖</h3>
          <ClientOnly>
            <VChart :option="radarOption" autoresize style="height: 300px; width: 100%" />
            <template #fallback>
              <div style="height: 300px; width: 100%" class="flex items-center justify-center text-slate-400">
                圖表載入中...
              </div>
            </template>
          </ClientOnly>
        </div>

        <!-- 評分明細 -->
        <div :class="[cardClass, 'p-4']">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-4">評分明細</h3>
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-zinc-700">
                <th class="pb-2 font-medium">維度</th>
                <th class="pb-2 font-medium">分數</th>
                <th class="pb-2 font-medium">進度</th>
                <th class="pb-2 font-medium">上期</th>
                <th class="pb-2 font-medium">變化</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in scoreDetails"
                :key="item.name"
                class="border-b border-slate-50 dark:border-zinc-700/50 last:border-0"
              >
                <td class="py-2 text-slate-700 dark:text-slate-300">{{ item.name }}</td>
                <td class="py-2 font-semibold text-slate-900 dark:text-white">{{ item.score }}</td>
                <td class="py-2">
                  <div class="w-24 h-2 bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full" :style="{ width: `${(item.score / 5) * 100}%` }" />
                  </div>
                </td>
                <td class="py-2 text-slate-500 dark:text-slate-400">{{ item.previous.toFixed(1) }}</td>
                <td class="py-2">
                  <span v-if="item.change > 0" class="text-green-600 dark:text-green-400 font-medium">
                    +{{ item.change.toFixed(1) }} ↑
                  </span>
                  <span v-else-if="item.change < 0" class="text-red-600 dark:text-red-400 font-medium">
                    {{ item.change.toFixed(1) }} ↓
                  </span>
                  <span v-else class="text-slate-400">0 —</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 總評分 + 加權公式 + 評審人評語 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div :class="[cardClass, 'p-4 flex items-center gap-4']">
          <div>
            <div class="text-sm text-slate-500 dark:text-slate-400">總評分</div>
            <div class="text-4xl font-bold text-blue-600 dark:text-blue-400">{{ record.score.toFixed(1) }}</div>
          </div>
          <span :class="['px-3 py-1 rounded text-lg font-bold', levelBadgeClass]">{{ record.level }}</span>
        </div>
        <div :class="[cardClass, 'p-4']">
          <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">加權公式</div>
          <div class="text-xs text-slate-600 dark:text-slate-400 font-mono">
            質量×0.25 + 效率×0.20 + 協作×0.20 + 主動×0.15 + 溝通×0.15
          </div>
        </div>
        <div :class="[cardClass, 'p-4']">
          <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">評審人評語</div>
          <div class="text-sm text-slate-700 dark:text-slate-300">
            技術能力突出，團隊協作良好，建議加強溝通表達。
          </div>
        </div>
      </div>

      <!-- 審批流程 -->
      <div :class="[cardClass, 'p-4']">
        <h3 class="font-semibold text-slate-900 dark:text-white mb-4">審批流程</h3>
        <div class="flex items-center justify-between">
          <div v-for="(step, index) in approvalSteps" :key="step.label" class="flex items-center flex-1">
            <!-- completed -->
            <div
              v-if="step.status === 'completed'"
              class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
            >
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <!-- current -->
            <div
              v-else-if="step.status === 'current'"
              class="w-8 h-8 rounded-full bg-blue-500 animate-pulse flex items-center justify-center flex-shrink-0"
            >
              <div class="w-3 h-3 bg-white rounded-full" />
            </div>
            <!-- pending -->
            <div
              v-else
              class="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0"
            >
              <div class="w-3 h-3 bg-slate-400 dark:bg-zinc-500 rounded-full" />
            </div>
            <div class="ml-2 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{{ step.label }}</div>
            <div
              v-if="index < approvalSteps.length - 1"
              :class="[
                'flex-1 h-0.5 mx-2',
                step.status === 'completed' ? 'bg-green-500' : 'bg-slate-200 dark:bg-zinc-700',
              ]"
            />
          </div>
        </div>
      </div>

      <!-- 操作欄 -->
      <div :class="[cardClass, 'p-4 flex items-center justify-between']">
        <div class="text-sm text-slate-500 dark:text-slate-400">
          操作（當前狀態：{{ statusLabels[record.status] ?? '未知' }} · 只讀）
        </div>
        <div class="flex gap-3">
          <button
            class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
            @click="defaultOnBack"
          >
            返回列表
          </button>
          <button class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            打印
          </button>
        </div>
      </div>
    </div>
  </div>
</template>