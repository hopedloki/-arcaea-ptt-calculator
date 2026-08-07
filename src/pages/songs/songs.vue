<template>
  <view class="container">
    <!-- 搜索和筛选 -->
    <view class="card search-card">
      <view class="search-bar">
        <input
          class="search-input"
          v-model="searchText"
          placeholder="搜索歌曲名称..."
        />
        <button class="search-btn" @click="search">搜索</button>
      </view>
      
      <view class="filter-row">
        <view class="filter-item full-width">
          <text class="filter-label">曲包</text>
          <picker 
            :range="packOptions" 
            :value="packIndex"
            @change="onPackChange"
            class="picker"
          >
            <view class="picker-text">
              {{ packOptions[packIndex] }}
            </view>
          </picker>
        </view>
      </view>

      <view class="filter-row">
        <view class="filter-item full-width">
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
            <view class="song-meta">
              <text class="song-pack">{{ song.pack }}</text>
              <text class="song-dl" v-if="song.dl">📥</text>
            </view>
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
              <text class="difficulty-level">{{ getConstantLevel(difficulty.constant) }}</text>
              <text class="difficulty-constant">{{ difficulty.constant }}</text>
              <text class="difficulty-notes" v-if="getNotesCount(song, key)">{{ getNotesCount(song, key) }}</text>
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
/**
 * 歌曲列表页
 * 提供按曲包、定数、名称搜索三种方式筛选浏览歌曲数据库
 * 点击歌曲名称跳转歌曲详情页，点击难度按钮根据来源页面（计算器/容错/添加成绩）回传选曲信息
 * 数据优先从本地存储加载，数据不完整时自动从 API 重新拉取
 */
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getStorage } from '../../services/storage'
import { STORAGE_KEYS } from '../../constants'
import type { SimpleSongData } from '../../types'

// 页面来源标识（calculator/tolerance/add），用于决定点击难度后的回传行为
const fromPage = ref('')

// 页面加载 — 获取 from 参数确定来源页面
	onLoad((options) => {
  if (options && options.from) {
    fromPage.value = options.from
    // #ifdef dev
    console.log('从页面进入:', fromPage.value)
    // #endif
  }
  loadSongs()
})

// 搜索文本（实时筛选）
const searchText = ref('')

// 完整歌曲数据列表
const songsData = ref<SimpleSongData[]>([])

// 曲包筛选选项（含"全部曲包"）
const packOptions = ref<string[]>(['全部曲包'])
const packIndex = ref(0)

// 定数精确筛选选项（精度 0.1）
const constantRangeOptions = ref<{ name: string; value: number | null }[]>([])
const constantRangeIndex = ref(0)

// 根据当前曲包筛选结果动态生成定数选项列表
const generateConstantRangeOptions = () => {
  let songs = [...songsData.value]

  // 如果选择了特定曲包，先筛选该曲包的歌曲
  if (packIndex.value > 0) {
    const selectedPack = packOptions.value[packIndex.value]
    songs = songs.filter(song =>
      song.pack === selectedPack ||
      song.pack.toLowerCase() === selectedPack.toLowerCase()
    )
  }

  // 提取所有存在的定数值
  const constantSet = new Set<number>()
  songs.forEach(song => {
    const difficulties = ['pst', 'prs', 'ftr', 'byd', 'etr']
    difficulties.forEach(diff => {
      const constant = song[diff as keyof SimpleSongData] as number | undefined
      if (constant !== null && constant !== undefined) {
        constantSet.add(constant)
      }
    })
  })

  // 生成选项
  const options: Array<{ name: string; value: number | null }> = [{ name: '全部定数', value: null }]
  const constants = Array.from(constantSet).sort((a, b) => a - b)
  constants.forEach(constant => {
    options.push({ name: constant.toFixed(1), value: constant })
  })

  constantRangeOptions.value = options

  // 如果当前选中的定数不在新的选项中，重置为"全部定数"
  if (constantRangeIndex.value > 0 && constantRangeIndex.value >= options.length) {
    constantRangeIndex.value = 0
  }

  // #ifdef dev
  console.log('生成定数范围选项，共', constants.length, '个定数值')
  // #endif
}

