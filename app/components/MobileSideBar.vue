<script setup lang="ts">
interface NavItem {
  id: string
  icon: string
  title: string
  label: string
}

defineProps<{
  items: NavItem[]
  activeIndex: number
}>()

const emit = defineEmits<{
  (e: 'update:activeIndex', index: number): void
}>()

const { theme, toggleTheme } = useTheme()
const themeIconMap: Record<string, string> = { light: '☀️', dark: '🌙' }

function select(index: number) {
  emit('update:activeIndex', index)
}
</script>

<template>
  <div class="md:hidden">
    <header
      class="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800"
    >
      <UserInfoPanel :is-mobile="true" />
      <h1 class="text-lg font-bold text-slate-900 dark:text-slate-50">HRM</h1>
      <button class="text-slate-600 dark:text-slate-400" @click="toggleTheme">
        {{ themeIconMap[theme] }}
      </button>
    </header>

    <nav
      class="scrollbar-none flex overflow-x-auto bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800"
    >
      <button
        v-for="(item, index) in items"
        :key="item.id"
        :class="[
          'flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
          activeIndex === index
            ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950'
            : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
        ]"
        @click="select(index)"
      >
        <span class="mr-2">{{ item.icon }}</span>
        {{ item.title }}
      </button>
    </nav>
  </div>
</template>