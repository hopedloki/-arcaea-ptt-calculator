<template>
  <view class="container">
    <!-- 页面标题 -->
    <view class="header">
      <text class="title">{{ isEditing ? '编辑成绩' : '添加成绩' }}</text>
    </view>

    <!-- 歌曲选择 -->
    <view class="card">
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

    <!-- 成绩输入 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">成绩信息</text>
      </view>
      
      <!-- 分数输入 -->
      <view class="form-item">
        <text class="form-label">分数</text>
        <view class="score-input-group">
          <input 
            class="score-input" 
            type="number" 
            v-model="scoreInput" 
            placeholder="0 - 10000000"
            @input="onScoreInput"
            :maxlength="8"
          />
          <button class="max-score-btn" @click="setMaxScore">最高分</button>
        </view>
      </view>
      
      <!-- 评级显示 -->
      <view class="form-item" v-if="calculatedRating">
        <text class="form-label">评级</text>
        <view class="rating-display" :class="getRatingClass(calculatedRating)">
          {{ calculatedRating }}
        </view>
      </view>
      
      <!-- PTT显示 -->
      <view class="form-item" v-if="calculatedPtt">
        <text class="form-label">PTT</text>
        <view class="ptt-display">
          {{ calculatedPtt.toFixed(2) }}
        </view>
      </view>
      
      <!-- 详细评价输入 -->
      <view class="form-section">
        <text class="form-section-title">详细评价（可选）</text>
        
        <view class="detail-inputs">
          <view class="detail-input-item">
            <text class="detail-label">Pure</text>
            <input 
              class="detail-input" 
              type="number" 
              v-model="pureCount" 
              placeholder="0"
            />
          </view>
          
          <view class="detail-input-item">
            <text class="detail-label">Far</text>
            <input 
              class="detail-input" 
              type="number" 
              v-model="farCount" 
              placeholder="0"
            />
          </view>
          
          <view class="detail-input-item">
            <text class="detail-label">Lost</text>
            <input 
              class="detail-input" 
              type="number" 
              v-model="lostCount" 
              placeholder="0"
            />
          </view>
        </view>
      </view>
      
      <!-- 备注输入 -->
      <view class="form-item">
        <text class="form-label">备注</text>
        <textarea 
          class="remark-input" 
          v-model="remark" 
          placeholder="添加一些备注..."
          maxlength="200"
        />
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="actions">
      <button class="action-btn cancel-btn" @click="goBack">取消</button>
      <button 
        class="action-btn save-btn" 
        @click="saveScore"
        :disabled="!canSave"
      >
        {{ isEditing ? '更新' : '保存' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 添加/编辑成绩页
 * 支持两种模式：新增成绩和编辑已有成绩（通过路由参数 edit 区分）
 * 提供歌曲选择（跳转歌曲列表）、分数输入、Pure/Far/Lost 判定输入和备注输入
 * 实时计算评级和 PTT，保存后写入本地存储并更新最近成绩和 PTT 概览
 * 通过 uni.$emit('recordAdded') 通知其他页面刷新
 */
import { ref, computed, onMounted } from 'vue'
import { onPageShow } from '@dcloudio/uni-app'
import { getRating, getRatingClass, getDifficultyText } from '../../utils/helpers'
import { calculatePtt } from '../../utils/ptt-calculator'
import { getStorage, setStorage, removeStorage } from '../../services/storage'
import { showSuccess, showError, showConfirm, showLoading, hideLoading } from '../../services/toast'
import { STORAGE_KEYS } from '../../constants'
import { pttStore } from '../../stores/pttStore'
import type { Best30Record } from '../../types'

// 是否为编辑模式（由路由参数 edit 决定）
const isEditing = ref(false)
const editIndex = ref(-1)

// 当前选中的歌曲信息（名称/难度/定数）
const selectedSong = ref<any>({})

// 用户输入值
const scoreInput = ref('')
const pureCount = ref('')
const farCount = ref('')
const lostCount = ref('')
const remark = ref('')

// 实时计算的结果（评级和PTT）
const calculatedPtt = ref(0)
const calculatedRating = ref('')

// 是否可以保存 — 需要有定数且分数在有效范围内
const canSave = computed(() => {
  return selectedSong.value.constant && 
         scoreInput.value !== '' && 
         parseInt(scoreInput.value) >= 0 && 
         parseInt(scoreInput.value) <= 10000000
})

// 页面挂载 — 获取路由参数判断编辑模式，加载最近歌曲，监听 songSelected 事件
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options as any
  
  // 获取编辑参数
  if (options && options.edit !== undefined) {
    const index = parseInt(options.edit)
    if (!isNaN(index) && index >= 0) {
      isEditing.value = true
      editIndex.value = index
      loadScoreForEdit(index)
    }
  }
  
  // 获取可能的歌曲选择
  const recentSong = getStorage(STORAGE_KEYS.RECENT_SONG)
  if (recentSong) {
    selectedSong.value = recentSong
  }
  
  // 监听歌曲选择事件
  uni.$on('songSelected', (song: Record<string, unknown>) => {
    selectedSong.value = song
    calculatePttAndRating() // 重新计算PTT和评级
  })
})

