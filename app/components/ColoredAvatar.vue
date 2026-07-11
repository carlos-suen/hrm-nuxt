<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    level: string
    firstName: string
    className?: string
  }>(),
  { className: '' },
)

const bgColorClass: Record<string, string> = {
  s: 'bg-purple-500',
  a: 'bg-emerald-500',
  b: 'bg-blue-500',
  c: 'bg-orange-500',
  d: 'bg-red-500',
}
</script>

<template>
  <div
    :class="[
      'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium',
      bgColorClass[props.level.toLowerCase()] ?? 'bg-slate-500',
      props.className,
    ]"
  >
    {{ props.firstName }}
  </div>
</template>
