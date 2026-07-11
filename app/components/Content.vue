<script setup lang="ts">
defineProps<{ title: string; subtitle: string }>()
</script>

<template>
  <div class="flex flex-col h-full">
    <ContentHeader :title="title" :subtitle="subtitle" />

    <div class="flex-1 p-6 overflow-y-auto min-h-0">
      <slot />
    </div>
  </div>
</template>