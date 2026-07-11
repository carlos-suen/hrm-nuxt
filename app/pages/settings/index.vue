<script setup lang="ts">
import { ref } from 'vue'

const showCompanyDialog = ref(false)
const showLeaveDialog = ref(false)
const showPayrollDialog = ref(false)

const settingItems = [
  { id: 'company', label: '公司信息', desc: '公司名稱、財年、工作時間', icon: '🏢', color: 'bg-blue-100' },
  { id: 'leave', label: '假期設置', desc: '年假天數、結轉限制、審批流程', icon: '📉', color: 'bg-green-100' },
  { id: 'attendance', label: '考勤設置', desc: '遲到閾值、早退閾值、加班規則', icon: '🕐', color: 'bg-orange-100' },
  { id: 'payroll', label: '薪資設置', desc: '發薪日、稅率表', icon: '💰', color: 'bg-purple-100' },
]

function handleCardClick(id: string) {
  if (id === 'company') {
    showCompanyDialog.value = true
  } else if (id === 'leave') {
    showLeaveDialog.value = true
  } else if (id === 'payroll') {
    showPayrollDialog.value = true
  } else {
    navigateTo(`/settings/${id}`)
  }
}
</script>

<template>
  <section>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-6">系統設置</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ReportDataCard
        v-for="item in settingItems"
        :key="item.id"
        :id="item.id"
        :label="item.label"
        :desc="item.desc"
        :icon="item.icon"
        :color="item.color"
        button-label="進入設置 →"
        @view-report="handleCardClick(item.id)"
      />
    </div>

    <InfoDialog
      :is-open="showCompanyDialog"
      title="公司信息"
      cancel-text="取消"
      confirm-text="保存設置"
      max-width="max-w-2xl"
      @cancel="showCompanyDialog = false"
      @confirm="showCompanyDialog = false"
    >
      <CompanyInfoForm />
    </InfoDialog>

    <InfoDialog
      :is-open="showLeaveDialog"
      title="假期設置"
      cancel-text="取消"
      confirm-text="保存設置"
      max-width="max-w-2xl"
      @cancel="showLeaveDialog = false"
      @confirm="showLeaveDialog = false"
    >
      <LeaveSettingsForm />
    </InfoDialog>

    <InfoDialog
      :is-open="showPayrollDialog"
      title="薪資設置"
      cancel-text="取消"
      confirm-text="保存設置"
      max-width="max-w-2xl"
      @cancel="showPayrollDialog = false"
      @confirm="showPayrollDialog = false"
    >
      <PayrollSettingsForm />
    </InfoDialog>
  </section>
</template>