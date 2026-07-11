<script setup lang="ts">
defineProps<{ title: string; subtitle: string; className?: string }>()
</script>

<template>
  <header
    :class="[
      'bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-6 py-4',
      className ?? '',
    ]"
  >
    <div>
      <h2 class="text-xl font-bold text-slate-900 dark:text-slate-50">{{ title }}</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ subtitle }}</p>
    </div>
  </header>
</template>