<template>
  <view class="container">
    <!-- 转换模式选择 -->
    <view class="mode-selector">
      <view 
        class="mode-item" 
        :class="{ active: mode === 'scoreToPtt' }"
        @click="switchMode('scoreToPtt')"
      >
        <text class="mode-text">成绩 → PTT</text>
      </view>
      <view 
        class="mode-item" 
        :class="{ active: mode === 'pttToScore' }"
        @click="switchMode('pttToScore')"
      >
        <text class="mode-text">PTT → 成绩</text>
      </view>
    </view>

    <!-- 歌曲选择/定数输入区域 -->
    <view class="card song-selector">
      <view class="card-header">
        <text class="card-title">歌曲/定数设置</text>
      </view>
      
      <!-- 输入模式选择 -->
      <view class="input-mode-selector">
        <view 
          class="mode-item" 
          :class="{ active: inputMode === 'song' }"
          @click="switchInputMode('song')"
        >
          <text class="mode-text">选择歌曲</text>
        </view>
        <view 
          class="mode-item" 
          :class="{ active: inputMode === 'manual' }"
          @click="switchInputMode('manual')"
        >
          <text class="mode-text">手动输入定数</text>
        </view>
      </view>
      
      <!-- 歌曲选择模式 -->
      <view v-if="inputMode === 'song'" class="song-info" @click="goToSongList">
        <text class="song-name" v-if="selectedSong.name">{{ selectedSong.name }}</text>
        <text class="song-placeholder" v-else>点击选择歌曲</text>
        <text class="song-difficulty" v-if="selectedSong.constant">
          {{ getDifficultyText(selectedSong.difficulty) }} ({{ selectedSong.constant }})
        </text>
      </view>
      
      <!-- 手动输入模式 -->
      <view v-if="inputMode === 'manual'" class="manual-input">
        <view class="form-item">
          <text class="form-label">歌曲名称（可选）</text>
          <input 
            class="form-input" 
            type="text" 
            v-model="manualSongName" 
            placeholder="用于记录，不影响计算"
          />
        </view>
        <view class="form-item">
          <text class="form-label">定数</text>
          <input 
            class="form-input" 
            type="digit" 
            v-model="manualConstant" 
            placeholder="例如: 11.5"
            @input="onConstantChange"
          />
        </view>
      </view>
    </view>

    <!-- 成绩 ↔ PTT 转换表单 -->
    <view class="card conversion-form">
      <view class="card-header">
        <text class="card-title">
          {{ mode === 'scoreToPtt' ? '成绩 → PTT' : 'PTT → 成绩' }}
        </text>
      </view>
      
      <!-- 成绩 → PTT 输入 -->
      <view class="form-item" v-if="mode === 'scoreToPtt'">
        <text class="form-label">输入成绩 (0-10,000,000)</text>
        <input 
          class="form-input" 
          type="number" 
          v-model="scoreInput" 
          placeholder="0 - 10000000"
          @input="onScoreInputChange"
          :maxlength="8"
        />
      </view>
      
      <!-- PTT → 成绩 输入 -->
      <view class="form-item" v-if="mode === 'pttToScore'">
        <text class="form-label">输入目标PTT</text>
        <input 
          class="form-input" 
          type="digit" 
          v-model="pttInput" 
          placeholder="例如: 11.50"
          @input="onPttInputChange"
        />
      </view>
      
      <!-- 计算按钮 -->
      <button 
        class="calculate-btn" 
        @click="calculate"
        :disabled="!canCalculate"
      >
        计算
      </button>
    </view>

    <!-- 计算结果 -->
    <view class="card result-card" v-if="result">
      <view class="card-header">
        <text class="card-title">计算结果</text>
      </view>
      <view class="result-content">
        <!-- 成绩 → PTT 结果 -->
        <view v-if="mode === 'scoreToPtt'">
          <view class="result-item">
            <text class="result-label">成绩</text>
            <text class="result-value">{{ result.score.toLocaleString() }}</text>
          </view>
          <view class="result-item">
            <text class="result-label">PTT</text>
            <text class="result-value highlight">{{ result.ptt.toFixed(2) }}</text>
          </view>
          <view class="result-item">
            <text class="result-label">评级</text>
            <text class="result-value rating" :class="getRatingClass(result.rating)">
              {{ result.rating }}
            </text>
          </view>
        </view>
        
        <!-- PTT → 成绩 结果 -->
        <view v-if="mode === 'pttToScore'">
          <view class="result-item">
            <text class="result-label">目标PTT</text>
            <text class="result-value">{{ result.ptt.toFixed(2) }}</text>
          </view>
          <view class="result-item">
            <text class="result-label">所需成绩</text>
            <text class="result-value highlight">{{ result.score.toLocaleString() }}</text>
          </view>
          <view class="result-item">
            <text class="result-label">最低评级</text>
            <text class="result-value rating" :class="getRatingClass(result.rating)">
              {{ result.rating }}
            </text>
          </view>
        </view>
      </view>
      
      <!-- 保存按钮 -->
      <button class="save-btn" @click="saveToBest30" v-if="result && canSave">
        保存到B30
      </button>
    </view>

    <!-- 转换说明 -->
    <view class="card formula-card">
      <view class="card-header">
        <text class="card-title">PTT计算公式</text>
      </view>
      <view class="formula-list">
        <view class="formula-item">
          <text class="formula-condition">≥10,000,000分</text>
          <text class="formula-result">定数 + 2.0</text>
        </view>
        <view class="formula-item">
          <text class="formula-condition">9,900,000-9,999,999分</text>
          <text class="formula-result">定数 + 1.5 + (得分-9,900,000)/100,000</text>
        </view>
        <view class="formula-item">
          <text class="formula-condition">9,800,000-9,899,999分</text>
          <text class="formula-result">定数 + 1.0 + (得分-9,800,000)/400,000</text>
        </view>
        <view class="formula-item">
          <text class="formula-condition">≤9,800,000分</text>
          <text class="formula-result">定数 + (得分-9,500,000)/300,000</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 转换模式
