<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Approval } from '~/types'

const props = defineProps<{ data: Approval; className?: string }>()
const emit = defineEmits<{
  (e: 'approve', id: number): void
  (e: 'reject', id: number): void
}>()

const isDragging = ref(false)

const approvalTypeMap: Record<number, string> = {
  0: '日假',
  1: '月假',
  2: '年假',
  3: '病假',
}

const draggable = computed(() => props.data.status === 0)

function calculateDays(start: string, end: string): number {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  const diff = Math.abs(e - s)
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
}

function handleDragStart(e: DragEvent) {
  if (!props.data.id) return
  isDragging.value = true
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', props.data.id.toString())
  }
}

function handleDragEnd() {
  isDragging.value = false
}
</script>

<template>
  <div
    :draggable="draggable"
    :class="[
      'flex w-full flex-col bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 transition-all',
      draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
      'hover:shadow-md',
      isDragging ? 'opacity-50 shadow-lg scale-95' : '',
      props.className ?? '',
    ]"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="flex justify-between">
      <h3 class="text-black dark:text-white">{{ data.ename }}</h3>
      <span class="bg-blue-100 text-blue-700 rounded-md px-1">{{ approvalTypeMap[data.type] }}</span>
    </div>
    <span class="text-sm text-slate-500">
      {{ data.start_time }} -> {{ data.end_time }} ({{ calculateDays(data.start_time, data.end_time) }}天)
    </span>
    <span class="text-sm text-slate-600 line-clamp-2">{{ data.reason }}</span>

    <div v-if="draggable" class="w-full h-px bg-gray-500 dark:bg-gray-300 my-3" />
    <div v-else class="shrink-0" />

    <div v-if="draggable" class="flex w-full gap-2">
      <CommonButton title="拒絕" class-name="flex-1" bg-color="red" @pressed="data.id && emit('reject', data.id)" />
      <CommonButton title="批准" class-name="flex-1" @pressed="data.id && emit('approve', data.id)" />
    </div>
    <div v-else class="shrink-0" />
  </div>
</template>