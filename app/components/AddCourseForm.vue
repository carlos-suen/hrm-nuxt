<script setup lang="ts">
import type { CourseFormData, SelectOption } from '~/types'

defineProps<{
  formData: CourseFormData
  typeOptions: SelectOption[]
}>()

const emit = defineEmits<{ (e: 'change', field: keyof CourseFormData, value: string): void }>()

const inputClasses =
  'w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
const labelClasses = 'text-black dark:text-white text-sm'
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col gap-y-1">
      <div class="flex gap-1">
        <span :class="labelClasses">課程名稱</span>
        <span class="text-[14px] text-red-500">*</span>
      </div>
      <input
        :class="inputClasses"
        placeholder="請輸入課程名稱"
        :value="formData.title"
        @input="emit('change', 'title', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="flex flex-row gap-x-3">
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span :class="labelClasses">講師</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <input
          :class="inputClasses"
          placeholder="請輸入講師姓名"
          :value="formData.instructor"
          @input="emit('change', 'instructor', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span :class="labelClasses">類別</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <select
          :class="[inputClasses, 'cursor-pointer']"
          :value="formData.type"
          @change="emit('change', 'type', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">請選擇類別</option>
          <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
    </div>

    <div class="flex flex-row gap-x-3">
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span :class="labelClasses">開始日期</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <input
          type="date"
          :class="inputClasses"
          :value="formData.startDate"
          @input="emit('change', 'startDate', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span :class="labelClasses">結束日期</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <input
          type="date"
          :class="inputClasses"
          :value="formData.endDate"
          @input="emit('change', 'endDate', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div class="flex flex-row gap-x-3">
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span :class="labelClasses">時長（小時）</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <input
          type="number"
          :class="inputClasses"
          placeholder="例: 24"
          :value="formData.duration"
          @input="emit('change', 'duration', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span :class="labelClasses">容量</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <input
          type="number"
          :class="inputClasses"
          placeholder="例: 25"
          :value="formData.capacity"
          @input="emit('change', 'capacity', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div class="flex flex-col gap-y-1">
      <div class="flex gap-1">
        <span :class="labelClasses">地點</span>
        <span class="text-[14px] text-red-500">*</span>
      </div>
      <input
        :class="inputClasses"
        placeholder="請輸入培訓地點"
        :value="formData.location"
        @input="emit('change', 'location', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="flex flex-col gap-y-1">
      <div class="flex gap-1">
        <span :class="labelClasses">課程描述</span>
        <span class="text-[14px] text-red-500">*</span>
      </div>
      <textarea
        :class="[inputClasses, 'resize-none']"
        rows="3"
        placeholder="請輸入課程描述..."
        :value="formData.description"
        @input="emit('change', 'description', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>
  </div>
</template>