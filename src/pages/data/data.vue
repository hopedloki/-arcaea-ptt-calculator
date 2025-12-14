<template>
  <view class="container">
    <!-- PTT概览 -->
    <view class="card overview-card">
      <view class="card-header">
        <text class="card-title">PTT概览</text>
        <text class="card-action" @click="refreshPTT">刷新</text>
      </view>
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
      <button class="action-btn" @click="exportAllData">
        <text class="btn-icon">📤</text>
        <text class="btn-text">导出全部</text>
      </button>
      <button class="action-btn" @click="importData">
        <text class="btn-icon">📥</text>
        <text class="btn-text">导入数据</text>
      </button>
      <button class="action-btn" @click="syncData">
        <text class="btn-icon">🔄</text>
        <text class="btn-text">同步数据</text>
      </button>
      <button class="action-btn" @click="showClearDialog">
        <text class="btn-icon">🗑️</text>
        <text class="btn-text">清空数据</text>
      </button>
    </view>

    <!-- 数据统计 -->
    <view class="card stats-card">
      <view class="card-header">
        <text class="card-title">数据统计</text>
      </view>
      <view class="stats-grid">
        <view class="stat-card">
          <text class="stat-number">{{ best30Records.length }}</text>
          <text class="stat-label">B30记录</text>
        </view>
        <view class="stat-card">
          <text class="stat-number">{{ recentRecords.length }}</text>
          <text class="stat-label">最近记录</text>
        </view>
        <view class="stat-card">
          <text class="stat-number">{{ songsCount }}</text>
          <text class="stat-label">歌曲总数</text>
        </view>
        <view class="stat-card">
          <text class="stat-number">{{ lastUpdated }}</text>
          <text class="stat-label">最后更新</text>
        </view>
      </view>
    </view>

    <!-- 选项卡 -->
    <view class="tabs">
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'best30' }"
        @click="switchTab('best30')"
      >
        <text class="tab-text">B30记录</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'recent' }"
        @click="switchTab('recent')"
      >
        <text class="tab-text">最近记录</text>
      </view>
    </view>

    <!-- 记录列表 -->
    <view class="card records-card">
      <view class="card-header">
        <text class="card-title">
          {{ activeTab === 'best30' ? 'B30记录' : '最近记录' }} ({{ currentRecords.length }})
        </text>
      </view>
      
      <view class="records-list" v-if="currentRecords.length > 0">
        <view 
          class="record-item" 
          v-for="(record, index) in currentRecords" 
          :key="index"
        >
          <view class="record-rank">{{ index + 1 }}</view>
          <view class="song-info">
            <text class="song-name">{{ record.songName }}</text>
            <text class="song-difficulty" :class="getDifficultyClass(record.difficulty)">
              {{ getDifficultyText(record.difficulty) }} ({{ record.constant }})
            </text>
          </view>
          <view class="record-details">
            <text class="record-score">{{ record.score.toLocaleString() }}</text>
            <text class="record-ptt">PTT: {{ record.ptt.toFixed(2) }}</text>
            <text class="record-rating" :class="getRatingClass(record.rating)">
              {{ record.rating }}
            </text>
          </view>
          <view class="record-actions">
            <button class="action-icon edit-btn" @click="editRecord(index)">✏️</button>
            <button class="action-icon delete-btn" @click="deleteRecord(index)">🗑️</button>
          </view>
        </view>
      </view>
      
      <view class="empty-state" v-else>
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无记录</text>
        <button class="empty-btn" @click="goToBest30">去添加成绩</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// PTT数据
const currentPTT = ref(0)
const best10Avg = ref(0)
const best30Avg = ref(0)
const recent10Avg = ref(0)
const lastUpdated = ref('未知')

// 记录数据
const best30Records = ref<any[]>([])
const recentRecords = ref<any[]>([])
const songsCount = ref(0)

// 当前选中的选项卡
const activeTab = ref<'best30' | 'recent'>('best30')

// 当前显示的记录列表
const currentRecords = computed(() => {
  return activeTab.value === 'best30' ? best30Records.value : recentRecords.value
})

// 页面加载时获取数据
onMounted(() => {
  loadDataFromStorage()
})

