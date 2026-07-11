<script setup lang="ts">
defineProps<{ label: string; enabled: boolean }>()
const emit = defineEmits<{ (e: 'change', value: boolean): void }>()
</script>

<template>
  <label class="flex items-center justify-between py-3">
    <span class="text-sm text-slate-700 dark:text-slate-300">{{ label }}</span>
    <button
      type="button"
      role="switch"
      :aria-checked="enabled"
      :class="[
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        enabled ? 'bg-blue-500' : 'bg-slate-200 dark:bg-zinc-600',
      ]"
      @click="emit('change', !enabled)"
    >
      <span
        :class="[
          'inline-block h-4 w-4 rounded-full bg-white transition-transform',
          enabled ? 'translate-x-6' : 'translate-x-1',
        ]"
      />
    </button>
  </label>
</template>