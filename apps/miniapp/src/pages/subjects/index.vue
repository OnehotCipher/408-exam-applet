<template>
  <view class="page">
    <navigator v-for="subject in subjects" :key="subject.id" class="card" :url="`/pages/practice/index?subjectId=${subject.id}`">
      {{ subject.name }}
    </navigator>
  </view>
</template>

<script setup lang="ts">
const subjects = [
  { id: 'data-structure', name: '数据结构' },
  { id: 'computer-organization', name: '计算机组成原理' },
  { id: 'operating-system', name: '操作系统' },
  { id: 'computer-network', name: '计算机网络' }
];
</script>

<style scoped>
.page { padding: 32rpx; }
.card { display: block; margin-bottom: 24rpx; padding: 32rpx; border-radius: 20rpx; background: #ffffff; }
</style>
