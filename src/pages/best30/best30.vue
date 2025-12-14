<template>
  <view class="container">
    <!-- PTT概览卡片 -->
    <view class="card overview-card">
      <view class="ptt-overview">
        <view class="ptt-value">
          <text class="value">{{ currentPTT.toFixed(2) }}</text>
          <text class="label">当前PTT</text>
        </view>
        <view class="ptt-stats">
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

    <!-- 操作按钮 -->
    <view class="actions">
      <button class="action-btn" @click="goToAddScore">
        <text class="btn-icon">➕</text>
        <text class="btn-text">添加成绩</text>
      </button>
      <button class="action-btn" @click="importData">
        <text class="btn-icon">📥</text>
        <text class="btn-text">导入数据</text>
      </button>
      <button class="action-btn" @click="exportData">
        <text class="btn-icon">📤</text>
        <text class="btn-text">导出数据</text>
      </button>
      <button class="action-btn" @click="showClearDialog">
        <text class="btn-icon">🗑️</text>
        <text class="btn-text">清空数据</text>
      </button>
    </view>

    <!-- 筛选和排序 -->
    <view class="filter-section">
      <view class="filter-item">
        <text class="filter-label">难度筛选</text>
        <picker 
          :range="difficultyOptions" 
          range-key="name"
          :value="difficultyIndex"
          @change="onDifficultyChange"
          class="picker"
        >
          <view class="picker-text">
            {{ difficultyOptions[difficultyIndex].name }}
          </view>
        </picker>
      </view>
      <view class="filter-item">
        <text class="filter-label">排序方式</text>
        <picker 
          :range="sortOptions" 
          range-key="name"
          :value="sortIndex"
          @change="onSortChange"
          class="picker"
        >
          <view class="picker-text">
            {{ sortOptions[sortIndex].name }}
          </view>
        </picker>
      </view>
    </view>

    <!-- B30列表 -->
    <view class="card scores-card">
      <view class="card-header">
        <text class="card-title">B30列表 ({{ filteredRecords.length }})</text>
        <text class="card-action" @click="goToData">查看R10</text>
      </view>
      
      <view class="scores-list" v-if="filteredRecords.length > 0">
        <view 
          class="score-item" 
          v-for="(record, index) in filteredRecords" 
          :key="index"
        >
          <view class="score-rank">{{ index + 1 }}</view>
          <view class="song-info">
            <text class="song-name">{{ record.songName }}</text>
            <text class="song-difficulty" :class="getDifficultyClass(record.difficulty)">
              {{ getDifficultyText(record.difficulty) }} ({{ record.constant }})
            </text>
          </view>
          <view class="score-details">
            <text class="score-text">{{ record.score.toLocaleString() }}</text>
            <text class="score-ptt">PTT: {{ record.ptt.toFixed(2) }}</text>
            <text class="score-rating" :class="getRatingClass(record.rating)">
              {{ record.rating }}
            </text>
          </view>
          <view class="score-actions">
            <button class="action-icon edit-btn" @click="editScore(index)">✏️</button>
            <button class="action-icon delete-btn" @click="deleteScore(index)">🗑️</button>
          </view>
        </view>
      </view>
      
      <view class="empty-state" v-else>
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无B30记录</text>
        <button class="empty-btn" @click="goToAddScore">添加第一首歌的成绩</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// PTT数据
const currentPTT = ref(11.23)
const best10Avg = ref(12.45)
const best30Avg = ref(11.78)
const recent10Avg = ref(10.56)

// B30记录
const best30Records = ref<any[]>([])

// 筛选和排序选项
const difficultyOptions = [
  { name: '全部难度', value: 'all' },
  { name: 'PAST', value: 'pst' },
  { name: 'PRESENT', value: 'prs' },
  { name: 'FUTURE', value: 'ftr' },
  { name: 'BEYOND', value: 'byd' },
  { name: 'ETERNAL', value: 'etr' }
]
const difficultyIndex = ref(0)

const sortOptions = [
  { name: 'PTT降序', value: 'ptt-desc' },
  { name: 'PTT升序', value: 'ptt-asc' },
  { name: '分数降序', value: 'score-desc' },
  { name: '分数升序', value: 'score-asc' },
  { name: '歌曲名称', value: 'name' }
]
const sortIndex = ref(0)

// 筛选后的记录
const filteredRecords = computed(() => {
  let records = [...best30Records.value]
  
  // 难度筛选
  if (difficultyOptions[difficultyIndex.value].value !== 'all') {
    records = records.filter(record => 
      record.difficulty === difficultyOptions[difficultyIndex.value].value
    )
  }
  
  // 排序
  const sortType = sortOptions[sortIndex.value].value
  switch (sortType) {
    case 'ptt-desc':
      records.sort((a, b) => b.ptt - a.ptt)
      break
    case 'ptt-asc':
      records.sort((a, b) => a.ptt - b.ptt)
      break
    case 'score-desc':
      records.sort((a, b) => b.score - a.score)
      break
    case 'score-asc':
      records.sort((a, b) => a.score - b.score)
      break
    case 'name':
      records.sort((a, b) => a.songName.localeCompare(b.songName))
      break
  }
  
  return records
})

