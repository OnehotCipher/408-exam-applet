<template>
  <view class="page">
    <view class="section-head">
      <text class="title">我的收藏</text>
      <text class="desc">集中回看你标记的重点题目。</text>
    </view>
    <view v-if="loading" class="state">收藏加载中...</view>
    <view v-else-if="questions.length === 0" class="state">暂无收藏题目</view>
    <view v-else class="list">
      <view v-for="question in questions" :key="question._id" class="card">
        <view @tap="openAnalysis(question._id)">
          <text class="type">{{ question.type === 'multiple_choice' ? '多选题' : '单选题' }}</text>
          <text class="stem">{{ question.stem }}</text>
        </view>
        <button class="cancel" @tap="removeFavorite(question._id)">取消收藏</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { Question } from '@study408/shared';
import { getFavoriteQuestions, toggleFavoriteQuestion } from '../../services/favorite.service';

const questions = ref<Question[]>([]);
const loading = ref(false);

async function loadFavorites() {
  loading.value = true;
  try {
    const result = await getFavoriteQuestions(uniCloud, { page: 1, pageSize: 50 });
    questions.value = result.items;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '加载收藏失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

async function removeFavorite(questionId: string) {
  try {
    await toggleFavoriteQuestion(uniCloud, questionId);
    await loadFavorites();
    uni.showToast({ title: '已取消收藏', icon: 'none' });
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '操作失败', icon: 'none' });
  }
}

function openAnalysis(questionId: string) {
  uni.navigateTo({ url: `/pages/analysis/index?questionId=${questionId}` });
}

onLoad(loadFavorites);
</script>

<style scoped>
.page { min-height: 100vh; padding: 32rpx; background: #f6f7fb; box-sizing: border-box; }
.section-head { margin-bottom: 24rpx; }
.title { display: block; color: #0f172a; font-size: 40rpx; font-weight: 700; }
.desc { display: block; margin-top: 12rpx; color: #64748b; font-size: 28rpx; line-height: 1.5; }
.list { display: grid; gap: 20rpx; }
.card { padding: 28rpx; border-radius: 24rpx; background: #ffffff; box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.06); }
.type { display: inline-block; color: #2563eb; font-size: 24rpx; font-weight: 700; }
.stem { display: block; margin-top: 12rpx; color: #0f172a; font-size: 30rpx; line-height: 1.5; font-weight: 600; }
.cancel { margin-top: 22rpx; min-height: 76rpx; border-radius: 16rpx; background: #fee2e2; color: #991b1b; font-size: 26rpx; }
.state { padding: 48rpx 24rpx; border-radius: 24rpx; background: #ffffff; color: #64748b; text-align: center; }
</style>
