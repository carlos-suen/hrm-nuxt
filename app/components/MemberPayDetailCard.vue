<script setup lang="ts">
import { cardClasses } from '~/constants/themeClasses'
import type { PayRecord } from '~/types'

defineProps<{ record: PayRecord }>()

const emit = defineEmits<{
  (e: 'collapse'): void
  (e: 'confirm'): void
  (e: 'pay'): void
}>()
</script>

<template>
  <div :class="[cardClasses, 'mt-6']">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-slate-900 dark:text-white">
        {{ record.name }} · {{ record.department }} · 2026-01
      </h3>
    </div>

    <div class="grid md:grid-cols-5 gap-6 grid-cols-1">
      <div :class="[cardClasses, 'md:col-span-2 col-span-1 space-y-3']">
        <div
          class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
        >
          <span class="text-sm text-slate-500 dark:text-slate-400">基本工資</span>
          <span class="text-sm font-medium text-slate-900 dark:text-white">{{ record.baseSalary }}</span>
        </div>
        <div
          class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
        >
          <span class="text-sm text-slate-500 dark:text-slate-400">績效獎金</span>
          <span class="text-sm font-medium text-green-600 dark:text-green-400">{{ record.bonus }}</span>
        </div>
        <div
          class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
        >
          <span class="text-sm text-slate-500 dark:text-slate-400">扣款</span>
          <span class="text-sm font-medium text-red-600 dark:text-red-400">{{ record.deduction }}</span>
        </div>
        <div
          class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
        >
          <span class="text-sm text-slate-500 dark:text-slate-400">五險一金</span>
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">-¥2,940</span>
        </div>
        <div class="flex items-center justify-between py-2 last:border-0">
          <span class="text-sm text-slate-500 dark:text-slate-400">個人所得稅</span>
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">-¥1,632</span>
        </div>
      </div>

      <div :class="[cardClasses, 'md:col-span-3 col-span-1 flex flex-col justify-between']">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-slate-500 dark:text-slate-400">實發工資</span>
            <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ record.netPay }}</span>
          </div>
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm text-slate-500 dark:text-slate-400">薪資狀態</span>
            <span
              :class="[
                'inline-block px-3 py-1 rounded text-xs font-medium',
                record.status === 'Draft'
                  ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
              ]"
            >
              {{ record.status }}
            </span>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            @click="emit('confirm')"
          >
            確認
          </button>
          <button
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            @click="emit('pay')"
          >
            發放
          </button>
        </div>
      </div>
    </div>
  </div>
</template>