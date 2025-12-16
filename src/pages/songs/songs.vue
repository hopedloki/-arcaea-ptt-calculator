<template>
  <view class="container">
    <!-- 搜索和筛选 -->
    <view class="card search-card">
      <view class="search-bar">
        <input 
          class="search-input" 
          v-model="searchText" 
          placeholder="搜索歌曲名称..."
          @input="onSearchInput"
        />
        <button class="search-btn" @click="search">搜索</button>
      </view>
      
      <view class="filter-row">
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
          <text class="filter-label">定数范围</text>
          <picker 
            :range="constantRangeOptions" 
            range-key="name"
            :value="constantRangeIndex"
            @change="onConstantRangeChange"
            class="picker"
          >
            <view class="picker-text">
              {{ constantRangeOptions[constantRangeIndex].name }}
            </view>
          </picker>
        </view>
      </view>
    </view>

    <!-- 歌曲列表 -->
    <view class="card songs-card">
      <view class="card-header">
        <text class="card-title">歌曲列表 ({{ filteredSongs.length }})</text>
      </view>
      
      <view class="songs-list" v-if="filteredSongs.length > 0">
        <view 
          class="song-item" 
          v-for="(song, index) in filteredSongs" 
          :key="index"
          @click="selectSong(song)"
        >
          <view class="song-info">
            <text class="song-name">{{ song.name }}</text>
            <text class="song-artist">{{ song.artist || '' }}</text>
          </view>
          
          <view class="song-difficulties">
            <view 
              class="difficulty-item" 
              v-for="(difficulty, key) in getAvailableDifficulties(song)"
              :key="key"
              :class="getDifficultyClass(key)"
              @click.stop="selectSongWithDifficulty(song, key)"
            >
              <text class="difficulty-name">{{ difficulty.name }}</text>
              <text class="difficulty-constant">{{ difficulty.constant }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="empty-state" v-else>
        <text class="empty-icon">🎵</text>
        <text class="empty-text">没有找到符合条件的歌曲</text>
        <button class="reset-btn" @click="resetFilters">重置筛选条件</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { loadSongsData, initializeSongsDatabase } from '@/utils/songs-database'
// 直接导入歌曲常量数据
import { getSongsData } from '@/utils/song-constants.js'

// 页面来源
const fromPage = ref('')

// 搜索文本
const searchText = ref('')

// 筛选选项
const difficultyOptions = [
  { name: '全部难度', value: 'all' },
  { name: '有PAST', value: 'pst' },
  { name: '有PRESENT', value: 'prs' },
  { name: '有FUTURE', value: 'ftr' },
  { name: '有BEYOND', value: 'byd' },
  { name: '有ETERNAL', value: 'etr' }
]
const difficultyIndex = ref(0)

const constantRangeOptions = [
  { name: '全部定数', min: 0, max: 20 },
  { name: '1-3', min: 1, max: 3 },
  { name: '3-5', min: 3, max: 5 },
  { name: '5-7', min: 5, max: 7 },
  { name: '7-9', min: 7, max: 9 },
  { name: '9-11', min: 9, max: 11 },
  { name: '11-13', min: 11, max: 13 }
]
const constantRangeIndex = ref(0)

// 歌曲数据
const songsData = ref<any[]>([])

// 筛选后的歌曲
const filteredSongs = computed(() => {
  let filtered = [...songsData.value]
  
  // 文本搜索
  if (searchText.value.trim()) {
    const searchLower = searchText.value.toLowerCase()
    filtered = filtered.filter(song => 
      song.name.toLowerCase().includes(searchLower) ||
      (song.artist && song.artist.toLowerCase().includes(searchLower))
    )
  }
  
  // 难度筛选
  if (difficultyOptions[difficultyIndex.value].value !== 'all') {
    const requiredDifficulty = difficultyOptions[difficultyIndex.value].value
    filtered = filtered.filter(song => 
      song[requiredDifficulty] !== null && song[requiredDifficulty] !== undefined
    )
  }
  
  // 定数范围筛选
  const range = constantRangeOptions[constantRangeIndex.value]
  if (range.min > 0 || range.max < 20) {
    filtered = filtered.filter(song => {
      const difficulties = ['pst', 'prs', 'ftr', 'byd', 'etr']
      return difficulties.some(diff => {
        const constant = song[diff]
        return constant !== null && 
               constant !== undefined && 
               constant >= range.min && 
               constant < range.max
      })
    })
  }
  
  return filtered
})

// 页面加载时获取数据
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options as any
  
  if (options && options.from) {
    fromPage.value = options.from
  }
  
  loadSongs()
})

// 加载歌曲数据
const loadSongs = () => {
  // 从本地存储加载歌曲数据
  try {
    const localSongs = loadSongsData()
    
    if (localSongs && localSongs.length > 0) {
      songsData.value = localSongs
      console.log('从本地存储加载歌曲数据，共', localSongs.length, '首歌曲')
    } else {
      // 本地没有数据，直接加载完整歌曲数据
      console.log('本地没有数据，直接加载完整歌曲数据')
      loadCompleteSongsData()
    }
  } catch (e) {
    console.error('加载歌曲数据失败', e)
    loadCompleteSongsData()
  }
}

