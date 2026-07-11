<script setup lang="ts">
import { computed } from 'vue'
import { cardClasses } from '~/constants/themeClasses'
import type { PayRecord, PayStatus } from '~/types'

const props = defineProps<{
  data: PayRecord[]
  selectedIds: number[]
}>()

const emit = defineEmits<{
  (e: 'toggleSelect', id: number): void
  (e: 'toggleSelectAll'): void
  (e: 'confirm', id: number): void
  (e: 'pay', id: number): void
}>()

const statusBadgeClasses: Record<PayStatus, string> = {
  Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  Confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Paid: 'bg-red-100 text-red-700 dark:bg-green-900/30 dark:text-green-400',
}

const avatarColors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500']

const tHeadClass = 'text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400'

const allSelected = computed(() => props.data.length > 0 && props.selectedIds.length === props.data.length)
const someSelected = computed(() => props.selectedIds.length > 0 && props.selectedIds.length < props.data.length)
</script>

<template>
  <div :class="[cardClasses, 'overflow-x-auto']">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-slate-200 dark:border-slate-700">
          <th class="text-left py-3 px-4 w-10">
            <input
              type="checkbox"
              :checked="allSelected"
              :indeterminate="someSelected"
              class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              @change="emit('toggleSelectAll')"
            />
          </th>
          <th :class="tHeadClass">員工</th>
          <th :class="tHeadClass">部門</th>
          <th :class="tHeadClass">基本工資</th>
          <th :class="tHeadClass">獎金</th>
          <th :class="tHeadClass">扣款</th>
          <th :class="tHeadClass">實發</th>
          <th :class="tHeadClass">狀態</th>
          <th :class="tHeadClass">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(record, index) in data"
          :key="record.id"
          :class="[
            'border-b border-slate-100 dark:border-slate-800 last:border-0',
            selectedIds.includes(record.id) ? 'bg-blue-50 dark:bg-blue-900/10' : '',
          ]"
        >
          <td class="py-3 px-4">
            <input
              type="checkbox"
              :checked="selectedIds.includes(record.id)"
              class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              @change="emit('toggleSelect', record.id)"
            />
          </td>
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
          <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ record.department }}</td>
          <td class="py-3 px-4 text-slate-900 dark:text-white font-medium">{{ record.baseSalary }}</td>
          <td class="py-3 px-4 text-green-600 dark:text-green-400 font-medium">{{ record.bonus }}</td>
          <td class="py-3 px-4 text-red-600 dark:text-red-400 font-medium">{{ record.deduction }}</td>
          <td class="py-3 px-4 text-slate-900 dark:text-white font-bold">{{ record.netPay }}</td>
          <td class="py-3 px-4">
            <span :class="['inline-block px-2 py-1 rounded text-xs font-medium', statusBadgeClasses[record.status]]">
              {{ record.status }}
            </span>
          </td>
          <td class="py-3 px-4">
            <button
              v-if="record.status === 'Draft'"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
              @click="emit('confirm', record.id)"
            >
              確認
            </button>
            <button
              v-else-if="record.status === 'Confirmed'"
              class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-medium"
              @click="emit('pay', record.id)"
            >
              發放
            </button>
            <span v-else class="text-slate-400 dark:text-slate-500 text-sm font-medium cursor-not-allowed">
              已發放
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>