<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DataCardItem } from '~/components/DataCard.vue'
import type { AttendanceRecord, CalendarItemType, CalenderItemData, ChartData } from '~/types'

const { getAll, generateRecords } = useAttendanceApi()

const attendanceItems: DataCardItem[] = [
  { id: 'total-employees', label: '本月薪資總覽', icon: '💰', value: '42', desc: '較上月 +3' },
  { id: 'employment-rate', label: '平均薪資', icon: '📈', value: '85.7%', desc: '較上月 +2%' },
  { id: 'salary-expense', label: '最高薪資', icon: '⬆️', value: '¥528,000', desc: '較上月 +8%' },
  { id: 'pending-approvals', label: '待確認薪資', icon: '', value: '4', desc: '待處理' },
]

const attendanceTrendData: ChartData[] = [
  { name: '5/28', attendance: 28, late: 4 },
  { name: '5/29', attendance: 30, late: 6 },
  { name: '5/30', attendance: 26, late: 3 },
  { name: '5/31', attendance: 32, late: 7 },
  { name: '6/1', attendance: 30, late: 5 },
  { name: '6/2', attendance: 34, late: 8 },
  { name: '6/3', attendance: 32, late: 6 },
]

const calendarData: CalenderItemData[] = [
  { title: '1', type: 'Normal' }, { title: '2', type: 'Normal' }, { title: '3', type: 'Late' },
  { title: '4', type: 'Normal' }, { title: '5', type: 'Absent' }, { title: '6', type: 'Weekend' },
  { title: '7', type: 'Weekend' }, { title: '8', type: 'Normal' }, { title: '9', type: 'OLeave' },
  { title: '10', type: 'Normal' }, { title: '11', type: 'Normal' }, { title: '12', type: 'Late' },
  { title: '13', type: 'Weekend' }, { title: '14', type: 'Weekend' }, { title: '15', type: 'Normal' },
  { title: '16', type: 'Normal' }, { title: '17', type: 'Normal' }, { title: '18', type: 'Future' },
  { title: '19', type: 'Future' }, { title: '20', type: 'Future' },
] as { title: string; type: CalendarItemType }[]

const testAttendanceData = [
  { name: '張偉', email: 'zhangwei@co.com', record_date: '2026-06-03', clock_in: '08:15', clock_out: '18:30', status: 'Normal', hours: '9.5h' },
  { name: '李娜', email: 'lina@co.com', record_date: '2026-06-03', clock_in: '09:45', clock_out: '18:20', status: 'Late', hours: '7.8h' },
  { name: '王強', email: 'wangqiang@co.com', record_date: '2026-06-03', clock_in: null, clock_out: null, status: 'Absent', hours: '0h' },
  { name: '趙敏', email: 'zhaomin@co.com', record_date: '2026-06-03', clock_in: '08:05', clock_out: '16:30', status: 'EarlyLeave', hours: '7.2h' },
  { name: '陳思', email: 'chensi@co.com', record_date: '2026-06-03', clock_in: '08:20', clock_out: '18:00', status: 'Normal', hours: '8.5h' },
]

const records = ref<AttendanceRecord[]>([])

function formatRecord(item: {
  id: number; name: string; email: string; record_date: string
  clock_in: string | null; clock_out: string | null; status: string; hours: string
}): AttendanceRecord {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    avatar: item.name.charAt(0),
    date: item.record_date,
    clockIn: item.clock_in,
    clockOut: item.clock_out,
    status: item.status as AttendanceRecord['status'],
    hours: item.hours,
  }
}

async function fetchRecords() {
  try {
    const data = await getAll()
    records.value = data.map(formatRecord)
  } catch (err) {
    console.error('獲取考勤記錄失敗:', err)
  }
}

async function generateTestData() {
  try {
    const data = await generateRecords(testAttendanceData)
    records.value = data.map(formatRecord)
  } catch (err) {
    console.error('生成測試數據失敗:', err)
  }
}

onMounted(fetchRecords)
</script>

<template>
  <section>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DataCard v-for="item in attendanceItems" :key="item.id" :data="item" />
    </div>

    <div class="my-6">
      <ChartCard :data="attendanceTrendData" type="area" title="考勤趨勢（近7天）" />
    </div>

    <AttendanceCalendar header-title="考勤日曆" :data="calendarData" />

    <AttendanceRecordTable :data="records" :on-generate-data="generateTestData" />
  </section>
</template>