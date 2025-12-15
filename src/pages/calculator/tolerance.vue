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
            placeholder="0-1000"
          />
        </view>
        <view class="form-item">
          <text class="form-label">Lost数量</text>
          <input 
            class="form-input" 
            type="number" 
            v-model="lostCount" 
            placeholder="0-1000"
          />
        </view>
        <view class="form-item">
          <text class="form-label">大Pure数量（可选）</text>
          <input 
            class="form-input" 
            type="number" 
            v-model="bigPureCount" 
            placeholder="每个大Pure额外+1分"
          />
        </view>
        <view class="form-item">
          <text class="form-label">谱面Note总量</text>
          <input 
            class="form-input" 
            type="number" 
            v-model="totalNotes" 
            placeholder="歌曲的总Note数量"
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
          <text class="result-label">当前分数</text>
          <text class="result-value">{{ result.currentScore.toLocaleString() }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">目标分数</text>
          <text class="result-value">{{ result.minScore.toLocaleString() }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">最大Far数量</text>
          <text class="result-value highlight">{{ result.maxFarCount }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">最大Lost数量</text>
          <text class="result-value">{{ result.maxLostCount }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">是否达成</text>
          <text class="result-value" :class="result.canAchieve ? 'success' : 'failed'">
            {{ result.canAchieve ? '已达成' : '未达成' }}
          </text>
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
          <text class="result-value highlight">{{ result.tolerableFar }}</text>
        </view>
        <view class="result-item" v-if="result.tolerableLost !== undefined">
          <text class="result-label">可Lost数量</text>
          <text class="result-value">{{ result.tolerableLost }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">是否达成</text>
          <text class="result-value" :class="result.canAchieve ? 'success' : 'failed'">
            {{ result.canAchieve ? '已达成' : '未达成' }}
          </text>
        </view>
        <view class="result-item">
          <text class="result-label">是否达成</text>
          <text class="result-value" :class="result.canAchieve ? 'success' : 'failed'">
            {{ result.canAchieve ? '已达成' : '未达成' }}
          </text>
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
          <text class="result-value highlight">{{ result.tolerableFar }}</text>
        </view>
        <view class="result-item" v-if="result.tolerableLost !== undefined">
          <text class="result-label">可Lost数量</text>
          <text class="result-value">{{ result.tolerableLost }}</text>
        </view>
        <view class="result-item">
          <text class="result-label">是否达成</text>
          <text class="result-value" :class="result.canAchieve ? 'success' : 'failed'">
            {{ result.canAchieve ? '已达成' : '未达成' }}
          </text>
        </view>
        <view class="result-item">
          <text class="result-label">是否达成</text>
          <text class="result-value" :class="result.canAchieve ? 'success' : 'failed'">
            {{ result.canAchieve ? '已达成' : '未达成' }}
          </text>
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
          容错计算基于Arcaea的真实评分系统：
        </text>
        <view class="calculation-tips">
          <text class="tip-title">基本分计算：</text>
          <text class="tip-item">• 单个Note分数 = 10,000,000 ÷ 谱面Note总量</text>
          <text class="tip-item">• Pure获得完整分数，Far获得一半分数，Lost不得分</text>
          <text class="tip-item">• 基本分 = Pure数量×单Note分 + Far数量×(单Note分÷2)</text>
          
          <text class="tip-title">判定附加分：</text>
          <text class="tip-item">• 每个大Pure额外加1分，其他判定不加分</text>
          <text class="tip-item">• 附加分无上限，理论满分 = 10,000,000 + 谱面Note总量</text>
          
          <text class="tip-title">容错计算：</text>
          <text class="tip-item">• 根据目标评级/分数/PTT计算所需最低分数</text>
          <text class="tip-item">• 每个Far可换算为(单Note分÷2)的容错空间</text>
          <text class="tip-item">• 每个Lost可换算为单Note分的容错空间</text>
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
const farCount = ref('0')
const lostCount = ref('0')
const bigPureCount = ref('0')
const totalNotes = ref('1200')
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
  const notes = parseInt(totalNotes.value) || 1200
  
  if (mode.value === 'rating') {
    // 评级容错计算
    const pure = parseInt(pureCount.value) || 0
    const far = parseInt(farCount.value) || 0
    const lost = parseInt(lostCount.value) || 0
    const bigPure = parseInt(bigPureCount.value) || 0
    const targetRating = ratingOptions[ratingIndex.value]
    
    // 使用正确的评分系统计算
    const baseScorePerNote = 10000000 / notes
    const baseScore = pure * baseScorePerNote + far * (baseScorePerNote / 2)
    const bonusScore = bigPure // 每个大Pure额外+1分
    const currentScore = Math.floor(baseScore + bonusScore)
    
    // 计算达成目标评级所需的最多容错
    const targetScore = targetRating.minScore
    const scoreGap = currentScore - targetScore
    
    if (scoreGap >= 0) {
      // 已经达成目标，计算可以额外容错的判定数
      const maxAdditionalFar = Math.floor(scoreGap / (baseScorePerNote / 2))
      const maxAdditionalLost = Math.floor((scoreGap - maxAdditionalFar * (baseScorePerNote / 2)) / baseScorePerNote)
      
      // 检查容错数是否超过剩余Note数
      const remainingNotes = notes - pure - far
      const finalMaxLost = Math.min(maxAdditionalLost, remainingNotes)
      const finalMaxFar = far + maxAdditionalFar + (maxAdditionalLost - finalMaxLost)
      
      result.value = {
        minScore: targetScore,
        maxScore: currentScore,
        maxFarCount: finalMaxFar,
        maxLostCount: finalMaxLost,
        currentScore,
        canAchieve: true
      }
    } else {
      // 未达成目标，计算需要的判定改进
      const neededScore = -scoreGap
      const maxFarCount = Math.max(0, far - Math.ceil(neededScore / (baseScorePerNote / 2)))
      const remainingNeededScore = neededScore - (far - maxFarCount) * (baseScorePerNote / 2)
      const maxLostCount = Math.max(0, lost - Math.ceil(remainingNeededScore / baseScorePerNote))
      
      result.value = {
        minScore: targetScore,
        maxScore: currentScore,
        maxFarCount,
        maxLostCount,
        currentScore,
        canAchieve: false
      }
    }
    
  } else if (mode.value === 'score') {
    // 分数容错计算
    const target = parseInt(targetScore.value) || 0
    const pure = parseInt(currentPure.value) || 0
    const far = parseInt(farCount.value) || 0
    const lost = parseInt(lostCount.value) || 0
    const bigPure = parseInt(bigPureCount.value) || 0
    
    // 使用正确的评分系统计算
    const baseScorePerNote = 10000000 / notes
    const baseScore = pure * baseScorePerNote + far * (baseScorePerNote / 2)
    const bonusScore = bigPure // 每个大Pure额外+1分
    const currentScore = Math.floor(baseScore + bonusScore)
    
    const scoreGap = currentScore - target
    
    if (scoreGap >= 0) {
      // 已经达成目标，计算可以额外容错的判定数
      const maxAdditionalFar = Math.floor(scoreGap / (baseScorePerNote / 2))
      const maxAdditionalLost = Math.floor((scoreGap - maxAdditionalFar * (baseScorePerNote / 2)) / baseScorePerNote)
      
      // 检查容错数是否超过剩余Note数
      const remainingNotes = notes - pure - far
      const finalMaxLost = Math.min(maxAdditionalLost, remainingNotes)
      const finalMaxFar = far + maxAdditionalFar + (maxAdditionalLost - finalMaxLost)
      
      result.value = {
        targetScore: target,
        currentScore,
        scoreGap,
        tolerableFar: finalMaxFar,
        tolerableLost: finalMaxLost,
        canAchieve: true
      }
    } else {
      // 未达成目标，计算需要的判定改进
      const neededScore = -scoreGap
      const neededFarReduction = Math.ceil(neededScore / (baseScorePerNote / 2))
      const neededLostReduction = Math.ceil(Math.max(0, neededScore - neededFarReduction * (baseScorePerNote / 2)) / baseScorePerNote)
      
      result.value = {
        targetScore: target,
        currentScore,
        scoreGap,
        tolerableFar: Math.max(0, far - neededFarReduction),
        tolerableLost: Math.max(0, lost - neededLostReduction),
        canAchieve: false
      }
    }
    
  } else if (mode.value === 'ptt') {
    // PTT容错计算
    const target = parseFloat(targetPtt.value) || 0
    const pure = parseInt(currentPttPure.value) || 0
    const far = parseInt(farCount.value) || 0
    const lost = parseInt(lostCount.value) || 0
    const bigPure = parseInt(bigPureCount.value) || 0
    const constant = selectedSong.value.constant || 0
    
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
    
    // 使用正确的评分系统计算当前分数
    const baseScorePerNote = 10000000 / notes
    const baseScore = pure * baseScorePerNote + far * (baseScorePerNote / 2)
    const bonusScore = bigPure // 每个大Pure额外+1分
    const currentScore = Math.floor(baseScore + bonusScore)
    
    // 计算当前PTT
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
    
    const scoreGap = currentScore - targetScore
    
    if (scoreGap >= 0) {
      // 已经达成目标，计算可以额外容错的判定数
      const maxAdditionalFar = Math.floor(scoreGap / (baseScorePerNote / 2))
      const maxAdditionalLost = Math.floor((scoreGap - maxAdditionalFar * (baseScorePerNote / 2)) / baseScorePerNote)
      
      // 检查容错数是否超过剩余Note数
      const remainingNotes = notes - pure - far
      const finalMaxLost = Math.min(maxAdditionalLost, remainingNotes)
      const finalMaxFar = far + maxAdditionalFar + (maxAdditionalLost - finalMaxLost)
      
      result.value = {
        targetPtt: target,
        currentPtt,
        pttGap: currentPtt - target,
        tolerableFar: finalMaxFar,
        tolerableLost: finalMaxLost,
        canAchieve: true
      }
    } else {
      // 未达成目标，计算需要的判定改进
      const neededScore = -scoreGap
      const neededFarReduction = Math.ceil(neededScore / (baseScorePerNote / 2))
      const neededLostReduction = Math.ceil(Math.max(0, neededScore - neededFarReduction * (baseScorePerNote / 2)) / baseScorePerNote)
      
      result.value = {
        targetPtt: target,
        currentPtt,
        pttGap: currentPtt - target,
        tolerableFar: Math.max(0, far - neededFarReduction),
        tolerableLost: Math.max(0, lost - neededLostReduction),
        canAchieve: false
      }
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

.result-value.success {
  color: #43e97b;
  font-weight: bold;
}

.result-value.failed {
  color: #f44336;
  font-weight: bold;
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