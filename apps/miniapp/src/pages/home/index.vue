<template>
  <view class="page">
    <view class="hero">
      <text class="eyebrow">408 客观题训练</text>
      <text class="title">用闭环刷题提升掌握度</text>
      <text class="desc">按科目和章节练习，提交后查看解析，并持续沉淀错题、收藏与统计。</text>
    </view>
    <view class="grid">
      <navigator class="card primary" url="/pages/subjects/index">
        <text class="card-title">开始刷题</text>
        <text class="card-desc">选择科目与章节</text>
      </navigator>
      <navigator class="card" url="/pages/wrong-questions/index">
        <text class="card-title">错题本</text>
        <text class="card-desc">复盘未掌握题目</text>
      </navigator>
      <navigator class="card" url="/pages/favorites/index">
        <text class="card-title">我的收藏</text>
        <text class="card-desc">回看重点题目</text>
      </navigator>
      <navigator class="card" url="/pages/stats/index">
        <text class="card-title">练习统计</text>
        <text class="card-desc">查看正确率变化</text>
      </navigator>
    </view>
  </view>
</template>

<style scoped>
.page { min-height: 100vh; padding: 32rpx; background: #f6f7fb; box-sizing: border-box; }
.hero { padding: 36rpx; border-radius: 28rpx; background: linear-gradient(135deg, #2563eb, #14b8a6); color: #ffffff; }
.eyebrow { display: block; font-size: 24rpx; opacity: 0.9; }
.title { display: block; margin-top: 16rpx; font-size: 44rpx; line-height: 1.3; font-weight: 700; }
.desc { display: block; margin-top: 20rpx; font-size: 28rpx; line-height: 1.6; opacity: 0.92; }
.grid { margin-top: 28rpx; display: grid; gap: 24rpx; }
.card { display: block; min-height: 96rpx; padding: 28rpx; border-radius: 24rpx; background: #ffffff; box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.06); }
.card.primary { background: #eff6ff; }
.card-title { display: block; color: #0f172a; font-size: 32rpx; font-weight: 700; }
.card-desc { display: block; margin-top: 8rpx; color: #64748b; font-size: 26rpx; }
</style>