// 加载完整的歌曲数据
const loadCompleteSongsData = () => {
  // 直接使用静态导入的歌曲常量数据
  try {
    const songsArray = getSongsData()
    songsData.value = songsArray
    // 保存到本地存储
    try {
      uni.setStorageSync('songs_data', songsArray)
      console.log('加载完整歌曲数据成功，共', songsArray.length, '首歌曲')
    } catch (storageErr) {
      console.error('存储数据失败:', storageErr)
    }
  } catch (e) {
    console.error('加载歌曲常量失败:', e)
  }
}



// 搜索输入变化
const onSearchInput = () => {
  // 实时搜索，这里不需要额外操作
}

// 搜索
const search = () => {
  // 搜索逻辑已经在computed中实现
  console.log('搜索歌曲:', searchText.value)
}

// 难度选择变化
const onDifficultyChange = (e: any) => {
  difficultyIndex.value = e.detail.value
}

// 定数范围选择变化
const onConstantRangeChange = (e: any) => {
  constantRangeIndex.value = e.detail.value
}

// 重置筛选条件
const resetFilters = () => {
  searchText.value = ''
  difficultyIndex.value = 0
  constantRangeIndex.value = 0
}

// 获取可用难度
const getAvailableDifficulties = (song: any) => {
  const difficulties = {
    pst: { name: 'PST', constant: song.pst },
    prs: { name: 'PRS', constant: song.prs },
    ftr: { name: 'FTR', constant: song.ftr },
    byd: { name: 'BYD', constant: song.byd },
    etr: { name: 'ETR', constant: song.etr }
  }
  
  // 过滤掉不存在的难度
  const available: any = {}
  for (const key in difficulties) {
    if (difficulties[key].constant !== null && difficulties[key].constant !== undefined) {
      available[key] = difficulties[key]
    }
  }
  
  return available
}

// 选择歌曲
const selectSong = (song: any) => {
  // 默认选择FTR难度（如果有）
  const difficulty = song.ftr !== null && song.ftr !== undefined ? 'ftr' : 
                    song.prs !== null && song.prs !== undefined ? 'prs' : 
                    song.pst !== null && song.pst !== undefined ? 'pst' : ''
  
  if (difficulty) {
    selectSongWithDifficulty(song, difficulty)
  }
}

// 选择特定难度的歌曲
const selectSongWithDifficulty = (song: any, difficulty: string) => {
  const selectedSong = {
    name: song.name,
    artist: song.artist,
    difficulty,
    constant: song[difficulty]
  }
  
  // 保存最近选择的歌曲
  uni.setStorageSync('recent_song', selectedSong)
  
  // 返回来源页面
  navigateBackToSource(selectedSong)
}

// 返回来源页面
const navigateBackToSource = (selectedSong: any) => {
  if (fromPage.value === 'calculator') {
    // 返回到计算器页面，并传递选中的歌曲信息
    uni.navigateBack()
    
    // 使用事件通知父页面
    uni.$emit('songSelected', selectedSong)
  } else if (fromPage.value === 'tolerance') {
    // 返回到容错计算页面
    uni.navigateBack()
    
    // 使用事件通知父页面
    uni.$emit('songSelected', selectedSong)
  } else if (fromPage.value === 'add') {
    // 返回到添加成绩页面
    uni.navigateBack()
    
    // 使用事件通知父页面
    uni.$emit('songSelected', selectedSong)
  } else {
    // 默认返回上一页
    uni.navigateBack()
  }
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

.search-bar {
  display: flex;
  margin-bottom: 20rpx;
}

.search-input {
  flex: 1;
  height: 80rpx;
  background: #f8f9fa;
  border-radius: 16rpx 0 0 16rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.search-btn {
  width: 120rpx;
  height: 80rpx;
  background: #667eea;
  color: white;
  border-radius: 0 16rpx 16rpx 0;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.filter-row {
  display: flex;
  gap: 20rpx;
}

.filter-item {
  flex: 1;
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
  font-size: 26rpx;
  color: #333;
}

.card-header {
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.songs-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.song-item {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 20rpx;
}

.song-info {
  margin-bottom: 16rpx;
}

.song-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
  display: block;
}

.song-artist {
  font-size: 24rpx;
  color: #666;
}

.song-difficulties {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.difficulty-item {
  padding: 12rpx 16rpx;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80rpx;
}

.difficulty-name {
  font-size: 24rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 4rpx;
}

.difficulty-constant {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.difficulty-pst {
  background: #4caf50;
}

.difficulty-prs {
  background: #2196f3;
}

.difficulty-ftr {
  background: #ff9800;
}

.difficulty-byd {
  background: #f44336;
}

.difficulty-etr {
  background: #9c27b0;
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
  text-align: center;
}

.reset-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 40rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
  border: none;
}
</style>