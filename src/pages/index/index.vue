<template>
  <view class="container">
    <!-- 顶部横幅 -->
    <view class="header">
      <text class="title">Arcaea PTT计算器</text>
      <text class="subtitle">专业、准确、便捷</text>
    </view>

    <!-- PTT概览卡片 -->
    <view class="card overview-card">
      <view class="card-header">
        <text class="card-title">PTT概览</text>
      </view>
      <view class="ptt-overview">
        <view class="ptt-value">
          <text class="value">{{ currentPTT.toFixed(2) }}</text>
          <text class="label">当前PTT</text>
        </view>
        <view class="ptt-divider"></view>
        <view class="ptt-stat">
          <view class="stat-item">
            <text class="stat-value">{{ best10Avg.toFixed(2) }}</text>
            <text class="stat-label">B10平均</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ best30Avg.toFixed(2) }}</text>
            <text class="stat-label">B30平均</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ recent10Avg.toFixed(2) }}</text>
            <text class="stat-label">R10平均</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷功能 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">快捷功能</text>
      </view>
      <view class="functions">
        <view class="function-item" @click="goToCalculator">
          <text class="function-icon">🧮</text>
          <text class="function-name">成绩↔PTT</text>
          <text class="function-desc">成绩与PTT双向转换</text>
        </view>
        <view class="function-item" @click="goToTolerance">
          <text class="function-icon">⚖️</text>
          <text class="function-name">容错计算</text>
          <text class="function-desc">计算评级容错数</text>
        </view>
        <view class="function-item" @click="goToBest30">
          <text class="function-icon">📋</text>
          <text class="function-name">B30管理</text>
          <text class="function-desc">管理最佳30次成绩</text>
        </view>
        <view class="function-item" @click="goToSongs">
          <text class="function-icon">🎵</text>
          <text class="function-name">歌曲列表</text>
          <text class="function-desc">浏览歌曲和定数</text>
        </view>
      </view>
    </view>

    <!-- 最近成绩 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">最近成绩</text>
        <text class="card-action" @click="goToData">查看全部</text>
      </view>
      <view class="recent-scores">
        <view class="score-item" v-for="(score, index) in recentScores" :key="index">
          <view class="score-info">
            <text class="song-name">{{ score.songName }}</text>
            <text class="song-difficulty">{{ getDifficultyText(score.difficulty) }}</text>
          </view>
          <view class="score-value">
            <text class="score-text">{{ score.score }}</text>
            <text class="score-ptt">PTT: {{ score.ptt.toFixed(2) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部信息 -->
    <view class="footer">
      <text class="footer-text">版本 1.0.0</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// PTT数据
const currentPTT = ref(11.23)
const best10Avg = ref(12.45)
const best30Avg = ref(11.78)
const recent10Avg = ref(10.56)

// 最近成绩
const recentScores = ref([
  {
    songName: 'Testify',
    difficulty: 'byd',
    score: 10000000,
    ptt: 13.0
  },
  {
    songName: 'Fracture Ray',
    difficulty: 'ftr',
    score: 9985000,
    ptt: 11.98
  },
  {
    songName: 'Ringed Genesis',
    difficulty: 'ftr',
    score: 9920000,
    ptt: 11.6
  }
])

// 页面加载时从本地存储获取数据
onMounted(() => {
  loadDataFromStorage()
})

// 从本地存储加载数据
const loadDataFromStorage = () => {
  try {
    const pttData = uni.getStorageSync('ptt_data')
    if (pttData) {
      currentPTT.value = pttData.currentPTT || 0
      best10Avg.value = pttData.best10Avg || 0
      best30Avg.value = pttData.best30Avg || 0
      recent10Avg.value = pttData.recent10Avg || 0
    }

    const recentData = uni.getStorageSync('recent_scores')
    if (recentData && Array.isArray(recentData)) {
      recentScores.value = recentData.slice(0, 3) // 只显示最近3条
    }
  } catch (e) {
    console.error('加载数据失败', e)
  }
}

// 获取难度文本
const getDifficultyText = (difficulty: string) => {
  const difficultyMap: Record<string, string> = {
    'pst': 'PAST',
    'prs': 'PRESENT',
    'ftr': 'FUTURE',
    'byd': 'BEYOND',
    'etr': 'ETERNAL'
  }
  return difficultyMap[difficulty] || difficulty.toUpperCase()
}

// 跳转到成绩PTT转换页面
const goToCalculator = () => {
  uni.switchTab({
    url: '/pages/calculator/score-ptt'
  })
}

// 跳转到容错计算页面
const goToTolerance = () => {
  uni.navigateTo({
    url: '/pages/calculator/tolerance'
  })
}

// 跳转到B30管理页面
const goToBest30 = () => {
  uni.switchTab({
    url: '/pages/best30/best30'
  })
}

// 跳转到歌曲列表页面
const goToSongs = () => {
  uni.navigateTo({
    url: '/pages/songs/songs'
  })
}

// 跳转到数据管理页面
const goToData = () => {
  uni.switchTab({
    url: '/pages/data/data'
  })
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  padding: 40rpx 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}

.title {
  font-size: 44rpx;
  font-weight: bold;
  color: white;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.card-action {
  font-size: 26rpx;
  color: #667eea;
}

.overview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.overview-card .card-title {
  color: white;
}

.ptt-overview {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ptt-value {
  text-align: center;
  flex: 1;
}

.value {
  font-size: 60rpx;
  font-weight: bold;
  display: block;
  line-height: 1.2;
}

.label {
  font-size: 24rpx;
  opacity: 0.8;
}

.ptt-divider {
  width: 2rpx;
  height: 100rpx;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 0 20rpx;
}

.ptt-stat {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  flex: 2;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-value {
  font-size: 32rpx;
  font-weight: bold;
}

.stat-label {
  font-size: 24rpx;
  opacity: 0.8;
}

.functions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20rpx;
}

.function-item {
  width: calc(50% - 10rpx);
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.function-icon {
  font-size: 40rpx;
  margin-bottom: 16rpx;
}

.function-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.function-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

.recent-scores {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
}

.score-info {
  display: flex;
  flex-direction: column;
}

.song-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.song-difficulty {
  font-size: 24rpx;
  color: #666;
}

.score-value {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.score-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.score-ptt {
  font-size: 24rpx;
  color: #667eea;
}

.footer {
  text-align: center;
  padding: 40rpx 0 20rpx;
}

.footer-text {
  font-size: 24rpx;
  color: #999;
}
</style>