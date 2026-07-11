<script setup lang="ts">
import { ref, reactive, watch, onUnmounted, computed } from 'vue'

interface PerformanceFormData {
  name: string
  duration: string
  score: number
  level: string
  status: number
  monitor: string
}

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: PerformanceFormData): void
}>()

const defaultScores = [
  { label: '工作質量', value: 4.0 },
  { label: '工作效率', value: 3.5 },
  { label: '團隊協作', value: 4.5 },
  { label: '主動性', value: 4.0 },
  { label: '溝通能力', value: 3.0 },
]

const name = ref('')
const duration = ref('2026 Q1')
const monitor = ref('')
const comment = ref('')
const scores = reactive<Record<string, number>>(
  Object.fromEntries(defaultScores.map((d) => [d.label, d.value])),
)

const avgScore = computed(() => {
  const values = Object.values(scores)
  return values.reduce((a, b) => a + b, 0) / values.length
})

function calcLevel(avg: number) {
  const floor = Math.floor(avg)
  if (floor === 5) return 'S'
  if (floor === 4) return 'A'
  if (floor === 3) return 'B'
  if (floor === 2) return 'C'
  return 'D'
}

function resetForm() {
  name.value = ''
  duration.value = '2026 Q1'
  monitor.value = ''
  comment.value = ''
  Object.assign(scores, Object.fromEntries(defaultScores.map((d) => [d.label, d.value])))
}

function handleSubmit() {
  const score = avgScore.value
  emit('submit', {
    name: name.value,
    duration: duration.value,
    score,
    level: calcLevel(score),
    status: 0,
    monitor: monitor.value,
  })
  emit('close')
}

function handleClose() {
  resetForm()
  emit('close')
}

// 開啟時鎖定 body 滾動，關閉/卸載時復原（僅客戶端）
watch(
  () => props.isOpen,
  (open) => {
    if (import.meta.client) {
      document.body.style.overflow = open ? 'hidden' : ''
    }
  },
)
onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        v-if="props.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div class="relative z-10 w-full max-w-xl mx-4 bg-slate-100 dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">新增績效評估</h3>
            <button
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              @click="handleClose"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form Content -->
          <div class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            <!-- 員工選擇 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                員工姓名 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="name"
                type="text"
                placeholder="輸入員工姓名..."
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <!-- 評估週期 + 監管人 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  評估週期 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="duration"
                  type="text"
                  class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  監管人 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="monitor"
                  type="text"
                  placeholder="輸入監管人..."
                  class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <!-- 五維評分 -->
            <div class="border-t border-slate-200 dark:border-zinc-700 pt-5">
              <h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-4">五維評分</h4>
              <div class="space-y-4">
                <div v-for="dim in defaultScores" :key="dim.label" class="flex items-center gap-4">
                  <label class="w-24 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {{ dim.label }}
                  </label>
                  <input
                    v-model.number="scores[dim.label]"
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    class="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span class="w-10 text-center font-mono text-lg font-bold text-blue-600">
                    {{ scores[dim.label]?.toFixed(1) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 評語 -->
            <div class="border-t border-slate-200 dark:border-zinc-700 pt-5">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                評語
              </label>
              <textarea
                v-model="comment"
                placeholder="輸入評語..."
                rows="3"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 px-6 py-4 bg-white dark:bg-zinc-800 border-t border-slate-200 dark:border-zinc-700">
            <button
              class="px-6 py-2.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-zinc-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
              @click="handleClose"
            >
              取消
            </button>
            <button
              class="px-6 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              @click="handleSubmit"
            >
              提交評估
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>
