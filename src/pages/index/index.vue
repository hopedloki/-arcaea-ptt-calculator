<template>
  <view class="container">
    <!-- 顶部横幅 -->
    <view class="header">
      <view class="header-content">
        <text class="title">Arcaea PTT计算器</text>
        <text class="subtitle">专业、准确、便捷</text>
      </view>
      <view class="header-decoration"></view>
    </view>

    <!-- PTT概览卡片 -->
    <view class="card overview-card">
      <view class="card-header">
        <text class="card-title">PTT概览</text>
        <view class="refresh-icon" @click="loadDataFromStorage">
          <text class="icon">🔄</text>
        </view>
      </view>
      <view class="ptt-overview">
        <view class="ptt-value">
          <text class="value">{{ currentPTT.toFixed(2) }}</text>
          <text class="label">当前PTT</text>
          <view class="ptt-progress" :style="{ width: getPTTProgress() + '%' }"></view>
        </view>
        <view class="ptt-divider"></view>
        <view class="ptt-stat">
          <view class="stat-item">
            <view class="stat-content">
              <text class="stat-value">{{ best10Avg.toFixed(2) }}</text>
              <text class="stat-label">B10平均</text>
            </view>
            <view class="stat-progress" :style="{ width: getStatProgress(best10Avg) + '%' }"></view>
          </view>
          <view class="stat-item">
            <view class="stat-content">
              <text class="stat-value">{{ best30Avg.toFixed(2) }}</text>
              <text class="stat-label">B30平均</text>
            </view>
            <view class="stat-progress" :style="{ width: getStatProgress(best30Avg) + '%' }"></view>
          </view>
          <view class="stat-item">
            <view class="stat-content">
              <text class="stat-value">{{ recent10Avg.toFixed(2) }}</text>
              <text class="stat-label">R10平均</text>
            </view>
            <view class="stat-progress" :style="{ width: getStatProgress(recent10Avg) + '%' }"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷功能 -->
    <view class="card function-card">
      <view class="card-header">
        <text class="card-title">快捷功能</text>
        <view class="function-grid-icon">🎯</view>
      </view>
      <view class="functions">
        <view class="function-item calculator" @click="goToCalculator">
          <view class="function-icon-container">
            <text class="function-icon">🧮</text>
          </view>
          <text class="function-name">成绩↔PTT</text>
          <text class="function-desc">成绩与PTT双向转换</text>
          <view class="function-arrow">→</view>
        </view>
        <view class="function-item tolerance" @click="goToTolerance">
          <view class="function-icon-container">
            <text class="function-icon">⚖️</text>
          </view>
          <text class="function-name">容错计算</text>
          <text class="function-desc">计算评级容错数</text>
          <view class="function-arrow">→</view>
        </view>
        <view class="function-item best30" @click="goToBest30">
          <view class="function-icon-container">
            <text class="function-icon">📋</text>
          </view>
          <text class="function-name">B30管理</text>
          <text class="function-desc">管理最佳30次成绩</text>
          <view class="function-arrow">→</view>
        </view>
        <view class="function-item songs" @click="goToSongs">
          <view class="function-icon-container">
            <text class="function-icon">🎵</text>
          </view>
          <text class="function-name">歌曲列表</text>
          <text class="function-desc">浏览歌曲和定数</text>
          <view class="function-arrow">→</view>
        </view>
      </view>
    </view>

    <!-- 最近成绩 -->
    <view class="card recent-score-card">
      <view class="card-header">
        <text class="card-title">最近成绩</text>
        <text class="card-action" @click="goToData">查看全部 →</text>
      </view>
      <view class="recent-scores" v-if="recentScores.length > 0">
        <view class="score-item" 
          v-for="(score, index) in recentScores" 
          :key="index"
          :style="{ animationDelay: (index * 0.1) + 's' }"
        >
          <view class="score-info">
            <text class="song-name">{{ score.songName }}</text>
            <view class="song-meta">
              <text class="song-difficulty" :class="getDifficultyClass(score.difficulty)">
                {{ getDifficultyText(score.difficulty) }}
              </text>
              <text class="song-constant" v-if="score.constant">{{ score.constant }}</text>
            </view>
          </view>
          <view class="score-value">
            <text class="score-text">{{ formatScore(score.score) }}</text>
            <text class="score-ptt">PTT: {{ score.ptt.toFixed(2) }}</text>
            <text class="score-rating" :class="getRatingClass(score.rating || getRating(score.score))">
              {{ score.rating || getRating(score.score) }}
            </text>
          </view>
        </view>
      </view>
      <view v-else class="empty-scores">
        <view class="empty-icon">📊</view>
        <text class="empty-title">暂无成绩记录</text>
        <text class="empty-desc">点击成绩↔PTT开始记录您的成绩</text>
        <button class="empty-button" @click="goToCalculator">立即开始</button>
      </view>
    </view>

    <!-- 底部信息 -->
    <view class="footer">
      <text class="footer-text">版本 1.2.5</text>
      <view class="footer-decoration"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// PTT数据
