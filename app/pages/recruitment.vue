<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { departmentOptions } from '~/constants/directoryOptions'
import type { RecruitmentFormData, RecruitmentJob, RecruitmentStatus, SelectOption } from '~/types'

const { getAll, getById, update, generateRecords } = useRecruitmentApi()

const typeOptions: SelectOption[] = [
  { value: '全職', label: 'Full-time' },
  { value: '實習', label: 'Intern' },
  { value: '兼職', label: 'Part-time' },
]

const defaultFormData: RecruitmentFormData = {
  title: '',
  department: '',
  type: '',
  location: '',
  salaryMin: '',
  salaryMax: '',
  description: '',
  requirements: '',
}

function formatRecruitmentJob(item: {
  id: number; title: string; department: string; location: string
  salary_min: string; salary_max: string; applicant_count: number; type: string; status: string
}): RecruitmentJob {
  return {
    id: item.id,
    title: item.title,
    department: item.department,
    location: item.location,
    salaryMin: item.salary_min,
    salaryMax: item.salary_max,
    applicantCount: item.applicant_count,
    type: item.type as RecruitmentJob['type'],
    status: item.status as RecruitmentStatus,
  }
}

const testRecruitmentData = [
  { title: '高級前端工程師', department: 'Engineering', location: '北京', salary_min: '25K', salary_max: '35K', applicant_count: 12, type: '全職', status: 'open' },
  { title: '產品經理', department: 'Marketing', location: '上海', salary_min: '20K', salary_max: '30K', applicant_count: 8, type: '全職', status: 'open' },
  { title: '實習設計師', department: 'Marketing', location: '廣州', salary_min: '4K', salary_max: '6K', applicant_count: 5, type: '實習', status: 'open' },
  { title: '後端工程師', department: 'Engineering', location: '深圳', salary_min: '22K', salary_max: '32K', applicant_count: 6, type: '全職', status: 'paused' },
  { title: '兼職文案', department: 'Marketing', location: '遠程', salary_min: '8K', salary_max: '12K', applicant_count: 3, type: '兼職', status: 'closed' },
]

const openJobs = ref<RecruitmentJob[]>([])
const pausedJobs = ref<RecruitmentJob[]>([])
const closedJobs = ref<RecruitmentJob[]>([])

const isEditDialogOpen = ref(false)
const editingJob = ref<RecruitmentJob | null>(null)
const formData = ref<RecruitmentFormData>({ ...defaultFormData })

function distribute(formatted: RecruitmentJob[]) {
  openJobs.value = formatted.filter((j) => j.status === 'open')
  pausedJobs.value = formatted.filter((j) => j.status === 'paused')
  closedJobs.value = formatted.filter((j) => j.status === 'closed')
}

async function fetchAllJobs() {
  try {
    const data = await getAll()
    distribute(data.map(formatRecruitmentJob))
  } catch (err) {
    console.error('獲取招聘記錄失敗:', err)
  }
}

async function generateTestData() {
  try {
    const data = await generateRecords(testRecruitmentData)
    distribute(data.map(formatRecruitmentJob))
  } catch (err) {
    console.error('生成測試數據失敗:', err)
  }
}

async function handleEdit(id: number) {
  try {
    const data = await getById(id)
    const job = formatRecruitmentJob(data)
    editingJob.value = job
    formData.value = {
      title: job.title,
      department: job.department,
      type: job.type,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      description: '',
      requirements: '',
    }
    isEditDialogOpen.value = true
  } catch (err) {
    console.error('獲取職位詳情失敗:', err)
  }
}

function handleFormChange(field: keyof RecruitmentFormData, value: string) {
  formData.value = { ...formData.value, [field]: value }
}

async function handleSubmit() {
  if (!editingJob.value) return
  try {
    const data = await update(editingJob.value.id, {
      title: formData.value.title,
      department: formData.value.department,
      type: formData.value.type,
      location: formData.value.location,
      salary_min: formData.value.salaryMin,
      salary_max: formData.value.salaryMax,
    })
    const updatedJob = formatRecruitmentJob(data)

    openJobs.value = openJobs.value.filter((j) => j.id !== updatedJob.id)
    pausedJobs.value = pausedJobs.value.filter((j) => j.id !== updatedJob.id)
    closedJobs.value = closedJobs.value.filter((j) => j.id !== updatedJob.id)

    if (updatedJob.status === 'open') openJobs.value = [...openJobs.value, updatedJob]
    if (updatedJob.status === 'paused') pausedJobs.value = [...pausedJobs.value, updatedJob]
    if (updatedJob.status === 'closed') closedJobs.value = [...closedJobs.value, updatedJob]

    isEditDialogOpen.value = false
    editingJob.value = null
    formData.value = { ...defaultFormData }
  } catch (err) {
    console.error('更新失敗:', err)
  }
}

function handleCancel() {
  isEditDialogOpen.value = false
  editingJob.value = null
  formData.value = { ...defaultFormData }
}

onMounted(fetchAllJobs)
</script>

<template>
  <section class="flex flex-col h-full">
    <div class="flex gap-2 mb-6 shrink-0">
      <CommonButton title="生成測試數據" bg-color="purple" @pressed="generateTestData" />
    </div>

    <InfoDialog :is-open="isEditDialogOpen" title="編輯職位" @cancel="handleCancel" @confirm="handleSubmit">
      <AddRecruitmentForm
        :form-data="formData"
        :department-options="departmentOptions"
        :type-options="typeOptions"
        @change="handleFormChange"
      />
    </InfoDialog>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
      <RecruitmentColumn title="開放中" :jobs="openJobs" status="open" @edit="handleEdit" />
      <RecruitmentColumn title="暫停" :jobs="pausedJobs" status="paused" @edit="handleEdit" />
      <RecruitmentColumn title="已關閉" :jobs="closedJobs" status="closed" @edit="handleEdit" />
    </div>
  </section>
</template>