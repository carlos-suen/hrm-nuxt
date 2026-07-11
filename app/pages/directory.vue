<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { departmentOptions, statusOptions } from '~/constants/directoryOptions'
import type { EmployeeFormData } from '~/types'

interface Employee {
  id: string
  name: string
  eid: string
  department: string
  pos: string
  created_at: string
  sal: number
  status: number
  start_date: string
}

interface ToolBarFieldData {
  name: string
  department: string
  status: string
}

const {
  getAll,
  createEmployee,
  updateEmployeeData,
  deleteEmployee,
  generateEmployees,
  clearAll,
} = useEmployeeApi()

const testData = [
  { name: '張三', eid: 'EMP001', department: 'Engineering', pos: 'Senior Developer', sal: 85000, status: 1, start_date: '2024-01-15' },
  { name: '李四', eid: 'EMP002', department: 'Engineering', pos: 'Junior Developer', sal: 55000, status: 1, start_date: '2024-03-20' },
  { name: '王五', eid: 'EMP003', department: 'Marketing', pos: 'Marketing Manager', sal: 72000, status: 1, start_date: '2023-11-05' },
  { name: '趙六', eid: 'EMP004', department: 'HR', pos: 'HR Specialist', sal: 58000, status: 1, start_date: '2024-02-14' },
  { name: '錢七', eid: 'EMP005', department: 'Engineering', pos: 'Tech Lead', sal: 96000, status: 1, start_date: '2023-06-18' },
  { name: '孫八', eid: 'EMP006', department: 'Sales', pos: 'Sales Representative', sal: 52000, status: 2, start_date: '2024-04-01' },
  { name: '周九', eid: 'EMP007', department: 'Marketing', pos: 'Content Writer', sal: 48000, status: 1, start_date: '2024-05-12' },
  { name: '吳十', eid: 'EMP008', department: 'Engineering', pos: 'DevOps Engineer', sal: 82000, status: 1, start_date: '2023-09-25' },
  { name: '鄭十一', eid: 'EMP009', department: 'HR', pos: 'Recruiter', sal: 54000, status: 3, start_date: '2024-01-30' },
  { name: '王十二', eid: 'EMP010', department: 'Sales', pos: 'Sales Manager', sal: 78000, status: 1, start_date: '2023-08-14' },
]

const initialFormData: EmployeeFormData = {
  id: '',
  name: '',
  eid: '',
  department: '',
  pos: '',
  sal: '',
  status: '1',
  start_date: '',
}

