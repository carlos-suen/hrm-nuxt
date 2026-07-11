<script setup lang="ts">
const reportItems = [
  { id: 'headcount', label: '人數統計', desc: '員工人數趨勢、部門分佈', icon: '👥', color: 'bg-blue-100' },
  { id: 'turnover', label: '離職率分析', desc: '離職率趨勢、原因分析', icon: '📉', color: 'bg-pink-100' },
  { id: 'salary', label: '薪資分析', desc: '薪資分佈、部門對比', icon: '💰', color: 'bg-green-100' },
  { id: 'attendance', label: '考勤統計', desc: '出勤率、遲到率趨勢', icon: '🕐', color: 'bg-yellow-100' },
  { id: 'performance', label: '績效分析', desc: '等級分佈、部門對比', icon: '🏆', color: 'bg-purple-100' },
]

const routeMap: Record<string, string> = {
  headcount: '/reports/employee-stats',
  turnover: '/reports/resign-stats',
  salary: '/reports/salary-stats',
  attendance: '/reports/attendance-stats',
  performance: '/reports/performance-stats',
}

function handleViewReport(id: string) {
  const route = routeMap[id]
  if (route) navigateTo(route)
}
</script>

<template>
  <section>
    <!-- 數據卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ReportDataCard
        v-for="item in reportItems"
        :key="item.id"
        :id="item.id"
        :label="item.label"
        :desc="item.desc"
        :icon="item.icon"
        :color="item.color"
        @view-report="handleViewReport(item.id)"
      />
    </div>
  </section>
</template>