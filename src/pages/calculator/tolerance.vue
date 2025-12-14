<template>
  <view class="container">
    <!-- 容错类型选择 -->
    <view class="mode-selector">
      <view 
        class="mode-item" 
        :class="{ active: mode === 'rating' }"
        @click="switchMode('rating')"
      >
        <text class="mode-text">评级容错</text>
      </view>
      <view 
        class="mode-item" 
        :class="{ active: mode === 'score' }"
        @click="switchMode('score')"
      >
        <text class="mode-text">分数容错</text>
      </view>
      <view 
        class="mode-item" 
        :class="{ active: mode === 'ptt' }"
        @click="switchMode('ptt')"
      >
        <text class="mode-text">PTT容错</text>
      </view>
    </view>

    <!-- 歌曲选择区域 -->
    <view class="card song-selector">
      <view class="card-header">
        <text class="card-title">选择歌曲</text>
      </view>
      <view class="song-info" @click="goToSongList">
        <text class="song-name" v-if="selectedSong.name">{{ selectedSong.name }}</text>
        <text class="song-placeholder" v-else>点击选择歌曲</text>
        <text class="song-difficulty" v-if="selectedSong.constant">
          {{ getDifficultyText(selectedSong.difficulty) }} ({{ selectedSong.constant }})
        </text>
      </view>
    </view>

    <!-- 容错计算表单 -->
    <view class="card tolerance-form">
      <view class="card-header">
        <text class="card-title">{{ getFormTitle() }}</text>
      </view>
      
      <!-- 评级容错 -->
      <view v-if="mode === 'rating'">
        <view class="form-item">
          <text class="form-label">选择评级</text>
          <picker 
            :range="ratingOptions" 
            range-key="name"
            :value="ratingIndex"
            @change="onRatingChange"
            class="picker"
          >
            <view class="picker-text">
              {{ ratingOptions[ratingIndex].name }}
            </view>
          </picker>
        </view>
        <view class="form-item">
          <text class="form-label">Pure数量</text>
          <input 
            class="form-input" 
            type="number" 
            v-model="pureCount" 
            placeholder="0-1000"
          />
        </view>
        <view class="form-item">
          <text class="form-label">Far数量</text>
          <input 
            class="form-input" 
            type="number" 
            v-model="farCount" 
            placeholder="自动计算或手动输入"
          />
        </view>
      </view>
      
      <!-- 分数容错 -->
      <view v-if="mode === 'score'">
        <view class="form-item">
          <text class="form-label">目标分数 (0-10,000,000)</text>
          <input 
            class="form-input" 
            type="number" 
            v-model="targetScore" 
            placeholder="例如: 9900000"
          />
        </view>
        <view class="form-item">
          <text class="form-label">当前Pure数量</text>
          <input 
            class="form-input" 
            type="number" 
            v-model="currentPure" 
            placeholder="0-1000"
          />
        </view>
      </view>
      
      <!-- PTT容错 -->
      <view v-if="mode === 'ptt'">
        <view class="form-item">
          <text class="form-label">目标PTT</text>
          <input 
            class="form-input" 
            type="digit" 
            v-model="targetPtt" 
            placeholder="例如: 12.50"
          />
        </view>
        <view class="form-item">
          <text class="form-label">当前Pure数量</text>
          <input 
            class="form-input" 
            type="number" 
            v-model="currentPttPure" 
            placeholder="0-1000"
          />
        </view>
      </view>
      
      <!-- 计算按钮 -->
      <button 
        class="calculate-btn" 
        @click="calculate"
        :disabled="!canCalculate"
      >
        计算容错
      </button>
    </view>

    <!-- 计算结果 -->
    <view class="card result-card" v-if="result">
      <view class="card-header">
        <text class="card-title">容错结果</text>
      </view>
      
      <!-- 评级容错结果 -->
      <view v-if="mode === 'rating'" class="result-content">
        <view class="result-item">
          <text class="result-label">评级</text>
          <text class="result-value rating" :class="getRatingClass(ratingOptions[ratingIndex].name)">
            {{ ratingOptions[ratingIndex].name }}
          </text>
        </view>
        <view class="result-item">
          <text class="result-label">分数范围</text>
          <text class="result-value">{{ formatScoreRange(result.minScore, result.maxScore) }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">最大Far数量</text>
          <text class="result-value highlight">{{ result.maxFarCount }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">剩余Lost数量</text>
          <text class="result-value">{{ result.remainingLost }}</text>
        </view>
      </view>
      
      <!-- 分数容错结果 -->
      <view v-if="mode === 'score'" class="result-content">
        <view class="result-item">
          <text class="result-label">目标分数</text>
          <text class="result-value">{{ result.targetScore.toLocaleString() }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">当前分数</text>
          <text class="result-value">{{ result.currentScore.toLocaleString() }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">差距</text>
          <text class="result-value highlight">{{ result.scoreGap.toLocaleString() }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">可Far数量</text>
          <text class="result-value">{{ result.tolerableFar }}</text>
        </view>
      </view>
      
      <!-- PTT容错结果 -->
      <view v-if="mode === 'ptt'" class="result-content">
        <view class="result-item">
          <text class="result-label">目标PTT</text>
          <text class="result-value">{{ result.targetPtt.toFixed(2) }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">当前PTT</text>
          <text class="result-value">{{ result.currentPtt.toFixed(2) }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">PTT差距</text>
          <text class="result-value highlight">{{ result.pttGap.toFixed(2) }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">可Far数量</text>
          <text class="result-value">{{ result.tolerableFar }}</text>
        </view>
      </view>
    </view>

    <!-- 容错说明 -->
    <view class="card formula-card">
      <view class="card-header">
        <text class="card-title">容错计算说明</text>
      </view>
      <view class="explanation">
        <text class="explanation-text">
          容错计算基于Arcaea的评分系统：每个Pure获得100分，每个Far获得50分，每个Lost获得0分。
          总分 = Pure数量 × 100 + Far数量 × 50。
        </text>
        <view class="calculation-tips">
          <text class="tip-title">容错计算公式：</text>
          <text class="tip-item">• 容错Far数量 = (总分 - 目标分数) ÷ 50</text>
          <text class="tip-item">• 纯分数制：分数越高，容错Far数量越少</text>
          <text class="tip-item">• PTT制：PTT越高，容错Far数量越少</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 容错模式
const mode = ref<'rating' | 'score' | 'ptt'>('rating')

// 选中的歌曲
const selectedSong = ref<any>({})

// 评级选项
const ratingOptions = [
  { name: 'PM', minScore: 10000000 },
  { name: 'EX+', minScore: 9900000 },
  { name: 'EX', minScore: 9800000 },
  { name: 'AA', minScore: 9500000 },
  { name: 'A', minScore: 9200000 },
  { name: 'B', minScore: 8900000 },
  { name: 'C', minScore: 8600000 },
  { name: 'D', minScore: 0 }
]
const ratingIndex = ref(1) // 默认选择EX+

// 输入值
const pureCount = ref('1000')
const farCount = ref('')
const targetScore = ref('')
const currentPure = ref('')
const targetPtt = ref('')
const currentPttPure = ref('')

// 计算结果
const result = ref<any>(null)

// 是否可以计算
const canCalculate = computed(() => {
  if (!selectedSong.value.constant) return false
  
  if (mode.value === 'rating') {
    return pureCount.value !== '' && !isNaN(parseInt(pureCount.value))
  } else if (mode.value === 'score') {
    return targetScore.value !== '' && 
           currentPure.value !== '' && 
           !isNaN(parseInt(targetScore.value)) && 
           !isNaN(parseInt(currentPure.value))
  } else if (mode.value === 'ptt') {
    return targetPtt.value !== '' && 
           currentPttPure.value !== '' && 
           !isNaN(parseFloat(targetPtt.value)) && 
           !isNaN(parseInt(currentPttPure.value))
  }
  
  return false
})

// 页面加载时获取可能的歌曲选择
onMounted(() => {
  // 从存储中获取最近使用的歌曲
  const recentSong = uni.getStorageSync('recent_song')
  if (recentSong) {
    selectedSong.value = recentSong
  }
})

// 切换模式
const switchMode = (newMode: 'rating' | 'score' | 'ptt') => {
  mode.value = newMode
  result.value = null
}

// 跳转到歌曲列表
const goToSongList = () => {
  uni.navigateTo({
    url: '/pages/songs/songs?from=tolerance'
  })
}

// 获取表单标题
const getFormTitle = () => {
  const titleMap = {
    'rating': '评级容错计算',
    'score': '分数容错计算',
    'ptt': 'PTT容错计算'
  }
  return titleMap[mode.value]
}

// 评级选择变化
const onRatingChange = (e: any) => {
  ratingIndex.value = e.detail.value
}

// 计算容错
const calculate = () => {
  const totalNotes = 1200 // 假设总Note数为1200，实际应用中应该从歌曲数据获取
  
  if (mode.value === 'rating') {
    // 评级容错计算
    const pure = parseInt(pureCount.value)
    const targetRating = ratingOptions[ratingIndex.value]
    const minScore = targetRating.minScore
    
    // 计算当前分数
    const currentScore = pure * 100
    
    if (currentScore < minScore) {
      uni.showToast({
        title: 'Pure数量不足以达成目标评级',
        icon: 'none'
      })
      return
    }
    
    // 计算最大Far数量
    const maxFarCount = Math.floor((currentScore - minScore) / 50)
    
    // 计算剩余Lost数量
    const remainingLost = Math.max(0, totalNotes - pure - maxFarCount)
    
    result.value = {
      minScore,
      maxScore: pure * 100 + maxFarCount * 50,
      maxFarCount,
      remainingLost
    }
    
    // 自动填充Far数量
    if (!farCount.value) {
      farCount.value = maxFarCount.toString()
    }
    
  } else if (mode.value === 'score') {
    // 分数容错计算
    const target = parseInt(targetScore.value)
    const current = parseInt(currentPure.value)
    
    if (current * 100 < target) {
      uni.showToast({
        title: 'Pure数量不足以达成目标分数',
        icon: 'none'
      })
      return
    }
    
    const currentScore = current * 100
    const scoreGap = currentScore - target
    const tolerableFar = Math.floor(scoreGap / 50)
    
    result.value = {
      targetScore: target,
      currentScore,
      scoreGap,
      tolerableFar
    }
    
  } else if (mode.value === 'ptt') {
    // PTT容错计算
    const target = parseFloat(targetPtt.value)
    const current = parseInt(currentPttPure.value)
    const constant = selectedSong.value.constant
    
    // 计算目标分数
    let targetScore: number
    
    const targetPttAboveConstant = target - constant
    
    if (targetPttAboveConstant >= 2.0) {
      targetScore = 10000000
    } else if (targetPttAboveConstant >= 1.5) {
      targetScore = Math.floor(9900000 + (targetPttAboveConstant - 1.5) * 100000)
    } else if (targetPttAboveConstant >= 1.0) {
      targetScore = Math.floor(9800000 + (targetPttAboveConstant - 1.0) * 400000)
    } else if (targetPttAboveConstant >= 0) {
      targetScore = Math.floor(9500000 + targetPttAboveConstant * 300000)
    } else {
      targetScore = Math.floor(9500000 + targetPttAboveConstant * 300000)
    }
    
    // 计算当前PTT
    const currentScore = current * 100
    let currentPtt: number
    
    if (currentScore >= 10000000) {
      currentPtt = constant + 2.0
    } else if (currentScore >= 9900000) {
      currentPtt = constant + 1.5 + (currentScore - 9900000) / 100000
    } else if (currentScore >= 9800000) {
      currentPtt = constant + 1.0 + (currentScore - 9800000) / 400000
    } else {
      currentPtt = constant + Math.max(0, (currentScore - 9500000) / 300000)
    }
    
    if (currentScore < targetScore) {
      uni.showToast({
        title: 'Pure数量不足以达成目标PTT',
        icon: 'none'
      })
      return
    }
    
    const scoreGap = currentScore - targetScore
    const tolerableFar = Math.floor(scoreGap / 50)
    
    result.value = {
      targetPtt: target,
      currentPtt,
      pttGap: currentPtt - target,
      tolerableFar
    }
  }
}

// 格式化分数范围
const formatScoreRange = (min: number, max: number) => {
  return `${min.toLocaleString()} - ${max.toLocaleString()}`
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

// 获取难度文本
const getDifficultyText = (difficulty: string): string => {
  const difficultyMap: Record<string, string> = {
    'pst': 'PAST',
    'prs': 'PRESENT',
    'ftr': 'FUTURE',
    'byd': 'BEYOND',
    'etr': 'ETERNAL'
  }
  return difficultyMap[difficulty] || difficulty.toUpperCase()
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.mode-selector {
  display: flex;
  background: white;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.mode-item {
  flex: 1;
  padding: 24rpx 10rpx;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.mode-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.mode-text {
  font-size: 24rpx;
  font-weight: bold;
  color: #666;
  transition: color 0.3s ease;
}

.mode-item.active .mode-text {
  color: white;
}

.card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 24rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.song-info {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.song-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.song-placeholder {
  font-size: 32rpx;
  color: #999;
}

.song-difficulty {
  font-size: 26rpx;
  color: #667eea;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
}

.form-input {
  width: 100%;
  height: 88rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 0 30rpx;
  font-size: 32rpx;
  color: #333;
  box-sizing: border-box;
}

.picker {
  width: 100%;
  height: 88rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.picker-text {
  font-size: 32rpx;
  color: #333;
}

.calculate-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 44rpx;
  color: white;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.calculate-btn[disabled] {
  opacity: 0.5;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 24rpx;
}

.result-label {
  font-size: 28rpx;
  color: #666;
}

.result-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.result-value.highlight {
  color: #667eea;
  font-size: 36rpx;
}

.rating {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

.rating-pm {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
}

.rating-ex-plus {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.rating-ex {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.rating-aa {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #333;
}

.rating-a {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
  color: white;
}

.rating-b {
  background: #ffc107;
  color: #333;
}

.rating-c {
  background: #ff9800;
  color: white;
}

.rating-d {
  background: #f44336;
  color: white;
}

.explanation {
  font-size: 26rpx;
  line-height: 1.6;
  color: #666;
}

.calculation-tips {
  margin-top: 20rpx;
}

.tip-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.tip-item {
  display: block;
  margin-bottom: 8rpx;
  color: #666;
}
</style>