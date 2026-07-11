<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    bgColor?: 'green' | 'red' | 'blue' | 'purple' | 'grey'
    className?: string
  }>(),
  { bgColor: 'blue', className: '' },
)

const emit = defineEmits<{ (e: 'pressed'): void }>()

const bgColorClass: Record<string, string> = {
  green: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
  red: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
  blue: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
  purple: 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500',
  grey: 'bg-slate-500 hover:bg-slate-600 focus:ring-slate-500',
}
</script>

<template>
  <button
    :class="[
      bgColorClass[props.bgColor],
      'text-white rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 whitespace-nowrap',
      props.className,
    ]"
    @click="emit('pressed')"
  >
    {{ title }}
  </button>
</template>