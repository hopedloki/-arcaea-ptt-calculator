<template>
  <view class="container">
    <!-- PTT概览 -->
    <view class="card overview-card">
      <view class="ptt-overview">
        <view class="ptt-value-container">
          <view class="ptt-value">
            <text class="value">{{ currentPTT.toFixed(2) }}</text>
            <text class="label">当前PTT</text>
          </view>
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
      <view class="ptt-progress">
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: getPTTProgress(currentPTT) + '%' }"></view>
        </view>
        <text class="progress-text">{{ getPTTProgressText(currentPTT) }}</text>
      </view>
      <view class="overview-actions">
        <button class="refresh-btn" @click="refreshPTT">
          <text class="refresh-icon">🔄</text>
          <text class="refresh-text">刷新数据</text>
        </button>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="actions">
      <button class="action-btn secondary" @click="exportAllData">
        <view class="btn-content">
          <text class="btn-icon">📤</text>
          <text class="btn-text">导出全部</text>
        </view>
      </button>
      <button class="action-btn secondary" @click="importData">
        <view class="btn-content">
          <text class="btn-icon">📥</text>
          <text class="btn-text">导入数据</text>
        </view>
      </button>
      <button class="action-btn danger" @click="showClearDialog">
        <view class="btn-content">
          <text class="btn-icon">🗑️</text>
          <text class="btn-text">清空数据</text>
        </view>
      </button>
    </view>

    <!-- 数据统计 -->
    <view class="card stats-card">
      <view class="card-header">
        <text class="card-title">数据统计</text>
        <view class="stats-toggle" @click="toggleStatsView">
          <text class="toggle-icon">{{ statsExpanded ? '▼' : '▶' }}</text>
        </view>
      </view>
      <view class="stats-grid" :class="{ expanded: statsExpanded }">
        <view class="stat-card" :class="{ highlight: best30Records.length > 0 }">
          <view class="stat-icon">🏆</view>
          <text class="stat-number">{{ best30Records.length }}</text>
          <text class="stat-label">B30记录</text>
        </view>
        <view class="stat-card" :class="{ highlight: recentRecords.length > 0 }">
          <view class="stat-icon">📊</view>
          <text class="stat-number">{{ recentRecords.length }}</text>
          <text class="stat-label">最近记录</text>
        </view>
        <view class="stat-card">
          <view class="stat-icon">⏰</view>
          <text class="stat-number">{{ lastUpdated }}</text>
          <text class="stat-label">最后更新</text>
        </view>
      </view>
    </view>

    <!-- 选项卡 -->
    <view class="tabs-container">
      <view class="tabs">
        <view
          v-if="!OFFLINE_MODE"
          class="tab-item" 
          :class="{ active: activeTab === 'best30' }"
          @click="switchTab('best30')"
        >
          <text class="tab-icon">🏆</text>
          <text class="tab-text">B30记录</text>
          <view class="tab-count">{{ best30Records.length }}</view>
          <view class="tab-indicator"></view>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'recent' }"
          @click="switchTab('recent')"
        >
          <text class="tab-icon">📊</text>
          <text class="tab-text">最近记录</text>
          <view class="tab-count">{{ recentRecords.length }}</view>
          <view class="tab-indicator"></view>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'cloud' }"
          @click="switchTab('cloud')"
        >
          <text class="tab-icon">☁️</text>
          <text class="tab-text">云端记录</text>
          <view class="tab-count">{{ cloudRecords.length }}</view>
          <view class="tab-indicator"></view>
        </view>
      </view>
    </view>

    <!-- 记录列表 -->
    <view class="card records-card">
      <view class="card-header">
        <text class="card-title">
          {{ activeTab === 'best30' ? 'B30记录' : activeTab === 'cloud' ? '云端记录' : '最近记录' }} ({{ currentRecords.length }})
        </text>
      </view>
      
      <view class="records-list" v-if="currentRecords.length > 0">
        <view 
          class="record-item" 
          v-for="(record, index) in currentRecords" 
          :key="index"
          :class="{ 'top-record': index < 3 }"
        >
          <view class="record-rank" :class="getRankClass(index)">
            {{ index + 1 }}
          </view>
          
          <view class="song-info">
            <text class="song-name">{{ record.songName }}</text>
            <view class="song-meta">
              <text class="song-difficulty" :class="getDifficultyClass(record.difficulty)">
                {{ getDifficultyText(record.difficulty) }}
              </text>
              <text class="song-constant">{{ record.constant }}</text>
            </view>
          </view>
          
          <view class="record-details">
            <text class="record-score">{{ record.score.toLocaleString() }}</text>
            <view class="record-stats">
              <text class="record-ptt">PTT {{ record.ptt.toFixed(2) }}</text>
              <view class="record-rating-container">
                <text class="record-rating" :class="getRatingClass(record.rating)">
                  {{ record.rating }}
                </text>
              </view>
            </view>
          </view>
          
          <view class="record-actions">
            <button class="action-btn-small edit-btn" @click="editRecord(index)">
              <text class="action-icon">✏️</text>
            </button>
            <button class="action-btn-small delete-btn" @click="deleteRecord(index)">
              <text class="action-icon">🗑️</text>
            </button>
          </view>
        </view>
      </view>
      
      <view class="empty-state" v-else>
        <view class="empty-illustration">
          <view class="empty-circle">
            <text class="empty-icon">{{ activeTab === 'best30' ? '🏆' : activeTab === 'cloud' ? '☁️' : '📊' }}</text>
          </view>
        </view>
        <view class="empty-content">
          <text class="empty-title">
            {{ activeTab === 'best30' ? '还没有B30记录' : activeTab === 'cloud' ? '还没有云端记录' : '还没有最近成绩' }}
          </text>
          <text class="empty-subtitle">
            {{ activeTab === 'best30' 
              ? '开始记录您的最佳成绩，构建您的B30列表' 
              : activeTab === 'cloud'
                ? '上传成绩到云端后，可以在这里查看历史记录'
                : '记录您最近的游戏成绩，追踪PTT变化' }}
          </text>
          <view class="empty-stats">
            <view class="empty-stat-item">
              <text class="stat-number">0</text>
              <text class="stat-label">
                {{ activeTab === 'best30' ? '最佳记录' : '最近记录' }}
              </text>
            </view>
            <view class="empty-stat-divider"></view>
            <view class="empty-stat-item">
              <text class="stat-number">0.00</text>
              <text class="stat-label">平均PTT</text>
            </view>
          </view>
          <button class="empty-btn" @click="goToBest30">
            <text class="empty-btn-text">去添加成绩</text>
            <text class="empty-btn-icon">→</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 数据管理页
 * 集中管理 B30 记录、最近成绩、云端记录的查看/编辑/删除
 * 提供数据导出（JSON文件/云端上传）和数据导入（本地文件/云端同步）功能
 * 支持三个选项卡切换：B30记录、最近记录、云端记录
 * 依赖 authStore 进行云端数据的拉取和上传
 */
