/**
 * Arcaea PTT计算器 - 统一类型定义
 * 所有类型定义集中在此文件中，便于维护和引用
 */

// ==================== 歌曲相关类型 ====================

/**
 * 谱面信息
 */
export interface ChartData {
  constant: number // 定数
  difficulty: 'pst' | 'prs' | 'ftr' | 'byd' | 'etr' // 难度标识
  designer: string // 谱师名称
  id: string // 谱面唯一ID (songId@difficulty)
  level: number // 显示等级
  note: number // 物量
  songId: string // 对应的歌曲ID
  plus?: boolean // 是否为Plus谱面
  override?: {
    cover?: string
    name?: string
    bpm?: string
  }
}

/**
 * 歌曲版本信息
 */
export interface SongVersion {
  added: string // 加入版本
  removed?: string // 移除版本
  updated?: string // 更新版本
}

/**
 * 完整歌曲数据
 */
export interface SongData {
  bpm: string // BPM
  side: 0 | 1 // 阵营 (0=光/光侧, 1=对立/暗侧)
  id: string // 歌曲唯一标识
  name: string // 歌曲名称
  covers: string[] // 封面图片文件名数组
  pack: string // 所属曲包
  dl: boolean // 是否为下载曲
  alias: string[] // 别名/俗称数组
  charts: ChartData[] // 谱面信息数组
  version: SongVersion // 版本信息
}

/**
 * 简化的歌曲数据（用于选择器）
 */
export interface SimpleSongData {
  id: string
  name: string
  artist?: string
  bpm?: string
  pack: string
  dl: boolean
  alias: string[]
  pst?: number
  prs?: number
  ftr?: number
  byd?: number
  etr?: number
  pstNotes?: number
  prsNotes?: number
  ftrNotes?: number
  bydNotes?: number
  etrNotes?: number
}

/**
 * 曲包信息
 */
export interface PackData {
  id: string // 曲包ID
  name: string // 曲包名称
  set?: string // 套装名称
}

// ==================== 成绩相关类型 ====================

/**
 * B30成绩记录
 */
export interface Best30Record {
  songName: string        // 歌曲名称
  difficulty: string      // 难度代码 (pst/prs/ftr/byd/etr)
  constant: number        // 定数
  score: number           // 成绩
  rating: string          // 评级
  ptt: number            // PTT值
  timestamp: number       // 记录时间戳
  pureCount?: number      // Pure数量（可选）
  farCount?: number       // Far数量（可选）
  lostCount?: number      // Lost数量（可选）
  remark?: string         // 备注（可选）
}

/**
 * PTT统计数据
 */
export interface PttData {
  currentPTT: number     // 当前PTT (B10*0.75 + R10*0.25)
  best10Avg: number      // B10平均PTT
  best30Avg: number      // B30平均PTT
  recent10Avg: number    // R10平均PTT
  lastUpdated: number    // 最后更新时间戳
}

// ==================== 容错计算相关类型 ====================

/**
 * 评级选项
 */
export interface RatingOption {
  name: string
  minScore: number
}

/**
 * 评级容错结果
 */
export interface RatingToleranceResult {
  canAchieve: boolean
  maxFarCount: number
  maxLostCount: number
}

/**
 * 分数容错结果
 */
export interface ScoreToleranceResult {
  currentScore: number
  maxFarCount: number
  maxLostCount: number
  canAchieve: boolean
  tolerableFar: number
  tolerableLost: number
}

// ==================== 应用数据相关类型 ====================

/**
 * 应用数据结构（用于导出/导入）
 */
export interface AppData {
  version: string
  exportTime: string
  type: 'full-export' | 'best30-only' | 'songs-only'
  best30Records?: Best30Record[]
  recentRecords?: Best30Record[]
  pttData?: PttData
  songsData?: SongData[]
}

// ==================== 计算结果类型 ====================

/**
 * PTT计算结果
 */
export interface PttCalculationResult {
  score: number
  ptt: number
  rating: string
  songName: string
  constant: number
  inputMode: 'song' | 'manual'
}

// ==================== 工具函数类型 ====================

/**
 * 难度映射类型
 */
export type DifficultyType = 'pst' | 'prs' | 'ftr' | 'byd' | 'etr'

/**
 * 评级类型
 */
export type RatingType = 'PM' | 'EX+' | 'EX' | 'AA' | 'A' | 'B' | 'C' | 'D'

// ==================== 页面参数类型 ====================

/**
 * 歌曲选择回传数据
 * 存储于 RECENT_SONG / SELECTED_SONG_*，由 songs.vue 构建，
 * 含所选难度、定数及物量等附加字段。
 */
export interface SongSelectedData {
  name: string
  difficulty: string
  constant: number
  artist?: string
  id?: string
  pack?: string
  dl?: boolean
  pstNotes?: number | null
  prsNotes?: number | null
  ftrNotes?: number | null
  bydNotes?: number | null
  etrNotes?: number | null
}

/**
 * 容错计算结果展示视图（评级/分数/PTT 三种模式的字段并集，字段均可选）
 */
export interface ToleranceResultView {
  canAchieve?: boolean
  currentScore?: number
  minScore?: number
  maxScore?: number
  targetScore?: number
  scoreGap?: number
  currentPtt?: number
  targetPtt?: number
  pttGap?: number
  maxFarCount?: number
  maxLostCount?: number
  tolerableFar?: number
  tolerableLost?: number
  remainingNotes?: number
  theoreticalMaxScore?: number
  theoreticalMaxPtt?: number
}

// ==================== 数据统计类型 ====================

/**
 * 数据统计信息
 */
export interface DataStatistics {
  best30Count: number
  recentCount: number
  songsCount: number
  lastPTTUpdate: string | null
  totalSize: string
}

/**
 * 数据验证结果
 */
export interface DataValidationResult {
  isValid: boolean
  issues: string[]
}

// ==================== 状态管理类型 ====================

/**
 * PTT状态
 */
export interface PttState {
  currentPTT: number
  best10Avg: number
  best30Avg: number
  recent10Avg: number
  best30Records: Best30Record[]
  recentRecords: Best30Record[]
  pttData: PttData | null
}
