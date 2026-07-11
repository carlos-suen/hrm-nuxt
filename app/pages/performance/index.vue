<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataCardItem } from '~/components/DataCard.vue'
import type { ChartData, EmployeePerformanceData } from '~/types'

const { getAll, add, generateData, deleteAll } = usePerformanceApi()

const dataItems: DataCardItem[] = [
  { id: 'evaluation-count', label: '本期評估人數', icon: '📉', value: '8', desc: '已完成 5' },
  { id: 'avg-score', label: '平均績效分', icon: '📝', value: '3.7', desc: '/ 5.0' },
  { id: 'sa-ratio', label: 'S/A 級佔比', icon: '🏆', value: '50%', desc: '4/8 人' },
  { id: 'pending-review', label: '待審核數', icon: '', value: '3', desc: '待處理' },
]

const gradeDistributionData: ChartData[] = [
  { name: 'S', value: 1, fill: '#a855f7' },
  { name: 'A', value: 3, fill: '#3b82f6' },
  { name: 'B', value: 3, fill: '#22c55e' },
  { name: 'C', value: 1, fill: '#f97316' },
  { name: 'D', value: 0, fill: '#ef4444' },
]

const deptPerformanceData: ChartData[] = [
  { name: 'Engineering', value: 4.2 },
  { name: 'HR', value: 4.1 },
  { name: 'Marketing', value: 3.3 },
  { name: 'Finance', value: 3.3 },
  { name: 'Sales', value: 3.0 },
]

const tableHeads = ['員工', '週期', '總分', '評級', '狀態', '監管人', '操作']

const mockTestData: Omit<EmployeePerformanceData, 'id'>[] = [
  { name: '王小明', duration: '2026 Q1', score: 4, level: 'A', status: 2, monitor: '陳總監' },
  { name: '李小華', duration: '2026 Q1', score: 5, level: 'S', status: 1, monitor: '張經理' },
  { name: '張大偉', duration: '2026 Q1', score: 2, level: 'C', status: 2, monitor: '王主管' },
  { name: '趙小芳', duration: '2026 Q1', score: 1, level: 'D', status: 0, monitor: '李總監' },
  { name: '孫志強', duration: '2026 Q1', score: 1, level: 'D', status: 1, monitor: '張經理' },
]

const isDialogOpen = ref(false)
const data = ref<EmployeePerformanceData[]>([])
const loading = ref(true)

const toolbarData = ref({ duration: '', department: '', level: '', status: '' })

const cardClasses = 'bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-slate-700'

async function fetchData() {
  try {
    data.value = await getAll()
  } catch (e) {
    console.error('Failed to fetch performance data:', e)
  } finally {
    loading.value = false
  }
}

async function handleDialogSubmit(formData: {
  name?: string
  duration?: string
  score?: number
  level?: string
  status?: number
  monitor?: string
}) {
  try {
    await add({
      name: formData.name || '未知員工',
      duration: formData.duration || '2026 Q1',
      score: formData.score || 0,
      level: formData.level || 'B',
      status: formData.status ?? 0,
      monitor: formData.monitor || '待分配',
    })
    await fetchData()
  } catch (e) {
    console.error('Failed to add performance:', e)
  }
  isDialogOpen.value = false
}

async function handleGenerateData() {
  try {
    await generateData(mockTestData)
    await fetchData()
  } catch (e) {
    console.error('Failed to generate test data:', e)
  }
}

async function handleDeleteAll() {
  try {
    await deleteAll()
    await fetchData()
  } catch (e) {
    console.error('Failed to delete all data:', e)
  }
}

onMounted(fetchData)
</script>

<template>
  <section>
    <!-- 卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <DataCard v-for="item in dataItems" :key="item.id" :data="item" />
    </div>

    <!-- 圖表區域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      <ChartCard :data="gradeDistributionData" type="bar" title="等級分佈" class-name="flex-1" />
      <ChartCard :data="deptPerformanceData" type="horizontal-bar" title="部門績效對比" class-name="flex-1" />
    </div>

    <!-- 工具欄 -->
    <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
      <div class="flex gap-4 flex-col md:flex-row">
        <ToolbarTextField v-model="toolbarData.duration" prefix-icon="📅 週期" type="select" />
        <ToolbarTextField v-model="toolbarData.department" prefix-icon="🏢 部門" type="select" />
        <ToolbarTextField v-model="toolbarData.level" prefix-icon="🌟 等級" type="select" />
        <ToolbarTextField v-model="toolbarData.status" prefix-icon=" 狀態" type="select" />
      </div>
      <div class="flex gap-3 flex-col md:flex-row">
        <CommonButton title="+ 新增評估" @pressed="isDialogOpen = true" />
        <CommonButton
          v-if="data.length === 0"
          title="生成測試數據"
          bg-color="purple"
          @pressed="handleGenerateData"
        />
        <CommonButton
          v-if="data.length > 0"
          title="刪除所有數據"
          bg-color="red"
          @pressed="handleDeleteAll"
        />
      </div>
    </div>

    <!-- 表格 -->
    <div :class="[cardClasses, 'overflow-x-auto']">
      <div v-if="loading" class="py-12 text-center text-slate-400">載入中...</div>
      <PerformanceTable v-else :heads="tableHeads" :data="data" />
    </div>

    <!-- 新增評估 Dialog -->
    <PerformanceDialog :is-open="isDialogOpen" @close="isDialogOpen = false" @submit="handleDialogSubmit" />
  </section>
</template>