import { ref, computed, onMounted } from 'vue'
import { authStore } from '@/stores/authStore'
import { getDifficultyText, getDifficultyClass, getRatingClass, getPTTProgress, getPTTProgressText } from '../../utils/helpers'
import { getStorage, setStorage } from '../../services/storage'
import { showSuccess, showError, showLoading, hideLoading } from '../../services/toast'
import { fetchCloudRecords as cloudFetchRecords, uploadCloudRecords } from '../../services/cloud-service'
import { STORAGE_KEYS, OFFLINE_MODE } from '../../constants'
import { isOnline } from '../../services/network'
import { pttStore } from '../../stores/pttStore'
import type { Best30Record } from '../../types'

// authStore and pttStore are directly imported

// PTT 概览数据 — 从 pttStore 单一数据源获取（加 .value 解包嵌套 ref）
const currentPTT = computed(() => pttStore.currentPTT.value)
const best10Avg = computed(() => pttStore.best10Avg.value)
const best30Avg = computed(() => pttStore.best30Avg.value)
const recent10Avg = computed(() => pttStore.recent10Avg.value)
const lastUpdated = ref('未知')

// 本地记录数据
const best30Records = ref<Best30Record[]>([])
const recentRecords = ref<Best30Record[]>([])
const songsCount = ref(0)

