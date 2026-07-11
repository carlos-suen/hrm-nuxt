<script setup lang="ts">
defineProps<{ icon?: string; title?: string; desc?: string; className?: string }>()
</script>

<template>
  <div :class="['flex flex-col items-center justify-center py-16', className ?? '']">
    <span v-if="icon" class="text-6xl mb-4">{{ icon }}</span>
    <p v-if="title" class="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">
      {{ title }}
    </p>
    <p v-if="desc" class="text-sm text-slate-500 dark:text-slate-400">{{ desc }}</p>
  </div>
</template>