// 页面加载时获取数据
onMounted(() => {
  loadDataFromStorage()
})

// 从本地存储加载数据
const loadDataFromStorage = () => {
  try {
    // 加载B30记录
    const records = uni.getStorageSync('best30_records') || []
    best30Records.value = records
    
    // 加载PTT数据
    const pttData = uni.getStorageSync('ptt_data')
    if (pttData) {
      currentPTT.value = pttData.currentPTT || 0
      best10Avg.value = pttData.best10Avg || 0
      best30Avg.value = pttData.best30Avg || 0
      recent10Avg.value = pttData.recent10Avg || 0
    }
    
    // 重新计算PTT概览
    recalculatePTTOverview()
  } catch (e) {
    console.error('加载数据失败', e)
  }
}

// 重新计算PTT概览
const recalculatePTTOverview = () => {
  if (best30Records.value.length === 0) {
    currentPTT.value = 0
    best10Avg.value = 0
    best30Avg.value = 0
    return
  }
  
  // 计算B30平均
  const best30Total = best30Records.value.reduce((sum, record) => sum + record.ptt, 0)
  best30Avg.value = best30Total / best30Records.value.length
  
  // 计算B10平均
  const top10Records = [...best30Records.value].sort((a, b) => b.ptt - a.ptt).slice(0, 10)
  const best10Total = top10Records.reduce((sum, record) => sum + record.ptt, 0)
  best10Avg.value = best10Total / top10Records.length
  
  // 获取R10记录并计算平均值
  try {
    const recent10Records = uni.getStorageSync('recent_scores') || []
    if (recent10Records.length > 0) {
      const recent10Total = recent10Records.reduce((sum: number, record: any) => sum + record.ptt, 0)
      recent10Avg.value = recent10Total / recent10Records.length
    }
  } catch (e) {
    console.error('获取R10数据失败', e)
  }
  
  // 计算当前PTT (B10*0.75 + R10*0.25)
  currentPTT.value = best10Avg.value * 0.75 + recent10Avg.value * 0.25
  
  // 保存PTT数据
  savePTTData()
}

// 保存PTT数据
const savePTTData = () => {
  try {
    const pttData = {
      currentPTT: currentPTT.value,
      best10Avg: best10Avg.value,
      best30Avg: best30Avg.value,
      recent10Avg: recent10Avg.value,
      lastUpdated: Date.now()
    }
    uni.setStorageSync('ptt_data', pttData)
  } catch (e) {
    console.error('保存PTT数据失败', e)
  }
}

// 难度选择变化
const onDifficultyChange = (e: any) => {
  difficultyIndex.value = e.detail.value
}

// 排序选择变化
const onSortChange = (e: any) => {
  sortIndex.value = e.detail.value
}

// 跳转到添加成绩页面
const goToAddScore = () => {
  uni.navigateTo({
    url: '/pages/best30/add'
  })
}

// 跳转到数据管理页面
const goToData = () => {
  uni.switchTab({
    url: '/pages/data/data'
  })
}

// 导入数据
const importData = () => {
  uni.chooseFile({
    count: 1,
    type: 'file',
    success: (res) => {
      const tempFilePaths = res.tempFilePaths
      if (tempFilePaths && tempFilePaths.length > 0) {
        // 读取文件内容
        const fileManager = uni.getFileSystemManager()
        fileManager.readFile({
          filePath: tempFilePaths[0],
          encoding: 'utf8',
          success: (readRes) => {
            try {
              const data = JSON.parse(readRes.data as string)
              if (data.best30Records && Array.isArray(data.best30Records)) {
                best30Records.value = data.best30Records
                saveBest30Records()
                recalculatePTTOverview()
                uni.showToast({
                  title: '导入成功',
                  icon: 'success'
                })
              } else {
                uni.showToast({
                  title: '数据格式不正确',
                  icon: 'none'
                })
              }
            } catch (e) {
              console.error('解析数据失败', e)
              uni.showToast({
                title: '解析数据失败',
                icon: 'none'
              })
            }
          },
          fail: (err) => {
            console.error('读取文件失败', err)
            uni.showToast({
              title: '读取文件失败',
              icon: 'none'
            })
          }
        })
      }
    }
  })
}