// 当前选中的选项卡
const activeTab = ref<'best30' | 'recent' | 'cloud'>('best30')

// 统计区域展开/折叠状态
const statsExpanded = ref(true)

// 云端记录和加载状态
const cloudRecords = ref<Best30Record[]>([])
const cloudLoading = ref(false)

// 当前显示的记录列表 — 根据 activeTab 动态计算
const currentRecords = computed(() => {
  if (activeTab.value === 'cloud') return cloudRecords.value
  return activeTab.value === 'best30' ? best30Records.value : recentRecords.value
})

// 页面挂载 — 从本地存储加载所有数据
onMounted(() => {
  loadDataFromStorage()
})

// 从本地存储加载 B30 记录、最近成绩；PTT 概览由 pttStore 单一数据源管理
const loadDataFromStorage = () => {
  try {
    // 初始化 pttStore（内部从 storage 读取并计算 PTT）
    pttStore.initStore()

    // 同步 lastUpdated 显示
    const pttData = pttStore.pttData.value
    if (pttData?.lastUpdated) {
      lastUpdated.value = formatDate(new Date(pttData.lastUpdated))
    }

    // 本地记录供列表展示使用（PTT 计算由 pttStore 负责）
    best30Records.value = getStorage<Best30Record[]>(STORAGE_KEYS.BEST30_RECORDS, [])
    recentRecords.value = getStorage<Best30Record[]>(STORAGE_KEYS.RECENT_SCORES, [])

    const songs = getStorage(STORAGE_KEYS.SONGS_DATA, [])
    songsCount.value = songs.length
  } catch (e) {
    // #ifdef dev
    console.error('加载数据失败', e)
    // #endif
  }
}

// 切换统计区域展开/折叠
const toggleStatsView = () => {
  statsExpanded.value = !statsExpanded.value
}

