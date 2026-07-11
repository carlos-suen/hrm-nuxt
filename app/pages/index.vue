<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { DataCardItem } from '~/components/DataCard.vue'
import type { ChartData } from '~/types'

const { getDepartmentStats, getSalaryStats } = useDashboardApi()

const dataItems: DataCardItem[] = [
  { id: 'total-employees', label: '總員工數', icon: '👥', value: '42', desc: '較上月 +3' },
  { id: 'employment-rate', label: '在職率', icon: '✅', value: '85.7%', desc: '較上月 +2%' },
  { id: 'salary-expense', label: '薪資支出', icon: '💰', value: '¥528,000', desc: '較上月 +8%' },
  { id: 'pending-approvals', label: '待審批', icon: '⏰', value: '4', desc: '待處理' },
]

const formatCurrency = (value: number) => `¥${value.toLocaleString('zh-CN')}`

const pieChartData = ref<ChartData[]>([])
const barChartData = ref<ChartData[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

let cancelled = false

onMounted(() => {
  const load = async () => {
    loading.value = true
    error.value = null
    try {
      const [deptStats, salaryStats] = await Promise.all([
        getDepartmentStats(),
        getSalaryStats(),
      ])
      if (cancelled) return
      pieChartData.value = deptStats
      barChartData.value = salaryStats
    } catch (err) {
      if (cancelled) return
      error.value = err instanceof Error ? err.message : '數據載入失敗'
    } finally {
      if (!cancelled) loading.value = false
    }
  }

  load()
})

onUnmounted(() => {
  cancelled = true
})
</script>

<template>
  <section>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DataCard v-for="item in dataItems" :key="item.id" :data="item" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div
        v-if="loading"
        class="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center h-[388px] text-slate-400 animate-pulse"
      >
        載入中...
      </div>
      <div
        v-else-if="error"
        class="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center h-[388px] text-red-500"
      >
        {{ error }}
      </div>
      <template v-else>
        <ChartCard type="pie" :data="pieChartData" title="部門人數分佈" />
        <ChartCard :data="barChartData" title="部門平均薪資" :value-formatter="formatCurrency" />
      </template>
    </div>
  </section>
</template>