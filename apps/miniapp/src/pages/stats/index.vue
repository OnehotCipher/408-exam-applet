<template>
  <view class="page">
    <view class="section-head">
      <text class="title">练习统计</text>
      <text class="desc">从答题记录实时聚合基础数据。</text>
    </view>
    <view v-if="loading" class="state">统计加载中...</view>
    <view v-else-if="!stats" class="state">暂无统计数据</view>
    <view v-else>
      <view class="summary">
        <view class="metric"><text class="num">{{ stats.totalAnswered }}</text><text class="label">总答题</text></view>
        <view class="metric"><text class="num">{{ percent(stats.accuracy) }}</text><text class="label">正确率</text></view>
        <view class="metric"><text class="num">{{ stats.wrongQuestionCount }}</text><text class="label">错题数</text></view>
        <view class="metric"><text class="num">{{ stats.favoriteQuestionCount }}</text><text class="label">收藏数</text></view>
      </view>
      <view class="section">
        <text class="section-title">按科目</text>
        <view v-if="stats.subjects.length === 0" class="state small">暂无科目统计</view>
        <view v-for="item in stats.subjects" :key="item.subjectId" class="row">
          <text class="row-title">{{ item.subjectId }}</text>
          <text class="row-desc">{{ item.correctAnswered }}/{{ item.totalAnswered }}  {{ percent(item.accuracy) }}</text>
        </view>
      </view>
      <view class="section">
        <text class="section-title">按章节</text>
        <view v-if="stats.chapters.length === 0" class="state small">暂无章节统计</view>
        <view v-for="item in stats.chapters" :key="`${item.subjectId}:${item.chapterId}`" class="row">
          <text class="row-title">{{ item.chapterId }}</text>
          <text class="row-desc">{{ item.correctAnswered }}/{{ item.totalAnswered }}  {{ percent(item.accuracy) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { PracticeStats } from '@study408/shared';
import { getPracticeStats } from '../../services/stats.service';

const stats = ref<PracticeStats>();
const loading = ref(false);

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

async function loadStats() {
  loading.value = true;
  try {
    stats.value = await getPracticeStats(uniCloud);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '加载统计失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onLoad(loadStats);
</script>

<style scoped>
.page { min-height: 100vh; padding: 32rpx; background: #f6f7fb; box-sizing: border-box; }
.section-head { margin-bottom: 24rpx; }
.title { display: block; color: #0f172a; font-size: 40rpx; font-weight: 700; }
.desc { display: block; margin-top: 12rpx; color: #64748b; font-size: 28rpx; line-height: 1.5; }
.summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18rpx; }
.metric { padding: 28rpx; border-radius: 24rpx; background: #ffffff; box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.06); }
.num { display: block; color: #2563eb; font-size: 40rpx; font-weight: 800; }
.label { display: block; margin-top: 8rpx; color: #64748b; font-size: 24rpx; }
.section { margin-top: 28rpx; }
.section-title { display: block; margin-bottom: 16rpx; color: #0f172a; font-size: 32rpx; font-weight: 700; }
.row { margin-bottom: 16rpx; padding: 24rpx; border-radius: 20rpx; background: #ffffff; }
.row-title { display: block; color: #0f172a; font-size: 28rpx; font-weight: 700; }
.row-desc { display: block; margin-top: 8rpx; color: #64748b; font-size: 26rpx; }
.state { padding: 48rpx 24rpx; border-radius: 24rpx; background: #ffffff; color: #64748b; text-align: center; }
.state.small { padding: 28rpx 24rpx; }
</style>