// 筛选后的歌曲列表 — 综合曲包、搜索文本、定数三层筛选
const filteredSongs = computed(() => {
  let filtered = [...songsData.value].filter(song => song && song.name)

  // 曲包筛选
  if (packIndex.value > 0) {
    const selectedPack = packOptions.value[packIndex.value]
    filtered = filtered.filter(song =>
      song.pack === selectedPack ||
      song.pack.toLowerCase() === selectedPack.toLowerCase()
    )
  }

  // 文本搜索
  if (searchText.value.trim()) {
    const searchLower = searchText.value.toLowerCase()
    filtered = filtered.filter(song =>
      song.name.toLowerCase().includes(searchLower) ||
      (song.artist && song.artist.toLowerCase().includes(searchLower))
    )
  }

  // 定数值筛选（精确匹配0.1精度）
  const selectedConstant = constantRangeOptions.value[constantRangeIndex.value]?.value
  if (selectedConstant !== null) {
    filtered = filtered.filter(song => {
      const difficulties = ['pst', 'prs', 'ftr', 'byd', 'etr']
      return difficulties.some(diff => {
        const constant = song[diff as keyof SimpleSongData] as number | undefined
        return constant !== null &&
               constant !== undefined &&
               Math.abs(constant - selectedConstant) < 0.001
      })
    })
  }

  return filtered
})

// 页面挂载 — 作为备选确保数据已加载
onMounted(() => {
  if (songsData.value.length === 0) {
    loadSongs()
  }
})

// 从 storage 服务加载歌曲数据
const loadSongs = () => {
  const cachedSongs = getStorage(STORAGE_KEYS.SONGS_DATA, [])
  songsData.value = cachedSongs
  if (cachedSongs.length > 0) {
    extractPackList(cachedSongs)
    generateConstantRangeOptions()
    // #ifdef dev
    console.log('从本地存储加载歌曲数据，共', cachedSongs.length, '首歌曲')
    // #endif
  }
}

// 从歌曲数组中提取去重后的曲包列表
const extractPackList = (songs: SimpleSongData[]) => {
  const packSet = new Set<string>()
  songs.forEach(song => {
    if (song.pack) {
      packSet.add(song.pack)
    }
  })
  const packArray = Array.from(packSet).sort()
  packOptions.value = ['全部曲包', ...packArray]
  // #ifdef dev
  console.log('提取曲包列表成功，共', packArray.length, '个曲包')
  // #endif
}

// 搜索
const search = () => {
  // 搜索逻辑已经在computed中实现
  // #ifdef dev
  console.log('搜索歌曲:', searchText.value)
  // #endif
}

// 定数筛选变化
const onConstantRangeChange = (e: { detail: { value: number } }) => {
  constantRangeIndex.value = e.detail.value
}

// 曲包筛选变化 — 重新生成该曲包的定数选项
const onPackChange = (e: { detail: { value: number } }) => {
  packIndex.value = e.detail.value
  // 重新生成定数范围选项
  generateConstantRangeOptions()
  // 重置定数选择为"全部定数"
  constantRangeIndex.value = 0
}

// 重置筛选条件
const resetFilters = () => {
  searchText.value = ''
  packIndex.value = 0
  constantRangeIndex.value = 0
}

// 获取歌曲的可用难度映射（过滤掉不存在定数的难度）
const getAvailableDifficulties = (song: SimpleSongData) => {
  const difficulties: Record<string, { name: string; constant: number | undefined }> = {
    pst: { name: 'PST', constant: song.pst },
    prs: { name: 'PRS', constant: song.prs },
    ftr: { name: 'FTR', constant: song.ftr },
    byd: { name: 'BYD', constant: song.byd },
    etr: { name: 'ETR', constant: song.etr }
  }

  // 过滤掉不存在的难度
  const available: Record<string, { name: string; constant: number | undefined }> = {}
  for (const key in difficulties) {
    if (difficulties[key].constant !== null && difficulties[key].constant !== undefined) {
      available[key] = difficulties[key]
    }
  }

  return available
}

// 将定数转换为 Arcaea 游戏内显示的等级（如 8.7→"8+"、8.5→"8"）
const getConstantLevel = (constant: number | null | undefined): string => {
  if (constant === null || constant === undefined || constant <= 0) return '-'
  const intPart = Math.floor(constant)
  const decimal10 = Math.round((constant - intPart) * 10) // 取小数点后第一位×10，避免浮点精度问题

  // 6级及以下：整数等级，如 6.0/6.5 → "6"
  if (intPart <= 6) {
    return String(intPart)
  }

  // 7级：7.0-7.5 → "7", 7.8 → "7+"
  if (intPart === 7 && constant < 8.0) {
    if (decimal10 >= 7) return '7+'
    return '7'
  }

  // 8级及以上：x.0-x.6 → "X", x.7-x.9 → "X+"
  // 特例：11.7 → "11"（Tempestissimo BYD）
  if (intPart >= 8) {
    if (intPart === 11 && Math.abs(constant - 11.7) < 0.01) return '11'
    if (decimal10 >= 7) return String(intPart) + '+'
    return String(intPart)
  }

  return String(intPart)
}