const currentPTT = ref(0)
const best10Avg = ref(0)
const best30Avg = ref(0)
const recent10Avg = ref(0)

// 最近成绩
const recentScores = ref([])

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

// 获取难度样式类
const getDifficultyClass = (difficulty: string): string => {
  const difficultyMap: Record<string, string> = {
    'pst': 'difficulty-pst',
    'prs': 'difficulty-prs',
    'ftr': 'difficulty-ftr',
    'byd': 'difficulty-byd',
    'etr': 'difficulty-etr'
  }
  return difficultyMap[difficulty] || ''
}

// 根据成绩获取评级
const getRating = (score: number): string => {
  if (score >= 10000000) return 'PM'
  else if (score >= 9900000) return 'EX+'
  else if (score >= 9800000) return 'EX'
  else if (score >= 9500000) return 'AA'
  else if (score >= 9200000) return 'A'
  else if (score >= 8900000) return 'B'
  else if (score >= 8600000) return 'C'
  else return 'D'
}

// 获取评级样式类
const getRatingClass = (rating: string): string => {
  const ratingMap: Record<string, string> = {
    'PM': 'rating-pm',
    'EX+': 'rating-ex-plus',
    'EX': 'rating-ex',
    'AA': 'rating-aa',
    'A': 'rating-a',
    'B': 'rating-b',
    'C': 'rating-c',
    'D': 'rating-d'
  }
  return ratingMap[rating] || ''
}

// 格式化成绩显示
const formatScore = (score: number): string => {
  return score.toLocaleString()
}

// 获取PTT进度条百分比
const getPTTProgress = (): number => {
  const maxPTT = 15.0
  return Math.min((currentPTT.value / maxPTT) * 100, 100)
}

// 获取统计数据进度条百分比
const getStatProgress = (value: number): number => {
  const maxPTT = 15.0
  return Math.min((value / maxPTT) * 100, 100)
}

// 跳转到成绩PTT转换页面
const goToCalculator = () => {
  uni.navigateTo({
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
  uni.navigateTo({
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
  uni.navigateTo({
    url: '/pages/data/data'
  })
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f8f9fa;
  min-height: 100vh;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.4);
  animation: slideDown 0.8s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-30rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.header-content {
  text-align: center;
  padding: 50rpx 40rpx;
  position: relative;
  z-index: 1;
}

.header-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 200rpx;
  height: 200rpx;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 70%);
  border-radius: 50%;
  transform: translate(50rpx, -50rpx);
  z-index: 0;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: white;
  display: block;
  margin-bottom: 10rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
}

.card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  animation: slideUp 0.6s ease-out backwards;
  position: relative;
  overflow: hidden;
}

.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }
.card:nth-child(4) { animation-delay: 0.4s; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.card-action {
  font-size: 26rpx;
  color: #667eea;
  font-weight: 600;
  transition: color 0.3s ease;
}

.card-action:active {
  color: #5a6fd8;
}

/* PTT概览卡片样式增强 */
.overview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.overview-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 20rpx 20rpx;
  animation: backgroundMove 30s linear infinite;
  z-index: 0;
}

@keyframes backgroundMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(20rpx, 20rpx); }
}

.overview-card .card-title {
  color: white;
}

.refresh-icon {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-icon:active {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(0.95);
}

.refresh-icon .icon {
  font-size: 24rpx;
}

.ptt-overview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.ptt-value {
  text-align: center;
  flex: 1;
  position: relative;
}

.ptt-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2rpx;
  transition: width 1s ease;
}

.value {
  font-size: 60rpx;
  font-weight: bold;
  display: block;
  line-height: 1.2;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}

.label {
  font-size: 24rpx;
  opacity: 0.9;
  margin-top: 4rpx;
}

.ptt-divider {
  width: 2rpx;
  height: 120rpx;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 0 30rpx;
}

.ptt-stat {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  flex: 2;
}

.stat-item {
  position: relative;
  padding-bottom: 6rpx;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2rpx;
  transition: width 1s ease;
}

.stat-value {
  font-size: 32rpx;
  font-weight: bold;
}

.stat-label {
  font-size: 24rpx;
  opacity: 0.9;
}

/* 快捷功能卡片样式增强 */
.function-card {
  border: 2rpx solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.05);
}

.function-grid-icon {
  font-size: 28rpx;
  opacity: 0.8;
}

.functions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20rpx;
  width: 100%;
}

.function-item {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 30rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  border: 2rpx solid transparent;
  aspect-ratio: 1 / 0.8;
}

.function-item.calculator {
  border-color: rgba(102, 126, 234, 0.2);
}

.function-item.tolerance {
  border-color: rgba(255, 152, 0, 0.2);
}

.function-item.best30 {
  border-color: rgba(76, 175, 80, 0.2);
}

