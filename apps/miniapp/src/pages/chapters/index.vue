<template>
  <view class="page">
    <view class="section-head">
      <text class="title">{{ subjectName || '选择章节' }}</text>
      <text class="desc">选择章节后开始客观题练习。</text>
    </view>
    <view v-if="loading" class="state">加载中...</view>
    <view v-else-if="chapters.length === 0" class="state">暂无章节数据</view>
    <view v-else class="list">
      <view v-for="chapter in chapters" :key="chapter._id" class="card" @tap="openPractice(chapter)">
        <text class="card-title">{{ chapter.name }}</text>
        <text class="card-desc">开始练习</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { Category } from '@study408/shared';
import { getCategories } from '../../services/category.service';

const subjectId = ref('');
const subjectName = ref('');
const chapters = ref<Category[]>([]);
const loading = ref(false);

async function loadChapters() {
  if (!subjectId.value) return;
  loading.value = true;
  try {
    const result = await getCategories(uniCloud, { type: 'chapter', parentId: subjectId.value });
    chapters.value = result.items;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '加载章节失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

function openPractice(chapter: Category) {
  uni.navigateTo({ url: `/pages/practice/index?subjectId=${subjectId.value}&chapterId=${chapter._id}` });
}

onLoad((options) => {
  subjectId.value = String(options?.subjectId || '');
  subjectName.value = decodeURIComponent(String(options?.subjectName || ''));
  loadChapters();
});
</script>

<style scoped>
.page { min-height: 100vh; padding: 32rpx; background: #f6f7fb; box-sizing: border-box; }
.section-head { margin-bottom: 24rpx; }
.title { display: block; color: #0f172a; font-size: 40rpx; font-weight: 700; }
.desc { display: block; margin-top: 12rpx; color: #64748b; font-size: 28rpx; line-height: 1.5; }
.list { display: grid; gap: 20rpx; }
.card { min-height: 96rpx; padding: 28rpx; border-radius: 24rpx; background: #ffffff; box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.06); }
.card-title { display: block; color: #0f172a; font-size: 32rpx; font-weight: 700; }
.card-desc { display: block; margin-top: 8rpx; color: #64748b; font-size: 26rpx; }
.state { padding: 48rpx 24rpx; border-radius: 24rpx; background: #ffffff; color: #64748b; text-align: center; }
</style>
