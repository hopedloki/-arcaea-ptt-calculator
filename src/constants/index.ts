/** 离线版构建标志：VITE_OFFLINE=true 时启用（无云端存储/在线歌曲更新，其余功能全保留） */
export const OFFLINE_MODE = import.meta.env.VITE_OFFLINE === 'true'

/** 难度代码 → 显示文本 */
export const DIFFICULTY_TEXT: Record<string, string> = {
  pst: 'Past',
  prs: 'Present',
  ftr: 'Future',
  byd: 'Beyond',
  etr: 'Eternal'
}

/** 难度代码 → CSS 类名 */
export const DIFFICULTY_CLASS: Record<string, string> = {
  pst: 'difficulty-pst',
  prs: 'difficulty-prs',
  ftr: 'difficulty-ftr',
  byd: 'difficulty-byd',
  etr: 'difficulty-etr'
}

/** 评级 → CSS 类名 */
export const RATING_CLASS: Record<string, string> = {
  'PM': 'rating-pm',
  'EX+': 'rating-ex-plus',
  'EX': 'rating-ex',
  'AA': 'rating-aa',
  'A': 'rating-a',
  'B': 'rating-b',
  'C': 'rating-c',
  'D': 'rating-d'
}

/** 评级阈值（从高到低，Arcaea 官方口径） */
export const RATING_THRESHOLDS: Array<{ label: string; min: number }> = [
  { label: 'PM', min: 10000000 },
  { label: 'EX+', min: 9900000 },
  { label: 'EX', min: 9800000 },
  { label: 'AA', min: 9500000 },
  { label: 'A', min: 9200000 },
  { label: 'B', min: 8900000 },
  { label: 'C', min: 8600000 },
  { label: 'D', min: 0 }
]

/** PTT 上限 */
export const MAX_PTT = 15.0

/** PTT 等级区间 */
export const PTT_LEVELS: Array<{ label: string; min: number; max: number; color: string }> = [
  { label: '12.50+', min: 12.5, max: 15, color: '#ff6b6b' },
  { label: '12.00-12.49', min: 12.0, max: 12.5, color: '#ff8787' },
  { label: '11.50-11.99', min: 11.5, max: 12.0, color: '#ffa94d' },
  { label: '11.00-11.49', min: 11.0, max: 11.5, color: '#ffd43b' },
  { label: '10.00-10.99', min: 10.0, max: 11.0, color: '#69db7c' },
  { label: '0-9.99', min: 0, max: 10.0, color: '#74c0fc' }
]

/** Storage Key 常量 */
export const STORAGE_KEYS = {
  BEST30_RECORDS: 'arcaea_best30_records',
  PTT_DATA: 'arcaea_ptt_data',
  RECENT_SCORES: 'arcaea_recent_scores',
  RECENT_SONG: 'arcaea_recent_song',
  SONGS_DATA: 'arcaea_songs_data',
  SONGS_CACHE_TIME: 'arcaea_songs_cache_time',
  TOKEN: 'app_token',
  USER_ID: 'app_userId',
  USERNAME: 'app_username',
  NICKNAME: 'app_nickname',
  ROLE: 'app_role',
  SELECTED_SONG_ADD: 'selected_song_for_add',
  SELECTED_SONG_CALC: 'selected_song_for_calculator',
  /** 数据同步相关 key */
  SYNC_TIME: 'arcaea_data_sync_time',
  FINGERPRINT: 'arcaea_data_fingerprint',
  DATA_VERSION: 'arcaea_data_version'
}
