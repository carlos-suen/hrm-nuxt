<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Approval } from '~/types'

type ColumnKey = 'pending' | 'approved' | 'rejected'

const {
  getPending,
  getApproved,
  getRejected,
  updateStatus,
  generateApprovals,
  clearAll,
} = useApprovalApi()

const testPendingApprovalsData: Omit<Approval, 'id'>[] = [
  { ename: '張三', type: 1, start_time: '2024-01-15', end_time: '2024-01-17', reason: '家中有事需處理', status: 0 },
  { ename: '李四', type: 2, start_time: '2024-01-20', end_time: '2024-01-24', reason: '需要住院手術', status: 0 },
  { ename: '王五', type: 3, start_time: '2024-02-01', end_time: '2024-02-03', reason: '個人事務處理', status: 0 },
  { ename: '趙六', type: 1, start_time: '2024-02-10', end_time: '2024-02-14', reason: '出國旅遊', status: 0 },
  { ename: '陳七', type: 2, start_time: '2024-02-20', end_time: '2024-02-21', reason: '身體不適', status: 0 },
]

const pendingApprovals = ref<Approval[]>([])
const approvedApprovals = ref<Approval[]>([])
const rejectedApprovals = ref<Approval[]>([])

const statusMap: Record<ColumnKey, number> = { pending: 0, approved: 1, rejected: 2 }

async function handleDragEnd(cardId: string, targetColumn: ColumnKey) {
  let draggedCard: Approval | undefined
  let sourceColumn: ColumnKey | null = null

  const pendingCard = pendingApprovals.value.find((c) => c.id === Number(cardId))
  if (pendingCard) {
    draggedCard = pendingCard
    sourceColumn = 'pending'
  }
  const approvedCard = approvedApprovals.value.find((c) => c.id === Number(cardId))
  if (approvedCard) {
    draggedCard = approvedCard
    sourceColumn = 'approved'
  }
  const rejectedCard = rejectedApprovals.value.find((c) => c.id === Number(cardId))
  if (rejectedCard) {
    draggedCard = rejectedCard
    sourceColumn = 'rejected'
  }

  if (!draggedCard || sourceColumn === targetColumn) return
  if (sourceColumn !== 'pending' && targetColumn === 'pending') return

  const newStatus = statusMap[targetColumn]

  try {
    const data = await updateStatus(Number(cardId), { status: newStatus })

    if (sourceColumn === 'pending') pendingApprovals.value = pendingApprovals.value.filter((c) => c.id !== Number(cardId))
    if (sourceColumn === 'approved') approvedApprovals.value = approvedApprovals.value.filter((c) => c.id !== Number(cardId))
    if (sourceColumn === 'rejected') rejectedApprovals.value = rejectedApprovals.value.filter((c) => c.id !== Number(cardId))

    if (targetColumn === 'pending') pendingApprovals.value = [...pendingApprovals.value, data]
    if (targetColumn === 'approved') approvedApprovals.value = [...approvedApprovals.value, data]
    if (targetColumn === 'rejected') rejectedApprovals.value = [...rejectedApprovals.value, data]
  } catch (err) {
    console.error('拖動更新失敗:', err)
  }
}

async function fetchAllPendingApprovals() {
  try {
    pendingApprovals.value = await getPending()
  } catch (err) {
    console.error('獲取待處理的事項失敗, 原因:', err)
  }
}
async function fetchAllApprovedApprovals() {
  try {
    approvedApprovals.value = await getApproved()
  } catch (err) {
    console.error('獲取已批准的事項失敗, 原因:', err)
  }
}
async function fetchAllRejectedApprovals() {
  try {
    rejectedApprovals.value = await getRejected()
  } catch (err) {
    console.error('獲取已拒絕的事項失敗, 原因:', err)
  }
}

async function clearAllData() {
  try {
    await clearAll()
    pendingApprovals.value = []
    approvedApprovals.value = []
    rejectedApprovals.value = []
  } catch (err) {
    console.error('清空失敗, 原因: ', err)
  }
}

async function generatePendingApprovals() {
  try {
    const data = await generateApprovals(testPendingApprovalsData)
    pendingApprovals.value = [...data, ...pendingApprovals.value]
  } catch (err) {
    console.error('生成測試數據失敗:', err)
  }
}

async function updatePendingApprovalStatus(approvalId: number, newStatus: number) {
  const targetApproval = pendingApprovals.value.find((item) => item.id === approvalId)
  if (!targetApproval) return

  const updatedApproval = { ...targetApproval, status: newStatus }

  try {
    await updateStatus(approvalId, { status: newStatus })

    if (newStatus === 1) approvedApprovals.value = [...approvedApprovals.value, updatedApproval]
    else if (newStatus === 2) rejectedApprovals.value = [...rejectedApprovals.value, updatedApproval]

    pendingApprovals.value = pendingApprovals.value.filter((item) => item.id !== approvalId)
  } catch (err) {
    console.error('更新失敗, 原因: ', err)
  }
}

onMounted(() => {
  fetchAllPendingApprovals()
  fetchAllApprovedApprovals()
  fetchAllRejectedApprovals()
})
</script>

<template>
  <section class="h-full flex flex-col gap-4">
    <div class="flex w-full justify-between shrink-0">
      <div class="flex gap-4">
        <CommonButton title="生成測試數據" bg-color="purple" @pressed="generatePendingApprovals" />
        <CommonButton title="清空所有數據" bg-color="red" @pressed="clearAllData" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
      <ApprovalsColumn
        :title="`🟡 待處理 (${pendingApprovals.length})`"
        :approvals="pendingApprovals"
        column-key="pending"
        @drag-end="handleDragEnd"
        @approve="updatePendingApprovalStatus($event, 1)"
        @reject="updatePendingApprovalStatus($event, 2)"
      />
      <ApprovalsColumn
        :title="`🟢 已批准 (${approvedApprovals.length})`"
        :approvals="approvedApprovals"
        column-key="approved"
        @drag-end="handleDragEnd"
      />
      <ApprovalsColumn
        :title="`🔴 已拒絕 (${rejectedApprovals.length})`"
        :approvals="rejectedApprovals"
        column-key="rejected"
        @drag-end="handleDragEnd"
      />
    </div>
  </section>
</template>