// 页面显示 — 检测从歌曲列表返回时是否有新选曲，更新表单
onPageShow(() => {
  // 检查是否有新选择的歌曲
  const selectedSongForAdd = getStorage(STORAGE_KEYS.SELECTED_SONG_ADD)
  if (selectedSongForAdd) {
    // 更新选中的歌曲信息
    selectedSong.value = {
      name: selectedSongForAdd.name,
      difficulty: selectedSongForAdd.difficulty,
      constant: selectedSongForAdd.constant,
      notes: selectedSongForAdd.notes
    }
    
    // 清除临时存储
    removeStorage(STORAGE_KEYS.SELECTED_SONG_ADD)
    
    // 重新计算PTT和评级
    calculatePttAndRating() 
    
    // #ifdef dev
    console.log('页面显示时更新了选中的歌曲:', selectedSongForAdd)
    // #endif
  }
  
  // 获取可能的歌曲选择
  const recentSong = getStorage(STORAGE_KEYS.RECENT_SONG)
  if (recentSong && !selectedSong.value.name) {
    selectedSong.value = recentSong
    calculatePttAndRating() // 重新计算PTT和评级
  }
})

// 加载要编辑的成绩数据 — 从本地存储读取并填充表单
const loadScoreForEdit = (index: number) => {
  try {
    const best30Records = getStorage<Best30Record[]>(STORAGE_KEYS.BEST30_RECORDS, [])
    if (best30Records[index]) {
      const record = best30Records[index]
      selectedSong.value = {
        name: record.songName,
        difficulty: record.difficulty,
        constant: record.constant
      }
      scoreInput.value = record.score.toString()
      calculatedPtt.value = record.ptt
      calculatedRating.value = record.rating
      
      // 加载详细评价（如果有）
      if (record.pureCount !== undefined) pureCount.value = record.pureCount.toString()
      if (record.farCount !== undefined) farCount.value = record.farCount.toString()
      if (record.lostCount !== undefined) lostCount.value = record.lostCount.toString()
      
      remark.value = record.remark || ''
    }
  } catch (e) {
    // #ifdef dev
    console.error('加载成绩失败', e)
    // #endif
  }
}

// 跳转到歌曲列表页面（携带 from=add 参数）
const goToSongList = () => {
  uni.navigateTo({
    url: '/pages/songs/songs?from=add'
  })
}

// 设置最高分（10,000,000）并触发计算
const setMaxScore = () => {
  scoreInput.value = '10000000'
  calculatePttAndRating()
}

// 分数输入变化 — 限制范围并实时计算 PTT 和评级
const onScoreInput = () => {
  const value = parseInt(scoreInput.value)
  if (isNaN(value) || value < 0) {
    scoreInput.value = '0'
  } else if (value > 10000000) {
    scoreInput.value = '10000000'
  }
  
  calculatePttAndRating()
}

// 实时计算当前选歌+分数的 PTT 和评级
const calculatePttAndRating = () => {
  if (!selectedSong.value.constant || scoreInput.value === '') {
    calculatedPtt.value = 0
    calculatedRating.value = ''
    return
  }
  
  const score = parseInt(scoreInput.value)
  const constant = selectedSong.value.constant
  
  // 计算PTT
  calculatedPtt.value = calculatePtt(score, constant)
  
  // 计算评级
  calculatedRating.value = getRating(score)
}

