/*
 * PTT数据状态管理
 * 管理B30记录、最近成绩及PTT统计数据的增删改查与本地持久化
 * 使用 Vue reactive + ref 模式（避免引入 pinia 依赖，兼容 Uni-app 构建系统）
 */

import { ref, watch } from 'vue'
import type { Best30Record, PttData } from '../types'
import { STORAGE_KEYS } from '../constants'
import { calculatePtt } from '../utils/ptt-calculator'
import { getStorage, setStorage } from '../services/storage'

// 本地存储键名
const STORAGE_KEY_BEST30 = STORAGE_KEYS.BEST30_RECORDS
const STORAGE_KEY_RECENT = STORAGE_KEYS.RECENT_SCORES
const STORAGE_KEY_PTT = STORAGE_KEYS.PTT_DATA

// 根据分数判定Arcaea评级（PM, EX+, EX, AA, A, B, C, D）
function calculateRating(score: number): string {
  if (score >= 10000000) return 'PM'
  if (score >= 9800000) return 'EX+'
  if (score >= 9500000) return 'EX'
  if (score >= 9000000) return 'AA'
  if (score >= 8000000) return 'A'
  if (score >= 7000000) return 'B'
  if (score >= 6000000) return 'C'
  return 'D'
}

// 状态
const currentPTT = ref(0)
const best10Avg = ref(0)
const best30Avg = ref(0)
const recent10Avg = ref(0)
const best30Records = ref<Best30Record[]>([])
const recentRecords = ref<Best30Record[]>([])
const pttData = ref<PttData | null>(null)

function updatePttCalculation(): void {
  const sortedBest30 = [...best30Records.value]
    .sort((a, b) => b.ptt - a.ptt)

  const best10 = sortedBest30.slice(0, 10)
  const best30 = sortedBest30.slice(0, 30)

  best10Avg.value = best10.length > 0
    ? best10.reduce((sum, r) => sum + r.ptt, 0) / best10.length
    : 0

  best30Avg.value = best30.length > 0
    ? best30.reduce((sum, r) => sum + r.ptt, 0) / best30.length
    : 0

  const sortedRecent = [...recentRecords.value]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)

  recent10Avg.value = sortedRecent.length > 0
    ? sortedRecent.reduce((sum, r) => sum + r.ptt, 0) / sortedRecent.length
    : 0

  currentPTT.value = +((best10Avg.value * 0.75) + (recent10Avg.value * 0.25)).toFixed(2)

  const data: PttData = {
    currentPTT: currentPTT.value,
    best10Avg: best10Avg.value,
    best30Avg: best30Avg.value,
    recent10Avg: recent10Avg.value,
    lastUpdated: Date.now()
  }

  pttData.value = data
  setStorage(STORAGE_KEY_PTT, data)
}

// 从本地存储初始化所有状态数据
function initStore(): void {
  best30Records.value = getStorage<Best30Record[]>(STORAGE_KEY_BEST30, [])
  recentRecords.value = getStorage<Best30Record[]>(STORAGE_KEY_RECENT, [])
  pttData.value = getStorage<PttData | null>(STORAGE_KEY_PTT, null)

  if (pttData.value) {
    currentPTT.value = pttData.value.currentPTT
    best10Avg.value = pttData.value.best10Avg
    best30Avg.value = pttData.value.best30Avg
    recent10Avg.value = pttData.value.recent10Avg
  } else {
    updatePttCalculation()
  }
}

// 添加或更新B30记录（同歌同难度下仅保留更高分）
function addBest30Record(record: Omit<Best30Record, 'ptt' | 'rating' | 'timestamp'>): void {
  const ptt = calculatePtt(record.score, record.constant)
  const rating = calculateRating(record.score)

  const newRecord: Best30Record = {
    ...record,
    ptt,
    rating,
    timestamp: Date.now()
  }

  const existingIndex = best30Records.value.findIndex(
    r => r.songName === record.songName && r.difficulty === record.difficulty
  )

  if (existingIndex >= 0) {
    if (newRecord.score > best30Records.value[existingIndex].score) {
      best30Records.value[existingIndex] = newRecord
    }
  } else {
    best30Records.value.push(newRecord)
  }

  setStorage(STORAGE_KEY_BEST30, best30Records.value)
  updatePttCalculation()
}

function addRecentRecord(record: Omit<Best30Record, 'ptt' | 'rating' | 'timestamp'>): void {
  const ptt = calculatePtt(record.score, record.constant)
  const rating = calculateRating(record.score)

  const newRecord: Best30Record = {
    ...record,
    ptt,
    rating,
    timestamp: Date.now()
  }

  recentRecords.value.unshift(newRecord)
  if (recentRecords.value.length > 50) {
    recentRecords.value = recentRecords.value.slice(0, 50)
  }

  setStorage(STORAGE_KEY_RECENT, recentRecords.value)
  updatePttCalculation()
}

function removeBest30Record(songName: string, difficulty: string): void {
  best30Records.value = best30Records.value.filter(
    r => !(r.songName === songName && r.difficulty === difficulty)
  )
  setStorage(STORAGE_KEY_BEST30, best30Records.value)
  updatePttCalculation()
}

// 清空所有B30及最近记录
function clearAllRecords(): void {
  best30Records.value = []
  recentRecords.value = []
  setStorage(STORAGE_KEY_BEST30, [])
  setStorage(STORAGE_KEY_RECENT, [])
  updatePttCalculation()
}

// 批量导入B30和最近记录（用于数据还原）
function importRecords(best30: Best30Record[], recent?: Best30Record[]): void {
  best30Records.value = [...best30]
  if (recent) {
    recentRecords.value = [...recent]
  }
  setStorage(STORAGE_KEY_BEST30, best30Records.value)
  setStorage(STORAGE_KEY_RECENT, recentRecords.value)
  updatePttCalculation()
}

watch(best30Records, () => {
  setStorage(STORAGE_KEY_BEST30, best30Records.value)
}, { deep: true })

watch(recentRecords, () => {
  setStorage(STORAGE_KEY_RECENT, recentRecords.value)
}, { deep: true })

export const pttStore = {
  currentPTT,
  best10Avg,
  best30Avg,
  recent10Avg,
  best30Records,
  recentRecords,
  pttData,
  initStore,
  addBest30Record,
  addRecentRecord,
  removeBest30Record,
  clearAllRecords,
  importRecords,
  updatePttCalculation,
  calculatePtt,
  calculateRating
}
