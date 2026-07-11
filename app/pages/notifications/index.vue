<script setup lang="ts">
import { ref, computed } from 'vue'

type NotificationType = 'all' | 'leave' | 'attendance' | 'payroll' | 'performance' | 'system'

interface Notification {
  id: number
  type: NotificationType
  title: string
  description: string
  date: string
  read: boolean
  icon: string
  iconBg: string
  iconColor: string
}

const typeLabels: Record<NotificationType, string> = {
  all: '全部',
  leave: '請假',
  attendance: '考勤',
  payroll: '薪資',
  performance: '績效',
  system: '系統',
}

const iconConfig = {
  performance: { icon: '📋', iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600' },
  attendance: { icon: '🕐', iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600' },
  leave: { icon: '🕐', iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600' },
  payroll: { icon: '💰', iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600' },
  system: { icon: '🕐', iconBg: 'bg-slate-100 dark:bg-slate-700', iconColor: 'text-slate-600' },
}

const mockNotifications: Notification[] = [
  {
    id: 1, type: 'performance', title: '績效評估待完成',
    description: '2026-H1 績效自評截止日期：6/15',
    date: '6/2', read: false, ...iconConfig.performance,
  },
  {
    id: 2, type: 'attendance', title: '考勤異常提醒',
    description: '李娜今日遲到（09:45打卡）',
    date: '6/3', read: false, ...iconConfig.attendance,
  },
  {
    id: 3, type: 'leave', title: '請假申請待審批',
    description: '張偉提交了年假申請（6/5-6/7，3天）',
    date: '6/3', read: false, ...iconConfig.leave,
  },
  {
    id: 4, type: 'payroll', title: '薪資單已確認',
    description: '2026年5月薪資單已生成，請確認',
    date: '6/1', read: true, ...iconConfig.payroll,
  },
  {
    id: 5, type: 'system', title: '系統維護通知',
    description: '系統將於6/8 02:00-04:00進行維護',
    date: '5/30', read: true, ...iconConfig.system,
  },
]

const tabs: NotificationType[] = ['all', 'leave', 'attendance', 'payroll', 'performance', 'system']

const activeTab = ref<NotificationType>('all')
const notifications = ref<Notification[]>(mockNotifications)

const filtered = computed(() =>
  activeTab.value === 'all' ? notifications.value : notifications.value.filter((n) => n.type === activeTab.value),
)

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

function markAllRead() {
  notifications.value = notifications.value.map((n) => ({ ...n, read: true }))
}

function markRead(id: number) {
  notifications.value = notifications.value.map((n) => (n.id === id ? { ...n, read: true } : n))
}

function goSettings() {
  navigateTo('/notifications/settings')
}
</script>

<template>
  <section>
    <!-- 標題 + 操作欄 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div class="flex gap-2 items-center">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white">通知中心</h2>
        <button
          class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          @click="goSettings"
        >
          ⚙
        </button>
      </div>
      <div class="flex items-center gap-3">
        <button class="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          🔔
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {{ unreadCount }}
          </span>
        </button>
        <button
          class="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
          @click="markAllRead"
        >
          全部已讀
        </button>
      </div>
    </div>

    <!-- 分類標籤 -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="[
          'px-4 py-1.5 text-sm font-medium rounded-lg transition-colors',
          activeTab === tab
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-600',
        ]"
        @click="activeTab = tab"
      >
        {{ typeLabels[tab] }}
      </button>
    </div>

    <!-- 通知列表 -->
    <div class="space-y-3">
      <div
        v-for="notif in filtered"
        :key="notif.id"
        :class="[
          'rounded-xl p-4 flex items-start gap-4 transition-colors',
          notif.read
            ? 'border-l-4 border-green-500 bg-white dark:bg-zinc-800/50'
            : 'border-l-4 border-red-500 bg-white dark:bg-zinc-800',
        ]"
      >
        <!-- 圖標 -->
        <div :class="['w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0', notif.iconBg]">
          {{ notif.icon }}
        </div>

        <!-- 內容 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h4 class="text-sm font-semibold text-slate-900 dark:text-white">{{ notif.title }}</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ notif.description }}</p>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0">
              <span class="text-xs text-slate-400">{{ notif.date }}</span>
              <span v-if="!notif.read" class="w-2.5 h-2.5 bg-red-500 rounded-full" />
            </div>
          </div>
          <div class="flex items-center gap-3 mt-2">
            <button class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
              查看詳情
            </button>
            <template v-if="!notif.read">
              <span class="text-slate-300 dark:text-zinc-600">|</span>
              <button
                class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                @click="markRead(notif.id)"
              >
                標記已讀
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>