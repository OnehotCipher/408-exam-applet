<template>
  <view class="page">
    <view class="section-head">
      <text class="title">错题本</text>
      <text class="desc">持续复盘未掌握题目，并更新复盘状态。</text>
    </view>
    <view v-if="loading" class="state">错题加载中...</view>
    <view v-else-if="questions.length === 0" class="state">暂无错题记录</view>
    <view v-else class="list">
      <view v-for="question in questions" :key="question._id" class="card">
        <view @tap="openAnalysis(question._id)">
          <text class="type">{{ question.type === 'multiple_choice' ? '多选题' : '单选题' }}</text>
          <text class="stem">{{ question.stem }}</text>
        </view>
        <view class="status-row">
          <button v-for="status in statuses" :key="status" class="status-button" :class="{ active: statusOf(question._id) === status }" @tap="setStatus(question._id, status)">{{ statusLabel(status) }}</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { Question, WrongQuestionRecord, WrongQuestionStatus } from '@study408/shared';
import { getWrongQuestions, updateWrongQuestionStatus } from '../../services/wrong-question.service';

const questions = ref<Question[]>([]);
const records = ref<WrongQuestionRecord[]>([]);
const loading = ref(false);
const statuses: WrongQuestionStatus[] = ['unresolved', 'reviewing', 'resolved'];

function statusLabel(status: WrongQuestionStatus) {
  return { unresolved: '未掌握', reviewing: '复盘中', resolved: '已掌握' }[status];
}

function statusOf(questionId: string) {
  return records.value.find((record) => record.questionId === questionId)?.status;
}

async function loadWrongQuestions() {
  loading.value = true;
  try {
    const result = await getWrongQuestions(uniCloud, { page: 1, pageSize: 50 });
    questions.value = result.items;
    records.value = result.wrongRecords;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '加载错题失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

async function setStatus(questionId: string, status: WrongQuestionStatus) {
  try {
    await updateWrongQuestionStatus(uniCloud, { questionId, status });
    records.value = records.value.map((record) => (record.questionId === questionId ? { ...record, status } : record));
    uni.showToast({ title: '状态已更新', icon: 'none' });
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '更新失败', icon: 'none' });
  }
}

function openAnalysis(questionId: string) {
  uni.navigateTo({ url: `/pages/analysis/index?questionId=${questionId}` });
}

onLoad(loadWrongQuestions);
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
.status-row { margin-top: 22rpx; display: flex; gap: 12rpx; }
.status-button { flex: 1; min-height: 72rpx; border-radius: 16rpx; background: #e2e8f0; color: #0f172a; font-size: 24rpx; }
.status-button.active { background: #2563eb; color: #ffffff; }
.state { padding: 48rpx 24rpx; border-radius: 24rpx; background: #ffffff; color: #64748b; text-align: center; }
</style>
