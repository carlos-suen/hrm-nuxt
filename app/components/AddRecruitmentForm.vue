<script setup lang="ts">
import type { RecruitmentFormData, SelectOption } from '~/types'

defineProps<{
  formData: RecruitmentFormData
  departmentOptions: SelectOption[]
  typeOptions: SelectOption[]
}>()

const emit = defineEmits<{ (e: 'change', field: keyof RecruitmentFormData, value: string): void }>()

const inputClasses =
  'w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
const labelClasses = 'text-black dark:text-white text-sm'
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col gap-y-1">
      <div class="flex gap-1">
        <span :class="labelClasses">職位名稱</span>
        <span class="text-[14px] text-red-500">*</span>
      </div>
      <input
        :class="inputClasses"
        placeholder="請輸入職位名稱"
        :value="formData.title"
        @input="emit('change', 'title', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="flex flex-row gap-x-3">
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span :class="labelClasses">部門</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <select
          :class="[inputClasses, 'cursor-pointer']"
          :value="formData.department"
          @change="emit('change', 'department', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">請選擇部門</option>
          <option
            v-for="opt in departmentOptions.filter((o) => o.value !== 'all')"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span :class="labelClasses">職位類型</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <select
          :class="[inputClasses, 'cursor-pointer']"
          :value="formData.type"
          @change="emit('change', 'type', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">請選擇類型</option>
          <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col gap-y-1">
      <div class="flex gap-1">
        <span :class="labelClasses">工作地點</span>
        <span class="text-[14px] text-red-500">*</span>
      </div>
      <input
        :class="inputClasses"
        placeholder="請輸入工作地點"
        :value="formData.location"
        @input="emit('change', 'location', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="flex flex-row gap-x-3">
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span :class="labelClasses">最低薪資</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
          <input
            type="number"
            :class="[inputClasses, 'pl-7']"
            placeholder="最低"
            :value="formData.salaryMin"
            @input="emit('change', 'salaryMin', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span :class="labelClasses">最高薪資</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
          <input
            type="number"
            :class="[inputClasses, 'pl-7']"
            placeholder="最高"
            :value="formData.salaryMax"
            @input="emit('change', 'salaryMax', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-y-1">
      <div class="flex gap-1">
        <span :class="labelClasses">職位描述</span>
        <span class="text-[14px] text-red-500">*</span>
      </div>
      <textarea
        :class="[inputClasses, 'resize-none']"
        rows="3"
        placeholder="請輸入職位描述..."
        :value="formData.description"
        @input="emit('change', 'description', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>

    <div class="flex flex-col gap-y-1">
      <div class="flex gap-1">
        <span :class="labelClasses">任職要求</span>
        <span class="text-[14px] text-red-500">*</span>
      </div>
      <textarea
        :class="[inputClasses, 'resize-none', 'mb-6']"
        rows="2"
        placeholder="請輸入任職要求..."
        :value="formData.requirements"
        @input="emit('change', 'requirements', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>
  </div>
</template>