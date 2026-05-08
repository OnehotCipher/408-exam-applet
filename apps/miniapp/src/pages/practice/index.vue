<template>
  <view class="page">
    <view v-if="loading" class="state">题目加载中...</view>
    <view v-else-if="!currentQuestion" class="state">当前章节暂无题目</view>
    <view v-else class="question-card">
      <view class="meta">
        <text>第 {{ currentIndex + 1 }} / {{ questions.length }} 题</text>
        <text>{{ currentQuestion.type === 'multiple_choice' ? '多选题' : '单选题' }}</text>
      </view>
      <text class="stem">{{ currentQuestion.stem }}</text>
      <view class="options">
        <view v-for="option in currentQuestion.options" :key="option.key" class="option" :class="{ selected: selectedAnswers.includes(option.key) }" @tap="toggleOption(option.key)">
          <text class="option-key">{{ option.key }}</text>
          <text class="option-text">{{ option.text }}</text>
        </view>
      </view>
      <button class="submit" :disabled="submitting || selectedAnswers.length === 0" @tap="submitCurrentAnswer">提交答案</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { computed, ref } from 'vue';
import type { Question } from '@study408/shared';
import { submitAnswer } from '../../services/answer.service';
import { getQuestionList } from '../../services/question.service';

const subjectId = ref('');
const chapterId = ref('');
const questions = ref<Question[]>([]);
const currentIndex = ref(0);
const selectedAnswers = ref<string[]>([]);
const loading = ref(false);
const submitting = ref(false);
const startedAt = ref(Date.now());
const currentQuestion = computed(() => questions.value[currentIndex.value]);

async function loadQuestions() {
  loading.value = true;
  try {
    const result = await getQuestionList(uniCloud, { subjectId: subjectId.value, chapterId: chapterId.value, page: 1, pageSize: 50 });
    questions.value = result.items;
    currentIndex.value = 0;
    selectedAnswers.value = [];
    startedAt.value = Date.now();
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '加载题目失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

function toggleOption(key: string) {
  const question = currentQuestion.value;
  if (!question) return;
  if (question.type === 'single_choice') {
    selectedAnswers.value = [key];
    return;
  }
  selectedAnswers.value = selectedAnswers.value.includes(key)
    ? selectedAnswers.value.filter((item) => item !== key)
    : [...selectedAnswers.value, key].sort();
}

async function submitCurrentAnswer() {
  const question = currentQuestion.value;
  if (!question || selectedAnswers.value.length === 0) return;
  submitting.value = true;
  try {
    const durationSeconds = Math.max(Math.round((Date.now() - startedAt.value) / 1000), 1);
    await submitAnswer(uniCloud, { questionId: question._id, userAnswer: selectedAnswers.value, durationSeconds });
    uni.navigateTo({ url: `/pages/analysis/index?questionId=${question._id}&userAnswer=${encodeURIComponent(selectedAnswers.value.join(','))}` });
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '提交失败', icon: 'none' });
  } finally {
    submitting.value = false;
  }
}

onLoad((options) => {
  subjectId.value = String(options?.subjectId || '');
  chapterId.value = String(options?.chapterId || '');
  loadQuestions();
});
</script>

<style scoped>
.page { min-height: 100vh; padding: 32rpx; background: #f6f7fb; box-sizing: border-box; }
.question-card { padding: 32rpx; border-radius: 28rpx; background: #ffffff; box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.06); }
.meta { display: flex; justify-content: space-between; color: #2563eb; font-size: 24rpx; font-weight: 600; }
.stem { display: block; margin-top: 24rpx; color: #0f172a; font-size: 34rpx; line-height: 1.6; font-weight: 700; }
.options { margin-top: 28rpx; display: grid; gap: 18rpx; }
.option { display: flex; gap: 20rpx; align-items: flex-start; min-height: 72rpx; padding: 24rpx; border: 2rpx solid #e2e8f0; border-radius: 20rpx; background: #ffffff; }
.option.selected { border-color: #2563eb; background: #eff6ff; }
.option-key { display: flex; align-items: center; justify-content: center; width: 44rpx; height: 44rpx; border-radius: 50%; background: #e2e8f0; color: #0f172a; font-weight: 700; }
.option.selected .option-key { background: #2563eb; color: #ffffff; }
.option-text { flex: 1; color: #334155; font-size: 28rpx; line-height: 1.5; }
.submit { margin-top: 32rpx; min-height: 88rpx; border-radius: 20rpx; background: #2563eb; color: #ffffff; font-size: 30rpx; }
.submit[disabled] { background: #94a3b8; color: #ffffff; }
.state { padding: 48rpx 24rpx; border-radius: 24rpx; background: #ffffff; color: #64748b; text-align: center; }
</style>