// 获取指定难度对应的物量
const getNotesCount = (song: SimpleSongData, difficulty: string) => {
  const notesMap: Record<string, number | undefined> = {
    pst: song.pstNotes,
    prs: song.prsNotes,
    ftr: song.ftrNotes,
    byd: song.bydNotes,
    etr: song.etrNotes
  }
  const notes = notesMap[difficulty]
  return notes !== undefined && notes > 0 ? notes : null
}

// 点击歌曲名称 — 跳转到歌曲详情页
const selectSong = (song: SimpleSongData) => {
  // 跳转到歌曲详情页面
  uni.navigateTo({
    url: `/pages/songs/song-detail?songId=${song.id}`
  })
}

// 点击难度按钮 — 根据来源页面回传选曲信息或跳转详情页
const selectSongWithDifficulty = (song: SimpleSongData, difficulty: string) => {
  // 构建选中歌曲信息（与 tolerance.vue 的预期格式一致）
  const selectedSongData = {
    name: song.name,
    artist: song.artist,
    difficulty: difficulty,
    constant: song[difficulty as keyof SimpleSongData] as number | undefined,
    // 物量信息
    pstNotes: song.pstNotes || null,
    prsNotes: song.prsNotes || null,
    ftrNotes: song.ftrNotes || null,
    bydNotes: song.bydNotes || null,
    etrNotes: song.etrNotes || null,
    // 额外信息
    id: song.id,
    pack: song.pack,
    dl: song.dl
  }
  
  // 根据来源页面决定行为
  if (fromPage.value === 'add') {
    // 来自添加成绩页面：直接返回，填充歌曲信息
    uni.setStorage({
      key: STORAGE_KEYS.SELECTED_SONG_ADD,
      data: selectedSongData,
      success: () => {
        // 同时保存 recent_song 供 add.vue 的 onPageShow 使用
        uni.setStorageSync(STORAGE_KEYS.RECENT_SONG, selectedSongData)
        uni.navigateBack()
      }
    })
  } else if (fromPage.value === 'tolerance') {
    // 来自容错计算页面：直接返回并填充歌曲信息
    // 单通道：仅写入 storage，由目标页面 onPageShow 读取
    uni.setStorageSync(STORAGE_KEYS.RECENT_SONG, selectedSongData)
    // #ifdef dev
    console.log('歌曲选择成功，准备返回容错计算页面:', selectedSongData.name)
    // #endif
    uni.navigateBack()
  } else if (fromPage.value === 'calculator') {
    // 来自计算器页面：直接返回并填充歌曲信息
    // 单通道：仅写入 storage，由目标页面 onPageShow 读取
    uni.setStorageSync(STORAGE_KEYS.SELECTED_SONG_CALC, selectedSongData)
    // #ifdef dev
    console.log('歌曲选择成功，准备返回计算器页面:', selectedSongData.name)
    // #endif
    uni.navigateBack()
  } else if (!fromPage.value) {
    // 从主页进入，点击难度卡片跳转到歌曲详情页
    uni.navigateTo({
      url: `/pages/songs/song-detail?songId=${song.id}`
    })
  } else {
    // 其他情况：跳转到容错计算页面（默认行为）
    uni.setStorage({
      key: STORAGE_KEYS.RECENT_SONG,
      data: selectedSongData,
      success: () => {
        uni.navigateTo({
          url: '/pages/calculator/tolerance?from=songs'
        })
      }
    })
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

.filter-item.full-width {
  width: 100%;
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
  transition: all 0.3s ease;
}

.song-item:active {
  background: #f0f0f0;
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

.song-meta {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 4rpx;
}

.song-pack {
  font-size: 22rpx;
  color: #999;
  background: #e0e0e0;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
}

.song-dl {
  font-size: 22rpx;
}

.song-difficulties {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.difficulty-item {
  min-width: 80rpx;
  padding: 12rpx 16rpx;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.difficulty-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.difficulty-item:active {
  transform: translateY(0);
  opacity: 0.9;
}

.difficulty-name {
  font-size: 24rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.difficulty-level {
  font-size: 28rpx;
  font-weight: 800;
  line-height: 1.2;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 6rpx;
  padding: 0 6rpx;
}

.difficulty-constant {
  font-size: 26rpx;
  font-weight: 600;
  line-height: 1.2;
}

.difficulty-notes {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2rpx;
  line-height: 1.2;
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
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.reset-btn:active {
  transform: scale(0.98);
}
</style>