// 导出数据
const exportData = () => {
  try {
    const data = {
      best30Records: best30Records.value,
      pttData: {
        currentPTT: currentPTT.value,
        best10Avg: best10Avg.value,
        best30Avg: best30Avg.value,
        recent10Avg: recent10Avg.value
      },
      exportTime: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const jsonStr = JSON.stringify(data, null, 2)
    const fileName = `arcaea-ptt-backup-${Date.now()}.json`
    
    // 保存到本地
    const fileManager = uni.getFileSystemManager()
    const filePath = `${uni.env.USER_DATA_PATH}/${fileName}`
    
    fileManager.writeFile({
      filePath: filePath,
      data: jsonStr,
      encoding: 'utf8',
      success: () => {
        // #ifdef H5
        // 在H5环境下创建下载链接
        const blob = new Blob([jsonStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        // #endif
        
        // #ifndef H5
        // 在非H5环境下提示保存位置
        uni.showModal({
          title: '导出成功',
          content: `数据已导出到: ${filePath}`,
          showCancel: false
        })
        // #endif
        
        uni.showToast({
          title: '导出成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.error('导出失败', err)
        uni.showToast({
          title: '导出失败',
          icon: 'none'
        })
      }
    })
  } catch (e) {
    console.error('导出数据失败', e)
    uni.showToast({
      title: '导出失败',
      icon: 'none'
    })
  }
}

// 显示清空数据确认对话框
const showClearDialog = () => {
  uni.showModal({
    title: '确认清空',
    content: '确定要清空所有B30记录吗？此操作不可恢复！',
    success: (res) => {
      if (res.confirm) {
        clearAllData()
      }
    }
  })
}

// 清空所有数据
const clearAllData = () => {
  try {
    best30Records.value = []
    uni.removeStorageSync('best30_records')
    recalculatePTTOverview()
    uni.showToast({
      title: '已清空所有数据',
      icon: 'success'
    })
  } catch (e) {
    console.error('清空数据失败', e)
    uni.showToast({
      title: '清空失败',
      icon: 'none'
    })
  }
}

// 保存B30记录
const saveBest30Records = () => {
  try {
    uni.setStorageSync('best30_records', best30Records.value)
  } catch (e) {
    console.error('保存B30记录失败', e)
  }
}

// 编辑成绩
const editScore = (index: number) => {
  const record = filteredRecords.value[index]
  const originalIndex = best30Records.value.findIndex(
    r => r.songName === record.songName && r.difficulty === record.difficulty
  )
  
  uni.navigateTo({
    url: `/pages/best30/add?edit=${originalIndex}`
  })
}

// 删除成绩
const deleteScore = (index: number) => {
  const record = filteredRecords.value[index]
  const originalIndex = best30Records.value.findIndex(
    r => r.songName === record.songName && r.difficulty === record.difficulty
  )
  
  uni.showModal({
    title: '确认删除',
    content: `确定要删除《${record.songName}》的成绩记录吗？`,
    success: (res) => {
      if (res.confirm) {
        best30Records.value.splice(originalIndex, 1)
        saveBest30Records()
        recalculatePTTOverview()
        uni.showToast({
          title: '已删除',
          icon: 'success'
        })
      }
    }
  })
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
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.overview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.ptt-stats {
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

.actions {
  display: flex;
  justify-content: space-between;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.action-btn {
  flex: 1;
  background: white;
  border-radius: 20rpx;
  padding: 20rpx 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  border: none;
}

.btn-icon {
  font-size: 40rpx;
  margin-bottom: 10rpx;
}

.btn-text {
  font-size: 24rpx;
  color: #333;
}

.filter-section {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.filter-item {
  flex: 1;
  background: white;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.filter-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: block;
}

.picker {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 15rpx 20rpx;
  display: flex;
  align-items: center;
}

.picker-text {
  font-size: 28rpx;
  color: #333;
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

.scores-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.score-item {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 20rpx;
  position: relative;
}

.score-rank {
  width: 50rpx;
  height: 50rpx;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: bold;
  margin-right: 20rpx;
}

.song-info {
  flex: 2;
  margin-right: 20rpx;
}

.song-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
  display: block;
}

.song-difficulty {
  font-size: 24rpx;
  margin-bottom: 4rpx;
}

.difficulty-pst {
  color: #4caf50;
}

.difficulty-prs {
  color: #2196f3;
}

.difficulty-ftr {
  color: #ff9800;
}

.difficulty-byd {
  color: #f44336;
}

.difficulty-etr {
  color: #9c27b0;
}

.score-details {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 20rpx;
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
  margin-bottom: 4rpx;
}

.score-rating {
  font-size: 24rpx;
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
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

.score-actions {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.action-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  border: none;
  background: white;
}

.edit-btn {
  color: #2196f3;
}

.delete-btn {
  color: #f44336;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 20rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 30rpx;
}

.empty-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 40rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
  border: none;
}
</style>