const mode = ref<'scoreToPtt' | 'pttToScore'>('scoreToPtt')

// 输入模式：歌曲选择或手动输入
const inputMode = ref<'song' | 'manual'>('song')

// 选中的歌曲
const selectedSong = ref<any>({})

// 手动输入值
const manualSongName = ref('')
const manualConstant = ref('')

// 输入值
const scoreInput = ref('')
const pttInput = ref('')

// 计算结果
const result = ref<any>(null)

// 是否可以计算
const canCalculate = computed(() => {
  // 检查定数是否可用
  let constant = 0
  if (inputMode.value === 'song') {
    constant = selectedSong.value.constant
  } else {
    constant = parseFloat(manualConstant.value)
  }
  
  if (!constant || isNaN(constant)) return false
  
  if (mode.value === 'scoreToPtt') {
    return scoreInput.value !== '' && 
           parseInt(scoreInput.value) >= 0 && 
           parseInt(scoreInput.value) <= 10000000
  } else {
    return pttInput.value !== '' && !isNaN(parseFloat(pttInput.value))
  }
})

// 是否可以保存到B30
const canSave = computed(() => {
  if (!result.value) return false
  
  if (inputMode.value === 'song') {
    return !!selectedSong.value.name
  } else {
    return !!manualConstant.value && !isNaN(parseFloat(manualConstant.value))
  }
})

// 页面加载时获取可能的歌曲选择
onMounted(() => {
  // 从存储中获取最近使用的歌曲
  const recentSong = uni.getStorageSync('recent_song')
  if (recentSong) {
    selectedSong.value = recentSong
  }
})

// 切换转换模式
const switchMode = (newMode: 'scoreToPtt' | 'pttToScore') => {
  mode.value = newMode
  result.value = null
  scoreInput.value = ''
  pttInput.value = ''
}

// 切换输入模式
const switchInputMode = (newMode: 'song' | 'manual') => {
  inputMode.value = newMode
  result.value = null
  scoreInput.value = ''
  pttInput.value = ''
}

// 定数输入变化
const onConstantChange = () => {
  const value = parseFloat(manualConstant.value)
  if (isNaN(value) || value < 0) {
    manualConstant.value = '0'
  } else if (value > 15) {
    manualConstant.value = '15'
  }
}

// 跳转到歌曲列表
const goToSongList = () => {
  uni.navigateTo({
    url: '/pages/songs/songs?from=calculator'
  })
}

// 成绩输入变化
const onScoreInputChange = () => {
  const value = parseInt(scoreInput.value)
  if (isNaN(value) || value < 0) {
    scoreInput.value = '0'
  } else if (value > 10000000) {
    scoreInput.value = '10000000'
  }
}

// PTT输入变化
const onPttInputChange = () => {
  const value = parseFloat(pttInput.value)
  if (isNaN(value) || value < 0) {
    pttInput.value = '0'
  }
}

// 计算PTT或成绩
const calculate = () => {
  // 获取定数
  let constant = 0
  let songName = ''
  
  if (inputMode.value === 'song') {
    constant = selectedSong.value.constant
    songName = selectedSong.value.name || ''
    
    if (!constant) {
      uni.showToast({
        title: '请先选择歌曲',
        icon: 'none'
      })
      return
    }
  } else {
    constant = parseFloat(manualConstant.value)
    songName = manualSongName.value || '手动输入'
    
    if (!constant || isNaN(constant)) {
      uni.showToast({
        title: '请输入有效的定数',
        icon: 'none'
      })
      return
    }
  }
  
  if (mode.value === 'scoreToPtt') {
    // 成绩 → PTT
    const score = parseInt(scoreInput.value)
    const ptt = calculatePtt(score, constant)
    const rating = getRating(score)
    
    result.value = {
      score,
      ptt,
      rating,
      songName,
      constant,
      inputMode: inputMode.value
    }
  } else {
    // PTT → 成绩
    const targetPtt = parseFloat(pttInput.value)
    const score = calculateScore(targetPtt, constant)
    const rating = getRating(score)
    
    result.value = {
      ptt: targetPtt,
      score,
      rating,
      songName,
      constant,
      inputMode: inputMode.value
    }
  }
}

