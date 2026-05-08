<template>
  <view class="page">
    <view v-if="loading" class="state">解析加载中...</view>
    <view v-else-if="!question" class="state">未找到题目</view>
    <view v-else class="card">
      <text class="type">{{ question.type === 'multiple_choice' ? '多选题' : '单选题' }}</text>
      <text class="stem">{{ question.stem }}</text>
      <view class="answer-box">
        <text class="label">你的答案</text>
        <text class="value">{{ userAnswerText || '未作答' }}</text>
      </view>
      <view class="answer-box correct">
        <text class="label">正确答案</text>
        <text class="value">{{ question.answer.join('、') }}</text>
      </view>
      <view class="analysis">
        <text class="label">解析</text>
        <text class="analysis-text">{{ question.analysis }}</text>
      </view>
      <button class="button" @tap="toggleFavorite">{{ favoriteText }}</button>
      <button class="button secondary" @tap="goBack">返回上一页</button>
      <button class="button ghost" @tap="goHome">回到首页</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { computed, ref } from 'vue';
import type { Question } from '@study408/shared';
import { toggleFavoriteQuestion } from '../../services/favorite.service';
import { getQuestionDetail } from '../../services/question.service';

const questionId = ref('');
const userAnswer = ref<string[]>([]);
const question = ref<Question>();
const isFavorite = ref(false);
const loading = ref(false);
const favoriteText = computed(() => (isFavorite.value ? '取消收藏' : '收藏题目'));
const userAnswerText = computed(() => userAnswer.value.join('、'));

async function loadQuestion() {
  if (!questionId.value) return;
  loading.value = true;
  try {
    question.value = await getQuestionDetail(uniCloud, questionId.value);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '加载解析失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

async function toggleFavorite() {
  if (!questionId.value) return;
  try {
    const result = await toggleFavoriteQuestion(uniCloud, questionId.value);
    isFavorite.value = result.isFavorite;
    uni.showToast({ title: result.isFavorite ? '已收藏' : '已取消收藏', icon: 'none' });
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '操作失败', icon: 'none' });
  }
}

function goBack() {
  uni.navigateBack({ delta: 1 });
}

function goHome() {
  uni.reLaunch({ url: '/pages/home/index' });
}

onLoad((options) => {
  questionId.value = String(options?.questionId || '');
  const answerText = decodeURIComponent(String(options?.userAnswer || ''));
  userAnswer.value = answerText ? answerText.split(',').filter(Boolean) : [];
  loadQuestion();
});
</script>

<style scoped>
.page { min-height: 100vh; padding: 32rpx; background: #f6f7fb; box-sizing: border-box; }
.card { padding: 32rpx; border-radius: 28rpx; background: #ffffff; box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.06); }
.type { display: inline-block; padding: 8rpx 18rpx; border-radius: 999rpx; background: #eff6ff; color: #2563eb; font-size: 24rpx; font-weight: 700; }
.stem { display: block; margin-top: 24rpx; color: #0f172a; font-size: 34rpx; line-height: 1.6; font-weight: 700; }
.answer-box { margin-top: 24rpx; padding: 24rpx; border-radius: 20rpx; background: #f8fafc; }
.answer-box.correct { background: #ecfdf5; }
.label { display: block; color: #64748b; font-size: 24rpx; font-weight: 600; }
.value { display: block; margin-top: 8rpx; color: #0f172a; font-size: 30rpx; font-weight: 700; }
.analysis { margin-top: 24rpx; padding: 24rpx; border-radius: 20rpx; background: #fff7ed; }
.analysis-text { display: block; margin-top: 12rpx; color: #334155; font-size: 28rpx; line-height: 1.6; }
.button { margin-top: 24rpx; min-height: 88rpx; border-radius: 20rpx; background: #2563eb; color: #ffffff; font-size: 30rpx; }
.button.secondary { background: #0f172a; }
.button.ghost { background: #e2e8f0; color: #0f172a; }
.state { padding: 48rpx 24rpx; border-radius: 24rpx; background: #ffffff; color: #64748b; text-align: center; }
</style>