// 保存成绩 — 写入本地存储，更新最近成绩，重新计算 PTT 概览
const saveScore = async () => {
  if (!canSave.value) {
    showError('请填写完整信息')
    return
  }

  if (!selectedSong.value || !selectedSong.value.name) {
    showError('请选择歌曲')
    return
  }
  
  const score = parseInt(scoreInput.value)
  const record = {
    songName: selectedSong.value.name,
    difficulty: selectedSong.value.difficulty,
    constant: selectedSong.value.constant,
    score,
    ptt: calculatedPtt.value,
    rating: calculatedRating.value,
    pureCount: pureCount.value ? parseInt(pureCount.value) : undefined,
    farCount: farCount.value ? parseInt(farCount.value) : undefined,
    lostCount: lostCount.value ? parseInt(lostCount.value) : undefined,
    remark: remark.value.trim(),
    timestamp: Date.now()
  }
  
  try {
    let best30Records = getStorage<Best30Record[]>(STORAGE_KEYS.BEST30_RECORDS, [])
    
    if (isEditing.value) {
      best30Records[editIndex.value] = record
      saveRecordAndUpdateStats(best30Records, record)
      return
    }

    const existingIndex = best30Records.findIndex(
      (r: Best30Record) => r.songName === record.songName && r.difficulty === record.difficulty
    )
    
    if (existingIndex !== -1) {
      const confirmed = await showConfirm('提示', '已存在相同歌曲和难度的记录，是否覆盖？')
      if (!confirmed) return
      best30Records[existingIndex] = record
      saveRecordAndUpdateStats(best30Records, record)
      return
    }

    best30Records.push(record)
    saveRecordAndUpdateStats(best30Records, record)
  } catch (e) {
    // #ifdef dev
    console.error('保存成绩失败', e)
    // #endif
    showError('保存失败')
  }
}

const saveRecordAndUpdateStats = (best30Records: Best30Record[], record: Best30Record) => {
  best30Records.sort((a, b) => b.ptt - a.ptt)
  
  best30Records = best30Records.slice(0, 30)
  
  setStorage(STORAGE_KEYS.BEST30_RECORDS, best30Records)
  
  setStorage(STORAGE_KEYS.RECENT_SONG, {
    name: record.songName,
    difficulty: record.difficulty,
    constant: record.constant
  })
  
  updateRecentScores(record)
  
  const recentScores = getStorage(STORAGE_KEYS.RECENT_SCORES, [])
  setStorage(STORAGE_KEYS.RECENT_SCORES, recentScores)
  
  uni.$emit('recordAdded')
  
  // 通过 pttStore 统一计算 PTT 概览（替代本地 recalculatePTTOverview）
  const recentRecords = getStorage(STORAGE_KEYS.RECENT_SCORES, [])
  // pttStore is directly imported
  pttStore.importRecords(best30Records, recentRecords)
  
  showSuccess(isEditing.value ? '更新成功' : '保存成功')
  
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}

// 更新最近成绩列表 — 去重后插入开头，保留最新10条
const updateRecentScores = (record: Best30Record) => {
  try {
    let recentScores = getStorage<Best30Record[]>(STORAGE_KEYS.RECENT_SCORES, [])
    
    const existingIndex = recentScores.findIndex(
      (r: Best30Record) => r.songName === record.songName && r.difficulty === record.difficulty
    )
    
    if (existingIndex !== -1) {
      recentScores.splice(existingIndex, 1)
    }
    
    recentScores.unshift(record)
    
    recentScores = recentScores.slice(0, 10)
    
    setStorage(STORAGE_KEYS.RECENT_SCORES, recentScores)
  } catch (e) {
    // #ifdef dev
    console.error('更新最近成绩失败', e)
    // #endif
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  padding: 40rpx 0 20rpx;
  text-align: center;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
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

.form-section {
  margin-bottom: 30rpx;
}

.form-section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.form-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
}

.score-input-group {
  display: flex;
  align-items: center;
}

.score-input {
  flex: 1;
  height: 88rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 0 30rpx;
  font-size: 32rpx;
  color: #333;
  box-sizing: border-box;
}

.max-score-btn {
  margin-left: 20rpx;
  padding: 0 20rpx;
  height: 88rpx;
  background: #667eea;
  color: white;
  border-radius: 16rpx;
  font-size: 26rpx;
  border: none;
  white-space: nowrap;
}

.rating-display, .ptt-display {
  height: 88rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 0 30rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
}

.ptt-display {
  color: #667eea;
}

.detail-inputs {
  display: flex;
  gap: 20rpx;
}

.detail-input-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.detail-input {
  height: 80rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
  color: #333;
  text-align: center;
  box-sizing: border-box;
}

.remark-input {
  width: 100%;
  min-height: 160rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.action-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.save-btn[disabled] {
  opacity: 0.5;
}
</style>