// 根据成绩计算PTT
const calculatePtt = (score: number, constant: number): number => {
  if (score >= 10000000) {
    return constant + 2.0
  } else if (score >= 9900000) {
    return constant + 1.5 + (score - 9900000) / 100000
  } else if (score >= 9800000) {
    return constant + 1.0 + (score - 9800000) / 400000
  } else {
    return constant + Math.max(0, (score - 9500000) / 300000)
  }
}

// 根据PTT计算成绩
const calculateScore = (ptt: number, constant: number): number => {
  const targetPttAboveConstant = ptt - constant
  
  if (targetPttAboveConstant >= 2.0) {
    return 10000000
  } else if (targetPttAboveConstant >= 1.5) {
    return Math.floor(9900000 + (targetPttAboveConstant - 1.5) * 100000)
  } else if (targetPttAboveConstant >= 1.0) {
    return Math.floor(9800000 + (targetPttAboveConstant - 1.0) * 400000)
  } else if (targetPttAboveConstant >= 0) {
    return Math.floor(9500000 + targetPttAboveConstant * 300000)
  } else {
    return Math.floor(9500000 + targetPttAboveConstant * 300000) // 可能低于950万
  }
}

// 根据成绩获取评级
const getRating = (score: number): string => {
  if (score === 10000000) return 'PM'
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

// 保存到B30
const saveToBest30 = () => {
  if (!result.value) return
  
  // 检查是否有足够的信息保存
  if (inputMode.value === 'song' && !selectedSong.value.name) return
  if (inputMode.value === 'manual' && !manualConstant.value) return
  
  let record = {
    score: result.value.score,
    ptt: result.value.ptt,
    rating: result.value.rating,
    timestamp: Date.now()
  }
  
  // 根据输入模式设置歌曲信息
  if (inputMode.value === 'song') {
    record.songName = selectedSong.value.name
    record.difficulty = selectedSong.value.difficulty
    record.constant = selectedSong.value.constant
  } else {
    record.songName = manualSongName.value || '手动输入'
    record.difficulty = 'manual'
    record.constant = parseFloat(manualConstant.value)
  }
  
  try {
    // 获取现有B30记录
    let best30Records = uni.getStorageSync('best30_records') || []
    
    // 检查是否已存在相同歌曲和难度的记录
    const existingIndex = best30Records.findIndex(
      (r: any) => r.songName === record.songName && r.difficulty === record.difficulty
    )
    
    if (existingIndex !== -1) {
      // 更新现有记录
      best30Records[existingIndex] = record
    } else {
      // 添加新记录
      best30Records.push(record)
    }
    
    // 按PTT降序排序
    best30Records.sort((a: any, b: any) => b.ptt - a.ptt)
    
    // 只保留前30条
    best30Records = best30Records.slice(0, 30)
    
    // 保存到本地存储
    uni.setStorageSync('best30_records', best30Records)
    
    // 更新最近成绩
    updateRecentScores(record)
    
    uni.showToast({
      title: '已保存到B30',
      icon: 'success'
    })
    
    // 询问是否跳转到B30管理页面
    setTimeout(() => {
      uni.showModal({
        title: '提示',
        content: '已成功保存到B30，是否跳转到B30管理页面？',
        success: (res) => {
          if (res.confirm) {
            uni.switchTab({
              url: '/pages/best30/best30'
            })
          }
        }
      })
    }, 1500)
    
  } catch (e) {
    console.error('保存B30失败', e)
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    })
  }
}

// 更新最近成绩
const updateRecentScores = (record: any) => {
  try {
    let recentScores = uni.getStorageSync('recent_scores') || []
    
    // 检查是否已存在相同歌曲和难度的记录
    const existingIndex = recentScores.findIndex(
      (r: any) => r.songName === record.songName && r.difficulty === record.difficulty
    )
    
    if (existingIndex !== -1) {
      // 移除旧记录
      recentScores.splice(existingIndex, 1)
    }
    
    // 添加到开头
    recentScores.unshift(record)
    
    // 只保留最近10条
    recentScores = recentScores.slice(0, 10)
    
    // 保存到本地存储
    uni.setStorageSync('recent_scores', recentScores)
  } catch (e) {
    console.error('更新最近成绩失败', e)
  }
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
  padding: 30rpx;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.mode-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.mode-text {
  font-size: 30rpx;
  font-weight: bold;
  color: #666;
  transition: color 0.3s ease;
}

.mode-item.active .mode-text {
  color: white;
}

.input-mode-selector {
  display: flex;
  margin-bottom: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background: #f8f9fa;
}

.input-mode-selector .mode-item {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  border-radius: 0;
}

.input-mode-selector .mode-text {
  font-size: 26rpx;
}

.manual-input {
  margin-top: 16rpx;
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

.calculate-btn, .save-btn {
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

.save-btn {
  margin-top: 30rpx;
  background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
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

.formula-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.formula-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #eee;
}

.formula-condition {
  font-size: 26rpx;
  color: #666;
  flex: 1;
}

.formula-result {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  flex: 2;
  text-align: right;
}
</style>