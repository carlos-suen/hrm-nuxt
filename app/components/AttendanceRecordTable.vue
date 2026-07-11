<script setup lang="ts">
import { cardClasses } from '~/constants/themeClasses'
import { departmentOptions, statusOptions } from '~/constants/directoryOptions'
import type { AttendanceRecord, AttendanceStatus } from '~/types'

defineProps<{
  data: AttendanceRecord[]
  onGenerateData?: () => void
}>()

const statusBadgeClasses: Record<AttendanceStatus, string> = {
  Normal: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Late: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Absent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  EarlyLeave: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

const statusLabelMap: Record<AttendanceStatus, string> = {
  Normal: 'Normal',
  Late: 'Late',
  Absent: 'Absent',
  EarlyLeave: 'Early Leave',
}

const avatarColors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500']
const tHeadClass = 'text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400'
</script>

<template>
  <div class="mt-6">
    <div :class="[cardClasses, 'flex gap-4 my-6']">
      <ToolbarTextField type="input" hint-text="選擇日期..." prefix-icon="📅" />
      <ToolbarTextField type="select" :options="departmentOptions" />
      <ToolbarTextField type="select" :options="statusOptions" />
      <div class="flex-1" />
      <CommonButton
        v-if="data.length === 0 && onGenerateData"
        title="生成測試數據"
        bg-color="purple"
        @pressed="onGenerateData"
      />
      <CommonButton title="⏰模擬打卡" @pressed="() => {}" />
    </div>

    <div :class="[cardClasses, 'overflow-x-auto']">
      <table v-if="data.length > 0" class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-700">
            <th :class="tHeadClass">員工</th>
            <th :class="tHeadClass">日期</th>
            <th :class="tHeadClass">上班打卡</th>
            <th :class="tHeadClass">下班打卡</th>
            <th :class="tHeadClass">狀態</th>
            <th :class="tHeadClass">工時</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(record, index) in data"
            :key="record.id"
            class="border-b border-slate-100 dark:border-slate-800 last:border-0"
          >
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium',
                    avatarColors[index % avatarColors.length],
                  ]"
                >
                  {{ record.avatar }}
                </div>
                <div>
                  <div class="font-medium text-slate-900 dark:text-white">{{ record.name }}</div>
                  <div class="text-xs text-slate-400">{{ record.email }}</div>
                </div>
              </div>
            </td>
            <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ record.date }}</td>
            <td :class="['py-3 px-4', record.clockIn ? 'text-green-600 dark:text-green-400' : 'text-slate-400']">
              {{ record.clockIn ?? '—' }}
            </td>
            <td :class="['py-3 px-4', record.clockOut ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400']">
              {{ record.clockOut ?? '—' }}
            </td>
            <td class="py-3 px-4">
              <span :class="['inline-block px-2 py-1 rounded text-xs font-medium', statusBadgeClasses[record.status]]">
                {{ statusLabelMap[record.status] }}
              </span>
            </td>
            <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ record.hours }}</td>
          </tr>
        </tbody>
      </table>

      <div v-else class="flex flex-col items-center justify-center py-16">
        <span class="text-6xl mb-4">👥</span>
        <p class="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">還沒有員工記錄</p>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">點擊「生成數據」開始進行測試吧!</p>
      </div>
    </div>
  </div>
</template>