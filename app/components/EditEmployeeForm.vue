<script setup lang="ts">
import type { EmployeeFormData, SelectOption } from '~/types'

defineProps<{
  formData: EmployeeFormData
  departmentOptions: SelectOption[]
}>()

const emit = defineEmits<{ (e: 'change', field: keyof EmployeeFormData, value: string): void }>()

const inputClasses =
  'bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
const selectClasses = `${inputClasses} cursor-pointer`
</script>

<template>
  <div class="space-y-3 pb-4">
    <div class="flex flex-col gap-y-1">
      <div class="flex gap-1">
        <span class="text-black dark:text-white text-sm">工號</span>
        <span class="text-[14px] text-red-500">*</span>
      </div>
      <input
        :class="inputClasses"
        placeholder="請輸入工號..."
        :value="formData.eid"
        @input="emit('change', 'eid', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="flex flex-col gap-y-1">
      <div class="flex gap-1">
        <span class="text-black dark:text-white text-sm">姓名</span>
        <span class="text-[14px] text-red-500">*</span>
      </div>
      <input
        :class="inputClasses"
        placeholder="請輸入姓名..."
        :value="formData.name"
        @input="emit('change', 'name', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="flex flex-row gap-x-2">
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span class="text-black dark:text-white text-sm">部門</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <select
          :class="selectClasses"
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
          <span class="text-black dark:text-white text-sm">狀態</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <select
          :class="selectClasses"
          :value="formData.status"
          @change="emit('change', 'status', ($event.target as HTMLSelectElement).value)"
        >
          <option value="1">Active</option>
          <option value="2">On Leave</option>
          <option value="3">Terminated</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col gap-y-1">
      <div class="flex gap-1">
        <span class="text-black dark:text-white text-sm">職位</span>
        <span class="text-[14px] text-red-500">*</span>
      </div>
      <input
        :class="inputClasses"
        placeholder="請輸入職位..."
        :value="formData.pos"
        @input="emit('change', 'pos', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="flex flex-row gap-x-2">
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span class="text-black dark:text-white text-sm">薪資</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <input
          type="number"
          :class="inputClasses"
          placeholder="請輸入薪資..."
          :value="formData.sal"
          @input="emit('change', 'sal', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex flex-col gap-y-1 flex-1">
        <div class="flex gap-1">
          <span class="text-black dark:text-white text-sm">入職日期</span>
          <span class="text-[14px] text-red-500">*</span>
        </div>
        <input
          type="date"
          :class="inputClasses"
          :value="formData.start_date"
          @input="emit('change', 'start_date', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>