// 从本地存储加载数据
const loadDataFromStorage = () => {
  try {
    // 加载PTT数据
    const pttData = uni.getStorageSync('ptt_data')
    if (pttData) {
      currentPTT.value = pttData.currentPTT || 0
      best10Avg.value = pttData.best10Avg || 0
      best30Avg.value = pttData.best30Avg || 0
      recent10Avg.value = pttData.recent10Avg || 0
      
      // 格式化最后更新时间
      if (pttData.lastUpdated) {
        const date = new Date(pttData.lastUpdated)
        lastUpdated.value = formatDate(date)
      }
    }
    
    // 加载B30记录
    const records = uni.getStorageSync('best30_records') || []
    best30Records.value = records
    
    // 加载最近记录
    const recent = uni.getStorageSync('recent_scores') || []
    recentRecords.value = recent
    
    // 加载歌曲数据
    const songs = uni.getStorageSync('songs_data') || []
    songsCount.value = songs.length
  } catch (e) {
    console.error('加载数据失败', e)
  }
}

// 格式化日期
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${month}-${day} ${hours}:${minutes}`
}

// 刷新PTT数据
const refreshPTT = () => {
  try {
    // 重新计算PTT数据
    let currentPTTValue = 0
    let best10AvgValue = 0
    let best30AvgValue = 0
    let recent10AvgValue = 0
    
    if (best30Records.value.length > 0) {
      // 计算B30平均
      const best30Total = best30Records.value.reduce((sum, record) => sum + record.ptt, 0)
      best30AvgValue = best30Total / best30Records.value.length
      
      // 计算B10平均
      const top10Records = [...best30Records.value].sort((a, b) => b.ptt - a.ptt).slice(0, 10)
      const best10Total = top10Records.reduce((sum, record) => sum + record.ptt, 0)
      best10AvgValue = best10Total / top10Records.length
    }
    
    if (recentRecords.value.length > 0) {
      // 计算R10平均
      const recent10Total = recentRecords.value.reduce((sum, record) => sum + record.ptt, 0)
      recent10AvgValue = recent10Total / recentRecords.value.length
    }
    
    // 计算当前PTT (B10*0.75 + R10*0.25)
    currentPTTValue = best10AvgValue * 0.75 + recent10AvgValue * 0.25
    
    // 更新数据
    currentPTT.value = currentPTTValue
    best10Avg.value = best10AvgValue
    best30Avg.value = best30AvgValue
    recent10Avg.value = recent10AvgValue
    lastUpdated.value = formatDate(new Date())
    
    // 保存PTT数据
    const pttData = {
      currentPTT: currentPTTValue,
      best10Avg: best10AvgValue,
      best30Avg: best30AvgValue,
      recent10Avg: recent10AvgValue,
      lastUpdated: Date.now()
    }
    uni.setStorageSync('ptt_data', pttData)
    
    uni.showToast({
      title: '刷新成功',
      icon: 'success'
    })
  } catch (e) {
    console.error('刷新PTT失败', e)
    uni.showToast({
      title: '刷新失败',
      icon: 'none'
    })
  }
}

// 切换选项卡
const switchTab = (tab: 'best30' | 'recent') => {
  activeTab.value = tab
}

// 导出全部数据
const exportAllData = () => {
  try {
    const data = {
      best30Records: best30Records.value,
      recentRecords: recentRecords.value,
      pttData: {
        currentPTT: currentPTT.value,
        best10Avg: best10Avg.value,
        best30Avg: best30Avg.value,
        recent10Avg: recent10Avg.value
      },
      exportTime: new Date().toISOString(),
      version: '1.0.0',
      type: 'full-export'
    }
    
    const jsonStr = JSON.stringify(data, null, 2)
    const fileName = `arcaea-ptt-full-backup-${Date.now()}.json`
    
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
              
              if (data.type === 'full-export') {
                // 导入完整数据
                if (data.best30Records && Array.isArray(data.best30Records)) {
                  best30Records.value = data.best30Records
                  uni.setStorageSync('best30_records', data.best30Records)
                }
                
                if (data.recentRecords && Array.isArray(data.recentRecords)) {
                  recentRecords.value = data.recentRecords
                  uni.setStorageSync('recent_scores', data.recentRecords)
                }
                
                if (data.pttData) {
                  currentPTT.value = data.pttData.currentPTT || 0
                  best10Avg.value = data.pttData.best10Avg || 0
                  best30Avg.value = data.pttData.best30Avg || 0
                  recent10Avg.value = data.pttData.recent10Avg || 0
                  
                  if (data.pttData.lastUpdated) {
                    const date = new Date(data.pttData.lastUpdated)
                    lastUpdated.value = formatDate(date)
                  }
                  
                  uni.setStorageSync('ptt_data', {
                    currentPTT: currentPTT.value,
                    best10Avg: best10Avg.value,
                    best30Avg: best30Avg.value,
                    recent10Avg: recent10Avg.value,
                    lastUpdated: data.pttData.lastUpdated || Date.now()
                  })
                }
                
                uni.showToast({
                  title: '导入成功',
                  icon: 'success'
                })
              } else if (data.best30Records && Array.isArray(data.best30Records)) {
                // 兼容旧格式导入
                best30Records.value = data.best30Records
                uni.setStorageSync('best30_records', data.best30Records)
                refreshPTT()
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

// 同步数据
const syncData = () => {
  uni.showModal({
    title: '提示',
    content: '是否从云端同步数据？此功能需要登录云开发环境。',
    success: (res) => {
      if (res.confirm) {
        // 这里可以实现从云端同步数据的逻辑
        uni.showToast({
          title: '同步功能开发中',
          icon: 'none'
        })
      }
    }
  })
}

// 显示清空数据确认对话框
const showClearDialog = () => {
  uni.showModal({
    title: '确认清空',
    content: '确定要清空所有数据吗？此操作不可恢复！',
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
    // 清空所有数据
    uni.removeStorageSync('best30_records')
    uni.removeStorageSync('recent_scores')
    uni.removeStorageSync('ptt_data')
    
    // 重新加载默认数据
    currentPTT.value = 0
    best10Avg.value = 0
    best30Avg.value = 0
    recent10Avg.value = 0
    best30Records.value = []
    recentRecords.value = []
    lastUpdated.value = '未知'
    
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

// 跳转到B30页面
const goToBest30 = () => {
  uni.switchTab({
    url: '/pages/best30/best30'
  })
}

// 编辑记录
const editRecord = (index: number) => {
  const record = currentRecords.value[index]
  
  if (activeTab.value === 'best30') {
    // 编辑B30记录
    uni.navigateTo({
      url: `/pages/best30/add?edit=${index}`
    })
  } else {
    // 编辑最近记录
    uni.showModal({
      title: '提示',
      content: '最近记录无法直接编辑，您可以在B30页面中编辑。',
      showCancel: false
    })
  }
}

// 删除记录
const deleteRecord = (index: number) => {
  const record = currentRecords.value[index]
  
  uni.showModal({
    title: '确认删除',
    content: `确定要删除《${record.songName}》的记录吗？`,
    success: (res) => {
      if (res.confirm) {
        try {
          if (activeTab.value === 'best30') {
            // 从B30记录中删除
            best30Records.value.splice(index, 1)
            uni.setStorageSync('best30_records', best30Records.value)
            refreshPTT()
          } else {
            // 从最近记录中删除
            recentRecords.value.splice(index, 1)
            uni.setStorageSync('recent_scores', recentRecords.value)
            refreshPTT()
          }
          
          uni.showToast({
            title: '已删除',
            icon: 'success'
          })
        } catch (e) {
          console.error('删除记录失败', e)
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
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
}

.overview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.overview-card .card-title {
  color: white;
}

.overview-card .card-action {
  color: rgba(255, 255, 255, 0.8);
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

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 24rpx;
  text-align: center;
}

.stat-number {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.tabs {
  display: flex;
  background: white;
  border-radius: 20rpx;
  padding: 10rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.tab-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.tab-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #666;
  transition: color 0.3s ease;
}

.tab-item.active .tab-text {
  color: white;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.record-item {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 20rpx;
}

.record-rank {
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

.record-details {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 20rpx;
}

.record-score {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.record-ptt {
  font-size: 24rpx;
  color: #667eea;
  margin-bottom: 4rpx;
}

.record-rating {
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

.record-actions {
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