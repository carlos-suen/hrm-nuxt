<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataCardItem } from '~/components/DataCard.vue'
import type { ChartData, PayRecord, PayStatus } from '~/types'
import { cardClasses } from '~/constants/themeClasses'
import { departmentOptions, statusOptions } from '~/constants/directoryOptions'

const { getAll, updateStatus, generateRecords } = usePayrollApi()

const payRollData: DataCardItem[] = [
  { id: 'total-payroll', label: '本月薪資總覽', icon: '💰', value: '¥528,000' },
  { id: 'avg-salary', label: '平均薪資', icon: '📊', value: '¥12,571' },
  { id: 'max-salary', label: '最高薪資', icon: '⬆️', value: '¥28,000' },
  { id: 'pending-payroll', label: '待確認薪資', icon: '📄', value: '4' },
]

const deptAvgSalaryData: ChartData[] = [
  { name: 'Eng', value: 28 },
  { name: 'HR', value: 20.5 },
  { name: 'Mkt', value: 18.5 },
  { name: 'Sales', value: 18 },
  { name: 'Fin', value: 22 },
]

const salaryCompositionData: ChartData[] = [
  { name: '基本工資', value: 65 },
  { name: '獎金', value: 12 },
  { name: '扣款', value: 8 },
  { name: '五險一金', value: 10 },
  { name: '個稅', value: 5 },
]

const testPayrollData = [
  { name: '張偉', bsalary: 28000, bonus: 3200, deduction: 560, asalary: 26068, status: 'Draft' },
  { name: '李娜', bsalary: 25000, bonus: 2500, deduction: 0, asalary: 23935, status: 'Draft' },
  { name: '王強', bsalary: 22000, bonus: 1800, deduction: 440, asalary: 20892, status: 'Draft' },
  { name: '趙敏', bsalary: 20000, bonus: 2000, deduction: 400, asalary: 18960, status: 'Draft' },
  { name: '陳思', bsalary: 18000, bonus: 1500, deduction: 360, asalary: 17028, status: 'Draft' },
]

function formatPayRecord(item: {
  id: number; name: string; bsalary: number; bonus: number; deduction: number; asalary: number; status: string
}): PayRecord {
  return {
    id: item.id,
    name: item.name,
    email: '',
    avatar: item.name.charAt(0),
    department: '',
    baseSalary: `¥${item.bsalary.toLocaleString()}`,
    bonus: `+¥${item.bonus.toLocaleString()}`,
    deduction: `-¥${item.deduction.toLocaleString()}`,
    netPay: `¥${item.asalary.toLocaleString()}`,
    status: item.status as PayStatus,
  }
}

const records = ref<PayRecord[]>([])
const selectedIds = ref<number[]>([])
const selectedDetail = ref<PayRecord | null>(null)

async function fetchRecords() {
  try {
    const data = await getAll()
    records.value = data.map(formatPayRecord)
  } catch (err) {
    console.error('獲取薪資記錄失敗:', err)
  }
}

async function generatePayroll() {
  try {
    const data = await generateRecords(testPayrollData)
    records.value = data.map(formatPayRecord)
  } catch (err) {
    console.error('生成測試數據失敗:', err)
  }
}

async function handleConfirm(id: number) {
  try {
    const data = await updateStatus(id, { status: 'Confirmed' })
    const formatted = formatPayRecord(data)
    records.value = records.value.map((r) => (r.id === id ? formatted : r))
    if (selectedDetail.value?.id === id) selectedDetail.value = formatted
  } catch (err) {
    console.error('確認失敗:', err)
  }
}

async function handlePay(id: number) {
  try {
    const data = await updateStatus(id, { status: 'Paid' })
    const formatted = formatPayRecord(data)
    records.value = records.value.map((r) => (r.id === id ? formatted : r))
    if (selectedDetail.value?.id === id) selectedDetail.value = formatted
  } catch (err) {
    console.error('發放失敗:', err)
  }
}

function handleCancelSelect() {
  selectedIds.value = []
  selectedDetail.value = null
}

function handleToggleSelect(id: number) {
  const next = selectedIds.value.includes(id)
    ? selectedIds.value.filter((i) => i !== id)
    : [...selectedIds.value, id]
  selectedIds.value = next
  if (next.length === 1) {
    const record = records.value.find((r) => r.id === next[0])
    if (record) selectedDetail.value = record
  } else {
    selectedDetail.value = null
  }
}

function handleToggleSelectAll() {
  const next = selectedIds.value.length === records.value.length ? [] : records.value.map((r) => r.id)
  selectedIds.value = next
  if (next.length === 1) {
    const record = records.value.find((r) => r.id === next[0])
    if (record) selectedDetail.value = record
  } else {
    selectedDetail.value = null
  }
}

onMounted(fetchRecords)
</script>

<template>
  <section>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
      <DataCard v-for="item in payRollData" :key="item.id" :data="item" />
    </div>

    <div class="flex w-full gap-4 my-6 md:flex-row flex-col">
      <ChartCard :data="deptAvgSalaryData" type="bar" title="部門平均薪資對比" class-name="flex-1" />
      <ChartCard :data="salaryCompositionData" type="pie" title="薪資構成佔比" class-name="flex-1" />
    </div>

    <div :class="[cardClasses, 'flex gap-4 flex-col md:flex-row']">
      <ToolbarTextField type="input" hint-text="選擇日期..." prefix-icon="📅" />
      <ToolbarTextField type="select" prefix-icon="部門" :options="departmentOptions" />
      <ToolbarTextField type="select" prefix-icon="狀態" :options="statusOptions" />
      <div class="flex-1" />
      <CommonButton v-if="records.length === 0" title="生成測試數據" bg-color="purple" @pressed="generatePayroll" />
      <CommonButton title="生成薪資單" bg-color="blue" @pressed="generatePayroll" />
    </div>

    <div v-if="selectedIds.length > 0" :class="[cardClasses, 'flex items-center mt-6 gap-3']">
      <span class="text-sm text-slate-600 dark:text-slate-400">
        已選擇 <span class="font-semibold text-blue-600">{{ selectedIds.length }}</span> 筆記錄
      </span>
      <div class="flex gap-3">
        <CommonButton title="批量確認" bg-color="blue" />
        <CommonButton title="批量發放" bg-color="green" />
        <CommonButton title="取消選擇" bg-color="red" @pressed="handleCancelSelect" />
      </div>
    </div>

    <div class="mt-6">
      <PayMemberDetailTable
        v-if="records.length > 0"
        :data="records"
        :selected-ids="selectedIds"
        @toggle-select="handleToggleSelect"
        @toggle-select-all="handleToggleSelectAll"
        @confirm="handleConfirm"
        @pay="handlePay"
      />
      <div v-else :class="[cardClasses, 'flex flex-col items-center justify-center py-16']">
        <span class="text-6xl mb-4">💰</span>
        <p class="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">還沒有薪資記錄</p>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">點擊「生成薪資單」開始進行測試吧!</p>
      </div>
    </div>

    <MemberPayDetailCard
      v-if="selectedDetail"
      :record="selectedDetail"
      @collapse="handleCancelSelect"
      @confirm="handleConfirm(selectedDetail.id)"
      @pay="handlePay(selectedDetail.id)"
    />
  </section>
</template>