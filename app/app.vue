<script setup lang="ts">
// 初始化主題（useTheme 內部透過 useHead 同步 html class，SSR 兼容）
useTheme()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>