<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()

const navItems = [
  { id: 'dashboard', icon: '📊', title: '數據大盤', label: 'Dashboard', path: '/' },
  { id: 'directory', icon: '👥', title: '員工名冊', label: 'Directory', path: '/directory' },
  { id: 'approvals', icon: '✅', title: '請假審批', label: 'Approvals', path: '/approvals' },
  { id: 'attendance', icon: '🕐', title: '考勤管理', label: 'Attendance', path: '/attendance' },
  { id: 'payroll', icon: '💰', title: '薪資管理', label: 'Payroll', path: '/payroll' },
  { id: 'recruitment', icon: '📋', title: '招聘管理', label: 'Recruitment', path: '/recruitment' },
  { id: 'training', icon: '🎓', title: '培訓管理', label: 'Training', path: '/training' },
  { id: 'performance', icon: '🏆', title: '績效管理', label: 'Performance', path: '/performance' },
  { id: 'reports', icon: '📈', title: '報表中心', label: 'Reports', path: '/reports' },
  { id: 'notifications', icon: '🔔', title: '通知中心', label: 'Notifications', path: '/notifications' },
  { id: 'settings', icon: '⚙️', title: '系統設置', label: 'Settings', path: '/settings' },
]

const activeIndex = computed(() => {
  const path = route.path
  const idx = navItems.findIndex(item => item.path === path || path.startsWith(item.path + '/'))
  return idx >= 0 ? idx : 0
})

const activeItem = computed(() => navItems[activeIndex.value])

function handleNavigate(index: number) {
  const item = navItems[index]
  if (item) {
    navigateTo(item.path)
  }
}
</script>

<template>
  <main class="bg-slate-50 dark:bg-zinc-950 h-screen flex flex-col md:flex-row">
    <Sidebar
      :items="navItems"
      :active-index="activeIndex"
      @update:active-index="handleNavigate"
    />

    <MobileSideBar
      :items="navItems"
      :active-index="activeIndex"
      @update:active-index="handleNavigate"
    />

    <div class="ml-0 md:ml-64 flex-1 h-full overflow-hidden">
      <Content :title="activeItem?.title ?? ''" :subtitle="activeItem?.label ?? ''">
        <slot />
      </Content>
    </div>
  </main>
</template>