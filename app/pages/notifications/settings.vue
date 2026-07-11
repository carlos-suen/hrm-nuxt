<script setup lang="ts">
import { ref } from 'vue'

type Frequency = 'realtime' | 'daily' | 'weekly'

interface SubSetting {
  id: string
  label: string
  enabled: boolean
}

interface CategorySetting {
  id: string
  icon: string
  label: string
  color: string
  items: SubSetting[]
}

const emailEnabled = ref(true)
const pushEnabled = ref(false)
const frequency = ref<Frequency>('realtime')

const categories = ref<CategorySetting[]>([
  {
    id: 'leave', icon: '', label: '請假通知', color: 'text-blue-600',
    items: [
      { id: 'leave-new', label: '新申請通知', enabled: true },
      { id: 'leave-result', label: '審批結果通知', enabled: true },
    ],
  },
  {
    id: 'attendance', icon: '🕐', label: '考勤通知', color: 'text-orange-600',
    items: [
      { id: 'attendance-abnormal', label: '異常打卡通知', enabled: true },
    ],
  },
  {
    id: 'payroll', icon: '', label: '薪資通知', color: 'text-green-600',
    items: [
      { id: 'payroll-confirm', label: '薪資確認通知', enabled: false },
    ],
  },
  {
    id: 'performance', icon: '🏆', label: '績效通知', color: 'text-purple-600',
    items: [
      { id: 'performance-pending', label: '評估待辦通知', enabled: true },
    ],
  },
])

const frequencyOptions: { value: Frequency; label: string }[] = [
  { value: 'realtime', label: '實時' },
  { value: 'daily', label: '每日' },
  { value: 'weekly', label: '每週' },
]

function toggleSubItem(categoryId: string, itemId: string) {
  categories.value = categories.value.map((cat) =>
    cat.id === categoryId
      ? {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, enabled: !item.enabled } : item,
          ),
        }
      : cat,
  )
}

const cardClasses = 'bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-slate-700'
</script>

<template>
  <section class="max-w-2xl mx-auto">
    <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-6">通知設置</h2>

    <!-- 通知渠道 -->
    <div :class="[cardClasses, 'p-6 mb-6']">
      <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-4">通知渠道</h3>
      <AppSwitch label="郵件通知" :enabled="emailEnabled" @change="emailEnabled = $event" />
      <AppSwitch label="推送通知" :enabled="pushEnabled" @change="pushEnabled = $event" />

      <!-- 摘要頻率 -->
      <div class="flex items-center justify-between py-3 border-t border-slate-100 dark:border-zinc-700">
        <span class="text-sm text-slate-700 dark:text-slate-300">摘要頻率</span>
        <div class="flex items-center gap-4">
          <label
            v-for="opt in frequencyOptions"
            :key="opt.value"
            class="flex items-center gap-1.5 cursor-pointer"
          >
            <input
              v-model="frequency"
              type="radio"
              name="frequency"
              :value="opt.value"
              class="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span class="text-sm text-slate-600 dark:text-slate-400">{{ opt.label }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 通知類別 -->
    <div :class="[cardClasses, 'p-6']">
      <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-4">通知類別</h3>
      <div v-for="(cat, catIndex) in categories" :key="cat.id">
        <div v-if="catIndex > 0" class="border-t border-slate-100 dark:border-zinc-700 my-3" />
        <div :class="['text-sm font-semibold mb-2', cat.color]">
          {{ cat.icon }} {{ cat.label }}
        </div>
        <div v-for="item in cat.items" :key="item.id" class="pl-4">
          <AppSwitch
            :label="item.label"
            :enabled="item.enabled"
            @change="toggleSubItem(cat.id, item.id)"
          />
        </div>
      </div>
    </div>
  </section>
</template>