const statusBadgeMap: Record<number, { label: string; classes: string }> = {
  1: { label: 'Active', classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  2: { label: 'On Leave', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  3: { label: 'Terminated', classes: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

const isAddDialogOpen = ref(false)
const isDeleteWarningDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const employees = ref<Employee[]>([])
const loading = ref(true)
const isSearching = ref(false)
const formData = ref<EmployeeFormData>({ ...initialFormData })
const toolBarFieldData = ref<ToolBarFieldData>({ name: '', department: '', status: '' })

async function fetchEmployees() {
  try {
    employees.value = await getAll()
  } catch (err) {
    console.error('獲取員工數據失敗:', err)
  } finally {
    loading.value = false
  }
}

async function addEmployee(newEmployee: Omit<Employee, 'id' | 'created_at'>) {
  try {
    const data = await createEmployee(newEmployee)
    employees.value = [data, ...employees.value]
    isAddDialogOpen.value = false
  } catch (err) {
    console.error('新增失敗:', err)
  }
}

async function updateEmployee(id: string, updates: Partial<Employee>) {
  try {
    const data = await updateEmployeeData(id, updates)
    employees.value = employees.value.map((emp) => (emp.id === id ? { ...emp, ...data } : emp))
    isEditDialogOpen.value = false
  } catch (err) {
    console.error('更新失敗:', err)
  }
}

async function deleteEmployeeHandler(id: string) {
  try {
    await deleteEmployee(id)
    employees.value = employees.value.filter((emp) => emp.id !== id)
    isDeleteWarningDialogOpen.value = false
  } catch (err) {
    console.error('刪除失敗:', err)
  }
}

async function searchEmployee(filters: ToolBarFieldData) {
  const hasName = String(filters.name).trim()
  const hasDepartment = filters.department && filters.department !== 'all'
  const hasStatus = filters.status !== '' && Number(filters.status) !== 0

  if (!hasName && !hasDepartment && !hasStatus) {
    isSearching.value = false
    fetchEmployees()
    return
  }
  try {
    loading.value = true
    isSearching.value = true
    const data = await getAll({
      name: hasName ? String(filters.name) : undefined,
      department: hasDepartment ? String(filters.department) : undefined,
      status: hasStatus ? String(filters.status) : undefined,
    })
    employees.value = data
  } catch (err) {
    console.error('搜索失敗:', err)
  } finally {
    loading.value = false
  }
}

async function generateTestData() {
  try {
    const data = await generateEmployees(testData)
    employees.value = [...data, ...employees.value]
  } catch (err) {
    console.error('生成測試數據失敗:', err)
  }
}

async function deleteAllTestData() {
  try {
    await clearAll()
    employees.value = []
    isDeleteWarningDialogOpen.value = false
  } catch (err) {
    console.error('刪除失敗:', err)
    alert('刪除失敗')
  }
}

function handleFormChange(field: keyof EmployeeFormData, value: string) {
  formData.value = { ...formData.value, [field]: value }
}

function handleAddConfirm() {
  if (!formData.value.eid || !formData.value.department || !formData.value.pos || !formData.value.sal) {
    alert('請填寫所有必填字段')
    return
  }
  addEmployee({
    eid: formData.value.eid,
    name: formData.value.name,
    department: formData.value.department,
    pos: formData.value.pos,
    sal: Number(formData.value.sal),
    status: Number(formData.value.status),
    start_date: formData.value.start_date,
  })
  formData.value = { ...initialFormData }
}

function handleEditConfirm() {
  if (!formData.value.eid || !formData.value.department || !formData.value.pos || !formData.value.sal) {
    alert('請填寫所有必填字段')
    return
  }
  updateEmployee(formData.value.id, {
    eid: formData.value.eid,
    name: formData.value.name,
    department: formData.value.department,
    pos: formData.value.pos,
    sal: Number(formData.value.sal),
    status: Number(formData.value.status),
    start_date: formData.value.start_date,
  })
  formData.value = { ...initialFormData }
}

function openEditDialog(emp: Employee) {
  formData.value = {
    id: emp.id,
    name: emp.name,
    eid: emp.eid,
    department: emp.department,
    pos: emp.pos,
    sal: String(emp.sal),
    status: String(emp.status),
    start_date: emp.start_date,
  }
  isEditDialogOpen.value = true
}

function openDeleteDialog(emp: Employee) {
  formData.value = { ...formData.value, id: emp.id, name: emp.name }
  isDeleteWarningDialogOpen.value = true
}

function formatDate(d: string) {
  return d ? new Date(d).toLocaleDateString('zh-CN') : '-'
}

const thClass = 'px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'
const tdClass = 'px-4 py-3 text-sm text-slate-900 dark:text-slate-50'

onMounted(fetchEmployees)
</script>

<template>
  <section>
    <div class="flex flex-col md:flex-row gap-4 mb-6 justify-between items-stretch w-auto">
      <div class="flex flex-col md:flex-row gap-2 items-stretch">
        <ToolbarTextField v-model="toolBarFieldData.name" prefix-icon="🔍" hint-text="搜索員工姓名..." />
        <ToolbarTextField
          v-model="toolBarFieldData.department"
          prefix-icon="部門:"
          type="select"
          :options="departmentOptions"
        />
        <ToolbarTextField
          v-model="toolBarFieldData.status"
          prefix-icon="狀態:"
          type="select"
          :options="statusOptions"
        />
        <CommonButton title="查找" bg-color="green" @pressed="searchEmployee(toolBarFieldData)" />
        <CommonButton title="新增" @pressed="isAddDialogOpen = true" />
      </div>
      <div class="flex gap-4">
        <CommonButton v-if="employees.length === 0" title="生成測試數據" bg-color="purple" @pressed="generateTestData" />
        <CommonButton title="刪除所有數據(慎用)" bg-color="red" @pressed="deleteAllTestData" />
      </div>
    </div>

    <InfoDialog :is-open="isAddDialogOpen" title="添加員工" @cancel="formData = { ...initialFormData }; isAddDialogOpen = false" @confirm="handleAddConfirm">
      <EditEmployeeForm :form-data="formData" :department-options="departmentOptions" @change="handleFormChange" />
    </InfoDialog>

    <InfoDialog :is-open="isEditDialogOpen" title="更新員工信息" confirm-text="更新" @cancel="formData = { ...initialFormData }; isEditDialogOpen = false" @confirm="handleEditConfirm">
      <EditEmployeeForm :form-data="formData" :department-options="departmentOptions" @change="handleFormChange" />
    </InfoDialog>

    <InfoDialog
      :is-open="isDeleteWarningDialogOpen"
      title="刪除員工"
      :content="`確定刪除該員工「${formData.name}」?`"
      confirm-text="刪除"
      is-delete
      @cancel="formData = { ...initialFormData }; isDeleteWarningDialogOpen = false"
      @confirm="deleteEmployeeHandler(formData.id)"
    />

    <div class="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 overflow-x-auto">
      <table class="w-full">
        <thead class="bg-slate-50 dark:bg-zinc-900">
          <tr>
            <th :class="thClass">姓名</th>
            <th :class="thClass">工號</th>
            <th :class="thClass">部門</th>
            <th :class="thClass">職位</th>
            <th :class="thClass">入職日期</th>
            <th :class="thClass">薪資</th>
            <th :class="thClass">狀態</th>
            <th :class="thClass">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          <tr v-if="loading">
            <td colspan="8" class="px-4 py-8 text-center text-slate-500">加載中...</td>
          </tr>
          <tr v-else-if="employees.length === 0">
            <td colspan="8">
              <div v-if="isSearching" class="flex flex-col items-center justify-center py-16">
                <span class="text-6xl mb-4">🔍</span>
                <p class="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">未找到匹配的員工</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">嘗試調整搜索條件</p>
              </div>
              <EmptyHolder v-else icon="👥" title="還沒有員工記錄" desc="點擊「添加員工」開始錄入" />
            </td>
          </tr>
          <tr v-for="emp in employees" v-else :key="emp.id" class="hover:bg-slate-50 dark:hover:bg-zinc-700/50 transition-colors">
            <td class="px-4 py-3">
              <div class="flex items-center gap-4">
                <span class="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <div class="text-sm font-medium text-slate-900 dark:text-slate-50">{{ emp.name }}</div>
                  <div class="text-xs text-slate-500 dark:text-slate-400">{{ emp.department }}</div>
                </div>
              </div>
            </td>
            <td :class="tdClass">{{ emp.eid }}</td>
            <td :class="tdClass">{{ emp.department }}</td>
            <td :class="tdClass">{{ emp.pos }}</td>
            <td :class="tdClass">{{ formatDate(emp.start_date) }}</td>
            <td :class="tdClass">¥{{ emp.sal.toLocaleString() }}</td>
            <td class="px-4 py-3">
              <span :class="['inline-flex items-center px-2 py-1 rounded text-xs font-medium', statusBadgeMap[emp.status]?.classes]">
                {{ statusBadgeMap[emp.status]?.label }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button class="text-slate-400 hover:text-blue-500 transition-colors" @click="openEditDialog(emp)">✏️</button>
                <button class="text-slate-400 hover:text-red-500 transition-colors" @click="openDeleteDialog(emp)">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>