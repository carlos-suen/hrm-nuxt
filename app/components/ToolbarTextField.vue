<script setup lang="ts">
export interface SelectOption {
  value: number | string
  label: string
}

const props = withDefaults(
  defineProps<{
    type?: 'input' | 'select'
    prefixIcon?: string
    hintText?: string
    trailingIcon?: string
    options?: SelectOption[]
    className?: string
  }>(),
  { type: 'input', options: () => [], className: '' },
)

const model = defineModel<string>({ default: '' })

const baseClasses =
  'bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none transition-colors'
const commonInputClass = 'w-full md:w-auto'
</script>

<template>
  <div v-if="props.type === 'input'" :class="['relative flex items-center', commonInputClass, props.className]">
    <span
      v-if="props.prefixIcon"
      class="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none"
    >
      {{ props.prefixIcon }}
    </span>
    <input
      v-model="model"
      type="text"
      :placeholder="props.hintText"
      :class="[baseClasses, 'w-full', props.prefixIcon ? 'pl-8' : '', props.trailingIcon ? 'pr-8' : '']"
    />
    <span
      v-if="props.trailingIcon"
      class="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none"
    >
      {{ props.trailingIcon }}
    </span>
  </div>

  <div v-else :class="['flex items-center', baseClasses, commonInputClass, props.className]">
    <span
      v-if="props.prefixIcon"
      class="pl-1 text-slate-400 dark:text-slate-500 text-sm pointer-events-none"
    >
      {{ props.prefixIcon }}
    </span>
    <select v-model="model" class="focus:border-none cursor-pointer -translate-y-px">
      <option v-for="opt in props.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <span
      v-if="props.trailingIcon"
      class="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none"
    >
      {{ props.trailingIcon }}
    </span>
  </div>
</template>