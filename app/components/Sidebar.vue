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
const themeLabelMap: Record<string, string> = { light: '亮色', dark: '暗色' }
const headerClass = 'dark:text-slate-600 text-gray-400 text-sm mb-2'

function select(index: number) {
  emit('update:activeIndex', index)
}
</script>

<template>
  <aside
    class="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800"
  >
    <div class="p-6 border-b border-slate-200 dark:border-zinc-800">
      <h1 class="text-lg font-bold text-slate-900 dark:text-slate-50">HRM System</h1>
    </div>

    <nav class="p-4 space-y-2 overflow-y-auto flex-1">
      <div :class="headerClass">基礎模塊</div>
      <button
        v-for="(item, index) in items.slice(0, 3)"
        :key="item.id"
        :class="[
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          activeIndex === index
            ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
        ]"
        @click="select(index)"
      >
        <span class="text-lg">{{ item.icon }}</span>
        <span>{{ item.title }}</span>
      </button>

      <div :class="headerClass">進階模塊</div>
      <button
        v-for="(item, index) in items.slice(3, 7)"
        :key="item.id"
        :class="[
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          activeIndex === index + 3
            ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
        ]"
        @click="select(index + 3)"
      >
        <span class="text-lg">{{ item.icon }}</span>
        <span>{{ item.title }}</span>
      </button>

      <div :class="headerClass">高階模塊</div>
      <button
        v-for="(item, index) in items.slice(7)"
        :key="item.id"
        :class="[
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          activeIndex === index + 7
            ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
        ]"
        @click="select(index + 7)"
      >
        <span class="text-lg">{{ item.icon }}</span>
        <span>{{ item.title }}</span>
        <div class="bg-red-500 text-white text-[8px] font-bold p-2 leading-1 rounded-sm">
          NEW
        </div>
      </button>
    </nav>

    <div class="p-4 border-t border-slate-200 dark:border-zinc-800 flex flex-col gap-y-2">
      <UserInfoPanel />
      <button
        class="w-full flex items-center justify-between px-3 py-2 rounded-lg"
        @click="toggleTheme"
      >
        <span class="text-sm text-slate-600 dark:text-slate-400">
          {{ themeIconMap[theme] }} {{ themeLabelMap[theme] }}
        </span>
        <div class="w-10 h-5 bg-slate-200 dark:bg-zinc-700 rounded-full relative">
          <div
            :class="[
              'translate-0.5 w-4 h-4 bg-white rounded-full transition-transform',
              theme === 'dark' ? 'translate-x-5' : 'translate-x-0',
            ]"
          />
        </div>
      </button>
    </div>
  </aside>
</template>