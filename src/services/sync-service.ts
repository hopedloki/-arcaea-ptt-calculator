import { request } from './request'
import { getStorage, setStorage } from './storage'
import { STORAGE_KEYS } from '../constants'
import { API } from '../constants/api'
import { validateDataIntegrity } from '../utils/data-manager'

export const SYNC_STATUS = {
  IDLE: 'idle',
  SYNCING: 'syncing',
  SUCCESS: 'success',
  FAILED: 'failed'
}

export const DEFAULT_FINGERPRINT = '1970-01-01T00:00:00'

interface SyncState {
  status: string
  lastSyncTime: string | null
  fingerprint: string | null
  progress: number
  totalSongs: number
}

let syncState: SyncState = {
  status: SYNC_STATUS.IDLE,
  lastSyncTime: null,
  fingerprint: null,
  progress: 0,
  totalSongs: 0
}

const listeners: Array<(state: SyncState) => void> = []

function notifyListeners() {
  const snapshot = { ...syncState }
  listeners.forEach(fn => fn(snapshot))
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getAppVersion(): string {
  // #ifdef APP-PLUS
  const info = (plus as any).runtime.version
  if (info) {
    return info
  }
  // #endif
  return 'h5'
}

/**
 * 将后端 SongClientDTO（嵌套 charts 数组）转换为前端扁平结构
 * 后端返回: { packName, charts: [{ difficulty, constant, note, ... }] }
 * 前端期望: { pack, pst, prs, ftr, byd, etr, pstNotes, prsNotes, ... }
 */
function transformSong(serverSong: any): any {
  const result: any = {
    id: serverSong.id,
    name: serverSong.name,
    artist: serverSong.artist || '',
    bpm: serverSong.bpm || '',
    pack: serverSong.packName || '',
    dl: serverSong.dl || false,
    alias: serverSong.alias || [],
    version: serverSong.version || '',
    updateTime: serverSong.updateTime || ''
  }

  const charts: any[] = serverSong.charts || []
  charts.forEach((chart: any) => {
    const diff = chart.difficulty
    if (diff) {
      result[diff] = chart.constant
      result[`${diff}Notes`] = chart.note
    }
  })

  return result
}

export const syncService = {
  getState(): SyncState {
    return { ...syncState }
  },

  subscribe(fn: (state: SyncState) => void) {
    listeners.push(fn)
    return () => {
      const idx = listeners.indexOf(fn)
      if (idx > -1) listeners.splice(idx, 1)
    }
  },

  init() {
    syncState.lastSyncTime = getStorage(STORAGE_KEYS.SYNC_TIME, null)
    syncState.fingerprint = getStorage(STORAGE_KEYS.FINGERPRINT, null)
    notifyListeners()
  },

  checkLocalIntegrity(): boolean {
    const songsData = getStorage(STORAGE_KEYS.SONGS_DATA, [])
    if (!songsData || songsData.length === 0) return false
    // 检测旧版未转换的后端原始格式（含 packName 或 charts 数组）
    // 这种格式会导致前端读不到 pst/prs/ftr/byd/etr，难度卡片会消失，需触发全量重同步
    const hasRawFormat = songsData.some((s: any) =>
      s && (s.packName !== undefined || Array.isArray(s.charts))
    )
    if (hasRawFormat) return false
    const result = validateDataIntegrity(songsData)
    return result.isValid
  },

  shouldSync(trigger: 'startup' | 'login' | 'network' | 'manual' | 'corrupt'): boolean {
    if (trigger === 'corrupt') return true
    if (trigger === 'manual') return true

    const lastSync = syncState.lastSyncTime
    if (lastSync) {
      const hoursSinceLastSync = (Date.now() - new Date(lastSync).getTime()) / (1000 * 60 * 60)
      if (hoursSinceLastSync < 24) return false
    }

    if (trigger === 'startup') {
      const localVersion = getStorage(STORAGE_KEYS.DATA_VERSION, '')
      const currentVersion = getAppVersion()
      if (localVersion !== currentVersion) return true
    }

    if (trigger === 'login') return true
    if (trigger === 'network') return true

    return false
  },

  async fetchServerFingerprint(): Promise<string> {
    const data: any = await request(API.SONG.LAST_UPDATE, 'GET')
    return data?.maxUpdateTime || DEFAULT_FINGERPRINT
  },

  async fullImport(onProgress?: (percent: number) => void): Promise<any[]> {
    syncState.status = SYNC_STATUS.SYNCING
    syncState.progress = 0
    notifyListeners()

    try {
      const fingerprint = await this.fetchServerFingerprint()
      const rawSongs: any[] = await request(API.SONG.CLIENT_LIST, 'GET')
      const songs: any[] = rawSongs.map(transformSong)
      syncState.totalSongs = songs.length

      const BATCH_SIZE = 50
      const accumulated: any[] = []
      for (let i = 0; i < songs.length; i += BATCH_SIZE) {
        const batch = songs.slice(i, i + BATCH_SIZE)
        accumulated.push(...batch)
        setStorage(STORAGE_KEYS.SONGS_DATA, [...accumulated])
        syncState.progress = Math.round((accumulated.length / songs.length) * 100)
        if (onProgress) onProgress(syncState.progress)
        notifyListeners()
        await delay(50)
      }

      setStorage(STORAGE_KEYS.FINGERPRINT, fingerprint)
      setStorage(STORAGE_KEYS.SYNC_TIME, new Date().toISOString())
      syncState.fingerprint = fingerprint
      syncState.lastSyncTime = new Date().toISOString()
      syncState.status = SYNC_STATUS.SUCCESS
      notifyListeners()
      return songs
    } catch (e) {
      syncState.status = SYNC_STATUS.FAILED
      notifyListeners()
      throw e
    }
  },

  async incrementalSync(): Promise<{ added: number; updated: number; deleted: number }> {
    syncState.status = SYNC_STATUS.SYNCING
    syncState.progress = 0
    notifyListeners()

    try {
      // 优先使用服务端返回的指纹（maxUpdateTime），避免客户端本地时钟偏差导致漏同步
      const lastSyncTime = syncState.fingerprint || syncState.lastSyncTime || DEFAULT_FINGERPRINT
      const delta: any = await request(
        `${API.SONG.CLIENT_DELTA}?since=${encodeURIComponent(lastSyncTime)}`,
        'GET'
      )

      let currentSongs: any[] = getStorage(STORAGE_KEYS.SONGS_DATA, [])
      let addedCount = 0
      let updatedCount = 0
      let deletedCount = 0

      const deltaSongs: any[] = delta.songs || []
      syncState.totalSongs = deltaSongs.length + (delta.deletedSongIds?.length || 0)

      for (const deltaSong of deltaSongs) {
        // 增量同步同样需要将后端嵌套结构转换为前端扁平结构
        const transformed = transformSong(deltaSong)
        const idx = currentSongs.findIndex((s: any) => s.id === transformed.id)
        if (idx >= 0) {
          currentSongs[idx] = transformed
          updatedCount++
        } else {
          currentSongs.push(transformed)
          addedCount++
        }
      }

      const deletedIds: string[] = delta.deletedSongIds || []
      currentSongs = currentSongs.filter((s: any) => !deletedIds.includes(s.id))
      deletedCount = deletedIds.length

      setStorage(STORAGE_KEYS.SONGS_DATA, currentSongs)
      setStorage(STORAGE_KEYS.FINGERPRINT, delta.maxUpdateTime)
      setStorage(STORAGE_KEYS.SYNC_TIME, new Date().toISOString())
      syncState.fingerprint = delta.maxUpdateTime
      syncState.lastSyncTime = new Date().toISOString()
      syncState.progress = 100
      syncState.status = SYNC_STATUS.SUCCESS
      notifyListeners()

      return { added: addedCount, updated: updatedCount, deleted: deletedCount }
    } catch (e) {
      syncState.status = SYNC_STATUS.FAILED
      notifyListeners()
      throw e
    }
  },

  clearLocalCache() {
    const keys = [
      STORAGE_KEYS.SONGS_DATA,
      STORAGE_KEYS.FINGERPRINT,
      STORAGE_KEYS.SYNC_TIME,
      STORAGE_KEYS.SONGS_CACHE_TIME
    ]
    keys.forEach(k => {
      try { uni.removeStorageSync(k) } catch (e) { /* ignore */ }
    })
    syncState.fingerprint = null
    syncState.lastSyncTime = null
    syncState.status = SYNC_STATUS.IDLE
    notifyListeners()
  }
}