.function-item.songs {
  border-color: rgba(244, 67, 54, 0.2);
}

.function-item:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.function-icon-container {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 16rpx;
}

.calculator .function-icon-container {
  background: rgba(102, 126, 234, 0.1);
}

.tolerance .function-icon-container {
  background: rgba(255, 152, 0, 0.1);
}

.best30 .function-icon-container {
  background: rgba(76, 175, 80, 0.1);
}

.songs .function-icon-container {
  background: rgba(244, 67, 54, 0.1);
}

.function-icon {
  font-size: 36rpx;
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
  flex-grow: 1;
}

.function-arrow {
  position: absolute;
  top: 50%;
  right: 16rpx;
  transform: translateY(-50%);
  font-size: 24rpx;
  color: #ccc;
  transition: all 0.3s ease;
}

.function-item:active .function-arrow {
  transform: translateY(-50%) translateX(4rpx);
}

/* 最近成绩卡片样式增强 */
.recent-score-card {
  border: 2rpx solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.05);
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
  border-radius: 16rpx;
  padding: 24rpx;
  transition: all 0.3s ease;
  border-left: 4rpx solid #667eea;
  animation: fadeInRight 0.5s ease-out backwards;
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(20rpx); }
  to { opacity: 1; transform: translateX(0); }
}

.score-item:active {
  background: #f0f2f5;
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.score-info {
  display: flex;
  flex-direction: column;
}

.song-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  line-height: 1.2;
}

.song-meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.song-difficulty {
  font-size: 22rpx;
  color: white;
  padding: 4rpx 10rpx;
  border-radius: 10rpx;
  font-weight: 600;
}

/* 难度颜色 */
.difficulty-pst {
  background: rgba(76, 175, 80, 1);
}

.difficulty-prs {
  background: rgba(33, 150, 243, 1);
}

.difficulty-ftr {
  background: rgba(255, 152, 0, 1);
}

.difficulty-byd {
  background: rgba(244, 67, 54, 1);
}

.difficulty-etr {
  background: rgba(156, 39, 176, 1);
}

.song-constant {
  font-size: 22rpx;
  color: #666;
  background: #f0f0f0;
  padding: 4rpx 10rpx;
  border-radius: 10rpx;
}

.score-value {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
}

.score-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.score-ptt {
  font-size: 24rpx;
  color: #667eea;
}

.score-rating {
  font-size: 22rpx;
  font-weight: 600;
  padding: 4rpx 10rpx;
  border-radius: 10rpx;
  display: inline-block;
}

/* 评级颜色 */
.rating-pm {
  background: linear-gradient(135deg, #ff3366 0%, #ff6b9d 100%);
  color: white;
}

.rating-ex-plus {
  background: linear-gradient(135deg, #ff9a00 0%, #ffc947 100%);
  color: white;
}

.rating-ex {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: white;
}

.rating-aa {
  background: linear-gradient(135deg, #66ff66 0%, #00cc66 100%);
  color: white;
}

.rating-a {
  background: linear-gradient(135deg, #66ccff 0%, #3399ff 100%);
  color: white;
}

.rating-b {
  background: linear-gradient(135deg, #cc99ff 0%, #9966cc 100%);
  color: white;
}

.rating-c {
  background: linear-gradient(135deg, #ffcc99 0%, #ff9966 100%);
  color: white;
}

.rating-d {
  background: linear-gradient(135deg, #999999 0%, #666666 100%);
  color: white;
}

/* 空状态样式 */
.empty-scores {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60rpx 40rpx;
}

.empty-icon {
  font-size: 64rpx;
  margin-bottom: 20rpx;
  opacity: 0.6;
}

.empty-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  margin-bottom: 30rpx;
}

.empty-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 28rpx;
  font-weight: 600;
  padding: 16rpx 40rpx;
  border-radius: 30rpx;
  border: none;
}

.empty-button:active {
  transform: scale(0.98);
}

/* 底部信息样式增强 */
.footer {
  text-align: center;
  padding: 40rpx 0 20rpx;
  position: relative;
}

.footer-text {
  font-size: 24rpx;
  color: #999;
  position: relative;
  z-index: 1;
}

.footer-decoration {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100rpx;
  height: 4rpx;
  background: linear-gradient(90deg, transparent, #667eea, transparent);
  border-radius: 2rpx;
}

/* Web端特殊交互效果 */
/* #ifdef H5 */
@media (min-width: 768px) {
  .card {
    max-width: 800px;
    margin: 0 auto 20rpx;
  }
  
  .functions {
    max-width: 600px;
    margin: 0 auto;
  }
}

.function-item:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
}

.score-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}
/* #endif */

/* 移动端触摸反馈增强 */
/* #ifndef H5 */
.function-item:active {
  transform: scale(0.98);
}

.score-item:active {
  transform: scale(0.98);
}
/* #endif */
</style>