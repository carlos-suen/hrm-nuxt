<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CourseFormData, SelectOption, TrainingCourseInfo } from '~/types'

const { getAll, create, enroll, generateRecords, deleteAll } = useTrainingApi()

const typeOptions: SelectOption[] = [
  { value: '技術', label: 'Technical' },
  { value: '管理', label: 'Management' },
  { value: '合規', label: 'Compliance' },
  { value: '入職', label: 'Onboarding' },
]

const defaultFormData: CourseFormData = {
  title: '',
  instructor: '',
  type: '',
  startDate: '',
  endDate: '',
  duration: '',
  capacity: '',
  location: '',
  description: '',
}

function formatTrainingCourse(item: {
  id: number; title: string; type: string; start_time: string; end_time: string
  location: string; max_people: number; current_join: number; status: string; instructor: string
}): TrainingCourseInfo {
  return {
    id: item.id,
    title: item.title,
    type: item.type,
    startTime: item.start_time,
    endTime: item.end_time,
    location: item.location,
    maxPeople: item.max_people,
    currentJoin: item.current_join,
    status: item.status,
    instructor: item.instructor,
  }
}

const testTrainingData = [
  { title: 'React 進階實戰', type: '技術', start_time: '2024-06-15', end_time: '2024-06-20', location: '3F 會議室', max_people: 25, current_join: 18, status: '即將開始', instructor: '張偉' },
  { title: '領導力培訓', type: '管理', start_time: '2024-05-20', end_time: '2024-06-15', location: '5F 培訓室', max_people: 20, current_join: 17, status: '進行中', instructor: '李娜' },
  { title: '信息安全培訓', type: '合規', start_time: '2024-04-01', end_time: '2024-04-05', location: '線上', max_people: 30, current_join: 30, status: '已結束', instructor: '周傑' },
  { title: '新員工入職培訓', type: '入職', start_time: '2024-07-01', end_time: '2024-07-03', location: '1F 大廳', max_people: 20, current_join: 8, status: '即將開始', instructor: '黃芳' },
  { title: 'TypeScript 實戰', type: '技術', start_time: '2024-07-10', end_time: '2024-07-15', location: '線上', max_people: 20, current_join: 11, status: '即將開始', instructor: '劉洋' },
]

const courses = ref<TrainingCourseInfo[]>([])
const isAddCourseDialogOpen = ref(false)
const formData = ref<CourseFormData>({ ...defaultFormData })

async function fetchCourses() {
  try {
    const data = await getAll()
    courses.value = data.map(formatTrainingCourse)
  } catch (err) {
    console.error('獲取培訓課程失敗:', err)
  }
}

function handleFormChange(field: keyof CourseFormData, value: string) {
  formData.value = { ...formData.value, [field]: value }
}

async function handleSubmit() {
  try {
    const data = await create({
      title: formData.value.title,
      instructor: formData.value.instructor,
      type: formData.value.type,
      start_time: formData.value.startDate,
      end_time: formData.value.endDate,
      location: formData.value.location,
      max_people: parseInt(formData.value.capacity) || 20,
      current_join: 0,
      status: '即將開始',
    })
    courses.value = [...courses.value, formatTrainingCourse(data)]
    isAddCourseDialogOpen.value = false
    formData.value = { ...defaultFormData }
  } catch (err) {
    console.error('創建課程失敗:', err)
  }
}

function handleCancel() {
  isAddCourseDialogOpen.value = false
  formData.value = { ...defaultFormData }
}

async function handleEnroll(id: number) {
  try {
    const data = await enroll(id)
    const updatedCourse = formatTrainingCourse(data)
    courses.value = courses.value.map((c) => (c.id === id ? updatedCourse : c))
  } catch (err) {
    console.error('報名失敗:', err)
  }
}

async function generateTestData() {
  try {
    const data = await generateRecords(testTrainingData)
    courses.value = data.map(formatTrainingCourse)
  } catch (err) {
    console.error('生成測試數據失敗:', err)
  }
}

async function clearAll() {
  try {
    await deleteAll()
    courses.value = []
  } catch (err) {
    console.error('刪除失敗:', err)
    alert('刪除失敗')
  }
}

onMounted(fetchCourses)
</script>

<template>
  <section class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-4 shrink-0">
      <h2 class="text-xl font-bold text-black dark:text-white">培訓課程</h2>
      <div class="flex gap-2">
        <CommonButton v-if="courses.length === 0" title="生成測試數據" bg-color="purple" @pressed="generateTestData" />
        <CommonButton title="新增課程" bg-color="blue" @pressed="isAddCourseDialogOpen = true" />
        <CommonButton v-if="courses.length !== 0" title="刪除所有數據" bg-color="red" @pressed="clearAll" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
      <TrainingCard
        v-for="course in courses"
        :key="course.id"
        :course="course"
        @enroll="handleEnroll"
      />
    </div>

    <InfoDialog :is-open="isAddCourseDialogOpen" title="新增課程" @cancel="handleCancel" @confirm="handleSubmit">
      <AddCourseForm :form-data="formData" :type-options="typeOptions" @change="handleFormChange" />
    </InfoDialog>
  </section>
</template>