// 格式化日期为简短显示（MM-DD HH:mm）
const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${month}-${day} ${hours}:${minutes}`
}

// 刷新 PTT 数据 — 委托 pttStore 重新计算并持久化（单一数据源）
const refreshPTT = () => {
  try {
    pttStore.importRecords(best30Records.value, recentRecords.value)

    // 同步 lastUpdated 显示（pttStore 内部已更新 pttData.lastUpdated）
    const lastUpdated_ts = pttStore.pttData.value?.lastUpdated
    if (lastUpdated_ts) {
      lastUpdated.value = formatDate(new Date(lastUpdated_ts))
    }

    showSuccess('刷新成功')
  } catch (e) {
    // #ifdef dev
    console.error('刷新PTT失败', e)
    // #endif
    showError('刷新失败')
  }
}

// 切换选项卡 — 切换到云端记录时自动拉取数据
const switchTab = (tab: 'best30' | 'recent' | 'cloud') => {
  if (tab === 'cloud' && OFFLINE_MODE) {
    showError('离线版不支持云端记录')
    return
  }
  activeTab.value = tab
  if (tab === 'cloud') {
    if (!isOnline.value) {
      showError('当前无网络连接，无法加载云端记录')
      return
    }
    fetchCloudRecords()
  }
}

// 导出全部数据 — 弹出双选项菜单（本地JSON / 云端上传）
const exportAllData = () => {
  const items = OFFLINE_MODE || !isOnline.value
    ? ['导出为JSON文件（下载到本地）']
    : ['导出为JSON文件（下载到本地）', '云端上传至MySQL数据库']
  uni.showActionSheet({
    itemList: items,
    success: (res) => {
      if (res.tapIndex === 0) {
        exportAsJson()
      } else if (res.tapIndex === 1) {
        uploadToCloud()
      }
    }
  })
}

// 导出为JSON文件 — H5端下载文件，非H5端复制到剪贴板
const exportAsJson = () => {
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
    
    // #ifdef H5
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(url) }, 100)
    showSuccess('导出成功')
    // #endif

    // #ifndef H5
    const fileManager = uni.getFileSystemManager()
    const tempFilePath = `${uni.env.USER_DATA_PATH || ''}${fileName}`
    fileManager.writeFile({
      filePath: tempFilePath,
      data: jsonStr,
      encoding: 'utf8',
      success: () => {
        uni.setClipboardData({
          data: jsonStr,
          success: () => {
            showError('已复制到剪贴板')
          }
        })
      },
      fail: () => {
        showError('导出失败')
      }
    })
    // #endif
  } catch (e) {
    // #ifdef dev
    console.error('导出数据失败', e)
    // #endif
    showError('导出失败')
  }
}

// 上传 B30 记录到云端 — 需先登录
const uploadToCloud = async () => {
  if (OFFLINE_MODE) {
    showError('离线版不支持云端存储')
    return
  }
  if (!authStore.state.isLoggedIn) {
    uni.showModal({
      title: '需要登录',
      content: '请先登录后再上传成绩到云端',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
    return
  }

  const recordsToUpload = best30Records.value.map((r) => ({
    songName: r.songName,
    difficulty: r.difficulty,
    constant: r.constant,
    score: r.score,
    ptt: r.ptt,
    rating: r.rating,
    pureCount: r.pureCount,
    farCount: r.farCount,
    lostCount: r.lostCount,
    remark: r.remark,
    recordTime: r.timestamp || Date.now()
  }))

  // 检查缺失定数的记录
  const missingConstant = recordsToUpload.filter(r => !r.constant || r.constant <= 0)
  if (missingConstant.length > 0) {
    const names = missingConstant.map(r => `${r.songName}(${r.difficulty})`).join('、')
    uni.showModal({
      title: '定数缺失',
      content: `以下记录定数缺失: ${names}\n\n将继续上传，由服务端尝试自动补全。`,
      showCancel: false
    })
  }

  if (recordsToUpload.length === 0) {
    showError('没有可上传的记录')
    return
  }

  uni.showModal({
    title: '确认上传',
    content: `将上传 ${recordsToUpload.length} 条B30记录到云端，是否继续？`,
    success: async (res) => {
      if (!res.confirm) return

      showLoading('上传中...')
      try {
        const totalPtt = recordsToUpload.reduce((sum, r) => sum + (r.ptt || 0), 0)
        const currentPtt = recordsToUpload.length > 0 ? parseFloat((totalPtt / recordsToUpload.length).toFixed(2)) : 0

        await uploadCloudRecords(Number(authStore.state.userId), recordsToUpload, currentPtt)
        hideLoading()
        showSuccess('上传成功')
      } catch (e) {
        hideLoading()
        showError('网络异常，上传失败')
      }
    }
  })
}

// 导入数据 — 弹出双选项菜单（本地文件 / 云端同步）
const importData = () => {
  const items = OFFLINE_MODE || !isOnline.value
    ? ['本地导入（从JSON文件）']
    : ['本地导入（从JSON文件）', '云端同步（从MySQL数据库）']
  uni.showActionSheet({
    itemList: items,
    success: (res) => {
      if (res.tapIndex === 0) {
        importFromLocal()
      } else if (res.tapIndex === 1) {
        syncFromCloud()
      }
    }
  })
}

// 从本地JSON文件导入 — H5端 FileReader 读取，非H5端 uni.chooseFile
const importFromLocal = () => {
  // #ifdef H5
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const jsonStr = event.target?.result as string
          processImportData(jsonStr)
        } catch (err) {
          showError('读取文件失败')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
  // #endif

  // #ifndef H5
  // @dcloudio/types 的 chooseFile 选项类型与小程序端实际 API 不一致，这里按实际用法断言
  uni.chooseFile({
    count: 1,
    type: 'file',
    extension: ['.json'],
    success: (res: { tempFilePaths: string[] }) => {
      const tempFilePaths = res.tempFilePaths
      if (tempFilePaths && tempFilePaths.length > 0) {
        const fileManager = uni.getFileSystemManager()
        fileManager.readFile({
          filePath: tempFilePaths[0],
          encoding: 'utf8',
          success: (readRes) => {
            const content = typeof readRes.data === 'string' ? readRes.data : ''
            processImportData(content)
          },
          fail: (err) => {
            // #ifdef dev
            console.error('读取文件失败', err)
            // #endif
            showError('读取文件失败')
          }
        })
      }
    },
    fail: () => {
      uni.showModal({
        title: '导入提示',
        content: '请将备份的JSON文件放到可访问位置后重试，或使用剪贴板导入',
        confirmText: '剪贴板导入',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.getClipboardData({
              success: (clipRes) => {
                if (clipRes.data) {
                  processImportData(clipRes.data)
                } else {
                  showError('剪贴板为空')
                }
              }
            })
          }
        }
      })
    }
  } as any)
  // #endif
}

// 从云端同步记录到本地 — 需先登录
const syncFromCloud = () => {
  if (OFFLINE_MODE) {
    showError('离线版不支持云端存储')
    return
  }
  if (!authStore.state.isLoggedIn) {
    uni.showModal({
      title: '需要登录',
      content: '请先登录后再从云端同步数据',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
    return
  }

  uni.showModal({
    title: '云端同步',
    content: '将从云端拉取已上传的历史记录到本地，是否继续？',
    success: async (res) => {
      if (!res.confirm) return
      await fetchCloudRecords()
      // 将云端记录同步到本地存储
      if (cloudRecords.value.length > 0) {
        best30Records.value = cloudRecords.value
        setStorage(STORAGE_KEYS.BEST30_RECORDS, cloudRecords.value)
        refreshPTT()
        showSuccess(`已同步 ${cloudRecords.value.length} 条记录`)
      } else {
        showError('云端没有可同步的记录')
      }
    }
  })
}

// 解析导入的 JSON 数据 — 兼容完整导出格式和旧版 B30 格式
const processImportData = (jsonStr: string) => {
  try {
    const data = JSON.parse(jsonStr)

    if (data.type === 'full-export') {
      // 导入完整数据
      if (data.best30Records && Array.isArray(data.best30Records)) {
        best30Records.value = data.best30Records
        setStorage(STORAGE_KEYS.BEST30_RECORDS, data.best30Records)
      }

      if (data.recentRecords && Array.isArray(data.recentRecords)) {
        recentRecords.value = data.recentRecords
        setStorage(STORAGE_KEYS.RECENT_SCORES, data.recentRecords)
      }

      // 通过 pttStore 重新计算 PTT 并持久化（单一数据源，避免直接写 PTT_DATA）
      refreshPTT()
      showSuccess('导入成功')
    } else if (data.best30Records && Array.isArray(data.best30Records)) {
      // 兼容旧格式导入
      best30Records.value = data.best30Records
      setStorage(STORAGE_KEYS.BEST30_RECORDS, data.best30Records)
      refreshPTT()
      showSuccess('导入成功')
    } else {
      showError('数据格式不正确')
    }
  } catch (e) {
    // #ifdef dev
    console.error('解析数据失败', e)
    // #endif
    showError('数据格式不正确')
  }
}

//   从云端拉取历史记录
const fetchCloudRecords = async () => {
  if (!authStore.state.isLoggedIn) {
    cloudRecords.value = []
    return
  }

  cloudLoading.value = true
  try {
    const records = await cloudFetchRecords(Number(authStore.state.userId))
    cloudRecords.value = records.map((r) => ({
      ...r,
      cloudId: r.id
    }))
  } catch (e) {
    showError('拉取失败，请检查网络')
  } finally {
    cloudLoading.value = false
  }
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
    // 通过 pttStore 清空记录并重置 PTT（内部会同步 storage）
    pttStore.clearAllRecords()

    // 重置本地展示数据
    best30Records.value = []
    recentRecords.value = []
    lastUpdated.value = '未知'

    showSuccess('已清空所有数据')
  } catch (e) {
    // #ifdef dev
    console.error('清空数据失败', e)
    // #endif
    showError('清空失败')
  }
}

// 跳转到B30页面
const goToBest30 = () => {
  uni.navigateTo({
    url: '/pages/best30/best30'
  })
}

// 编辑记录
const editRecord = (index: number) => {
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
            setStorage(STORAGE_KEYS.BEST30_RECORDS, best30Records.value)
            refreshPTT()
          } else {
            // 从最近记录中删除
            recentRecords.value.splice(index, 1)
            setStorage(STORAGE_KEYS.RECENT_SCORES, recentRecords.value)
            refreshPTT()
          }

          showSuccess('已删除')
        } catch (e) {
          // #ifdef dev
            console.error('删除记录失败', e)
            // #endif
          showError('删除失败')
        }
      }
    }
  })
}

const getRankClass = (index: number): string => {
  if (index === 0) return 'rank-first'
  if (index === 1) return 'rank-second'
  if (index === 2) return 'rank-third'
  return ''
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

.stats-toggle {
  padding: 8rpx 12rpx;
  border-radius: 12rpx;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.stats-toggle:active {
  background: #e9ecef;
}

.toggle-icon {
  font-size: 24rpx;
  color: #666;
  line-height: 1;
}

.overview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.4);
  margin-bottom: 30rpx;
}

/* Web端特殊样式 */
// #ifdef H5
@media (min-width: 768px) {
  .overview-card {
    max-width: 800px;
    margin: 0 auto 30rpx;
    border-radius: 24rpx;
  }
}
// #endif

/* 添加动态背景效果 */
.overview-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 20rpx 20rpx;
  animation: backgroundMove 20s linear infinite;
  z-index: 0;
}

@keyframes backgroundMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(20rpx, 20rpx); }
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
  position: relative;
  z-index: 1;
  padding-bottom: 20rpx;
}

.ptt-value-container {
  text-align: center;
  flex: 1;
  position: relative;
}

.ptt-value {
  position: relative;
}

.value {
  font-size: 80rpx;
  font-weight: bold;
  display: block;
  line-height: 1.1;
  text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
  /* 添加响应式字体大小 */
  // #ifdef H5
  font-size: 3.5rem;
  // #endif
}

.label {
  font-size: 26rpx;
  opacity: 0.9;
  margin-top: 5rpx;
  display: block;
}

.ptt-indicator {
  margin-top: 10rpx;
}

.indicator-text {
  font-size: 22rpx;
  background: rgba(255, 255, 255, 0.2);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  display: inline-block;
  backdrop-filter: blur(10rpx);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.ptt-stats {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  flex: 2;
  background: rgba(255, 255, 255, 0.1);
  padding: 24rpx;
  border-radius: 20rpx;
  backdrop-filter: blur(10rpx);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8rpx 0;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
}

.stat-label {
  font-size: 26rpx;
  opacity: 0.9;
}

/* 进度条样式 */
.ptt-progress {
  margin-top: 24rpx;
  position: relative;
  z-index: 1;
}

.progress-bar {
  height: 12rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.9) 100%);
  border-radius: 6rpx;
  transition: width 1s ease-in-out;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
  animation: progressShine 2s infinite;
}

@keyframes progressShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  font-size: 24rpx;
  opacity: 0.8;
  text-align: right;
  display: block;
}

/* 刷新按钮样式 */
.overview-actions {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
  position: relative;
  z-index: 1;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 40rpx;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200rpx;
  height: 60rpx;
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
}

.refresh-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.98);
}

.refresh-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
  animation: rotate 2s linear infinite paused;
}

.refresh-btn:active .refresh-icon {
  animation-play-state: running;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.refresh-text {
  font-size: 26rpx;
  font-weight: 600;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

/* Web端响应式布局 */
// #ifdef H5
@media (min-width: 768px) {
  .actions {
    max-width: 800px;
    margin: 0 auto 24rpx;
  }
}
// #endif

.action-btn {
  flex: 1;
  border-radius: 20rpx;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 140rpx;
}

/* 按钮波纹效果 */
.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.action-btn:active::before {
  width: 300rpx;
  height: 300rpx;
}

.btn-content {
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

/* 次要按钮样式 */
.action-btn.secondary {
  background: white;
  color: #333;
  border: 2rpx solid #f0f2f5;
}

.action-btn.secondary:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

/* 危险按钮样式 */
.action-btn.danger {
  background: white;
  color: #f56565;
  border: 2rpx solid #feb2b2;
}

.action-btn.danger:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 10rpx 30rpx rgba(245, 101, 101, 0.2);
  background: #fff5f5;
}

.btn-icon {
  font-size: 44rpx;
  margin-bottom: 12rpx;
  display: block;
  line-height: 1;
}

.btn-text {
  font-size: 26rpx;
  font-weight: 500;
  display: block;
  line-height: 1.2;
}

/* 按钮图标和文本颜色适配 */
.action-btn.secondary .btn-text {
  color: #4a5568;
}

.action-btn.danger .btn-text {
  color: #e53e3e;
}

/* Web端特殊交互效果 */
// #ifdef H5
.action-btn:hover {
  transform: translateY(-4rpx);
}

.action-btn:active {
  transform: translateY(0);
}
// #endif

/* 移动端触摸反馈 */
// #ifndef H5
.action-btn:active {
  transform: scale(0.98);
}
// #endif

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.stats-grid.expanded {
  max-height: 500rpx;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 20rpx;
  padding: 24rpx;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-card.highlight {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 2rpx solid rgba(102, 126, 234, 0.2);
}

.stat-card:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 40rpx;
  margin-bottom: 12rpx;
  display: block;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
}

.stat-number {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
  line-height: 1.2;
}

.stat-card.highlight .stat-number {
  color: #667eea;
}

.tabs-container {
  background: white;
  border-radius: 24rpx;
  padding: 12rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

/* Web端响应式布局 */
// #ifdef H5
@media (min-width: 768px) {
  .tabs-container {
    max-width: 800px;
    margin: 0 auto 24rpx;
  }
}
// #endif

.tabs {
  display: flex;
  position: relative;
}

.tab-item {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  border-radius: 20rpx;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tab-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.02);
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.tab-item:not(.active):hover {
  background: #f8f9fa;
}

.tab-icon {
  font-size: 32rpx;
  display: block;
  margin-bottom: 8rpx;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
}

.tab-text {
  font-size: 26rpx;
  font-weight: 600;
  transition: color 0.3s ease;
  line-height: 1.2;
}

.tab-item.active .tab-text {
  color: white;
}

.tab-count {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  background: rgba(255, 255, 255, 0.2);
  color: #333;
  font-size: 20rpx;
  font-weight: bold;
  padding: 4rpx 8rpx;
  border-radius: 10rpx;
  min-width: 24rpx;
  text-align: center;
}

.tab-item.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4rpx;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2rpx;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tab-item.active .tab-indicator {
  transform: scaleX(1);
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* Web端响应式布局 */
// #ifdef H5
@media (min-width: 768px) {
  .records-list {
    max-width: 800px;
    margin: 0 auto;
  }
}
// #endif

.record-item {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 20rpx;
  padding: 24rpx;
  position: relative;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border: 2rpx solid transparent;
}

.record-item:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
}

/* 前三名特殊样式 */
.record-item.top-record {
  border-color: rgba(102, 126, 234, 0.2);
}

.record-item.top-record:nth-child(1) {
  border-color: rgba(255, 215, 0, 0.4);
  background: linear-gradient(to right, rgba(255, 215, 0, 0.05), white);
}

.record-item.top-record:nth-child(2) {
  border-color: rgba(192, 192, 192, 0.4);
  background: linear-gradient(to right, rgba(192, 192, 192, 0.05), white);
}

.record-item.top-record:nth-child(3) {
  border-color: rgba(205, 127, 50, 0.4);
  background: linear-gradient(to right, rgba(205, 127, 50, 0.05), white);
}

.record-rank {
  width: 60rpx;
  height: 60rpx;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: bold;
  margin-right: 24rpx;
  box-shadow: 0 4rpx 10rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

/* 前三名特殊排名样式 */
.record-rank.rank-first {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
  box-shadow: 0 4rpx 15rpx rgba(255, 215, 0, 0.4);
}

.record-rank.rank-second {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #333;
  box-shadow: 0 4rpx 15rpx rgba(192, 192, 192, 0.4);
}

.record-rank.rank-third {
  background: linear-gradient(135deg, #cd7f32, #e8a75d);
  color: white;
  box-shadow: 0 4rpx 15rpx rgba(205, 127, 50, 0.4);
  font-size: 26rpx;
  font-weight: bold;
  margin-right: 20rpx;
}

.song-info {
  flex: 2;
  margin-right: 20rpx;
}

.song-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
  line-height: 1.3;
}

.song-meta {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.song-difficulty {
  font-size: 24rpx;
  font-weight: 600;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  line-height: 1.2;
}

.song-constant {
  font-size: 24rpx;
  color: #666;
  background: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.record-details {
  flex: 1;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.record-score {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.2;
}

.record-stats {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.record-ptt {
  font-size: 24rpx;
  color: #667eea;
  font-weight: 600;
}

.record-rating-container {
  display: flex;
  justify-content: flex-end;
}

.record-rating {
  font-size: 24rpx;
  font-weight: bold;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  line-height: 1.2;
}

.record-actions {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-left: 16rpx;
}

.action-btn-small {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-btn-small:hover {
  transform: scale(1.1);
}

.action-btn-small:active {
  transform: scale(0.95);
}

.action-icon {
  font-size: 28rpx;
  line-height: 1;
}

.edit-btn {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.edit-btn:hover {
  background: rgba(33, 150, 243, 0.2);
}

.delete-btn {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.delete-btn:hover {
  background: rgba(244, 67, 54, 0.2);
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

/* 改进的空状态样式 */
.empty-illustration {
  margin-bottom: 40rpx;
  position: relative;
}

.empty-circle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
}

.empty-circle::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.1;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.1); opacity: 0.05; }
}

.empty-icon {
  font-size: 70rpx;
  line-height: 1;
  z-index: 1;
}

.empty-content {
  max-width: 500rpx;
}

.empty-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
  line-height: 1.3;
}

.empty-subtitle {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 40rpx;
  display: block;
  line-height: 1.4;
}

.empty-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
  background: #f8f9fa;
  border-radius: 20rpx;
  padding: 24rpx 40rpx;
}

.empty-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: #e0e0e0;
  margin: 0 40rpx;
}

/* 全局过渡动画效果 */
.container {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

/* 卡片入场动画 */
.card {
  animation: slideUp 0.6s ease-out backwards;
}

.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30rpx); }
  to { opacity: 1; transform: translateY(0); }
}

/* 列表项入场动画 */
.record-item {
  animation: slideInLeft 0.5s ease-out backwards;
}

.record-item:nth-child(1) { animation-delay: 0.05s; }
.record-item:nth-child(2) { animation-delay: 0.1s; }
.record-item:nth-child(3) { animation-delay: 0.15s; }
.record-item:nth-child(4) { animation-delay: 0.2s; }
.record-item:nth-child(5) { animation-delay: 0.25s; }

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20rpx); }
  to { opacity: 1; transform: translateX(0); }
}

/* 悬停效果增强 */
.record-item:hover .record-score {
  transform: scale(1.05);
  color: #667eea;
}

.record-item:hover .record-rank {
  transform: scale(1.1) rotate(5deg);
}

/* 排名徽章悬停效果 */
.record-rank {
  transition: all 0.3s ease;
}

/* Web端特殊动画效果 */
// #ifdef H5
.record-item {
  position: relative;
}

.record-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.05), transparent);
  transition: width 0.6s ease;
}

.record-item:hover::before {
  width: 100%;
}
// #endif

/* 移动端触摸反馈增强 */
// #ifndef H5
.record-item:active {
  transform: scale(0.98);
  background: #f8f9fa;
}

.action-btn-small:active {
  transform: scale(0.96);
}
// #endif
</style>
