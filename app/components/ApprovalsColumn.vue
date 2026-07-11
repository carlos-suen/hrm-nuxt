<script setup lang="ts">
import { ref } from 'vue'
import type { Approval } from '~/types'

type ColumnKey = 'pending' | 'approved' | 'rejected'

const props = defineProps<{
  title: string
  approvals: Approval[]
  columnKey: ColumnKey
  className?: string
}>()

const emit = defineEmits<{
  (e: 'dragEnd', cardId: string, targetColumn: ColumnKey): void
  (e: 'approve', id: number): void
  (e: 'reject', id: number): void
}>()

const isDragOver = ref(false)

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  isDragOver.value = true
}

function handleDragLeave() {
  isDragOver.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  const cardId = e.dataTransfer?.getData('text/plain')
  if (!cardId) return
  if (props.columnKey === 'pending') return
  emit('dragEnd', cardId, props.columnKey)
}
</script>

<template>
  <div
    :class="[
      'bg-slate-100 dark:bg-zinc-800/50 rounded-xl p-4 transition-colors flex flex-col h-full',
      isDragOver ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : '',
      props.className ?? '',
    ]"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <h2 class="dark:text-white text-black mb-4 text-center font-medium">{{ title }}</h2>
    <div class="space-y-3 overflow-y-auto flex-1">
      <ApprovalsDraggableCard
        v-for="approval in approvals"
        :key="approval.id"
        :data="approval"
        @approve="emit('approve', $event)"
        @reject="emit('reject', $event)"
      />
    </div>
  </div>
</template>