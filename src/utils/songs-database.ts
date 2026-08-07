/**
 * Arcaea歌曲数据库工具
 * 用于管理歌曲数据和定数信息
 * 重构以使用新的数据结构
 */

import { loadSimpleSongsData } from '@/data'
import type { SimpleSongData } from '@/data'
import { getStorage } from '../services/storage'
import { STORAGE_KEYS } from '../constants'

/**
 * 缓存的歌曲数据
 */
let cachedSongsData: SimpleSongData[] | null = null

/**
 * 保存歌曲数据到本地存储
 * @param songs 歌曲数据数组
 */
export function saveSongsData(songs: SimpleSongData[]): void {
  try {
    uni.setStorageSync(STORAGE_KEYS.SONGS_DATA, songs)
  } catch (e) {
    // #ifdef dev
    console.error('保存歌曲数据失败', e)
    // #endif
  }
}

/**
 * 从本地存储加载歌曲数据
 * @returns 歌曲数据数组
 */
export function loadSongsDataFromStorage(): SimpleSongData[] {
  try {
    return uni.getStorageSync(STORAGE_KEYS.SONGS_DATA) || []
  } catch (e) {
    // #ifdef dev
    console.error('加载歌曲数据失败', e)
    // #endif
    return []
  }
}

/**
 * 从数据库加载完整的歌曲数据（异步）
 * @returns Promise<SongData[]>
 */
export async function loadCachedSongs(): Promise<SimpleSongData[]> {
  try {
    const stored = getStorage(STORAGE_KEYS.SONGS_DATA, [])
    if (stored && stored.length > 0) {
      return stored
    }
    if (!cachedSongsData) {
      cachedSongsData = await loadSimpleSongsData()
    }
    return cachedSongsData
  } catch (err) {
    // #ifdef dev
    console.error('加载歌曲数据失败:', err)
    // #endif
    throw new Error('无法加载歌曲数据')
  }
}

/**
 * 搜索歌曲
 * @param keyword 搜索关键词
 * @returns Promise<SongData[]>
 */
export async function searchSongs(keyword: string): Promise<SimpleSongData[]> {
  try {
    const songsData = await loadCachedSongs()
    const lowerKeyword = keyword.toLowerCase()

    return songsData.filter(song => {
      // 搜索歌曲名称
      if (song.name.toLowerCase().includes(lowerKeyword)) {
        return true
      }
      // 搜索别名
      if (song.alias.some(alias => alias.toLowerCase().includes(lowerKeyword))) {
        return true
      }
      // 搜索曲包
      if (song.pack.toLowerCase().includes(lowerKeyword)) {
        return true
      }
      return false
    })
  } catch (error) {
    // #ifdef dev
    console.error('搜索歌曲失败:', error)
    // #endif
    return []
  }
}

/**
 * 根据难度筛选歌曲
 * @param difficulty 难度
 * @param minConstant 最小定数
 * @param maxConstant 最大定数
 * @returns Promise<SongData[]>
 */
export async function filterSongsByDifficulty(
  difficulty: 'pst' | 'prs' | 'ftr' | 'byd' | 'etr',
  minConstant?: number,
  maxConstant?: number
): Promise<SimpleSongData[]> {
  try {
    const songsData = await loadCachedSongs()
    
    return songsData.filter(song => {
      const constant = song[difficulty]
      if (!constant) return false

      if (minConstant !== undefined && constant < minConstant) return false
      if (maxConstant !== undefined && constant > maxConstant) return false

      return true
    })
  } catch (error) {
    // #ifdef dev
    console.error('筛选歌曲失败:', error)
    // #endif
    return []
  }
}

/**
 * 根据曲包筛选歌曲
 * @param packName 曲包名称
 * @returns Promise<SongData[]>
 */
export async function filterSongsByPack(packName: string): Promise<SimpleSongData[]> {
  try {
    const songsData = await loadCachedSongs()
    return songsData.filter(song => song.pack === packName)
  } catch (error) {
    // #ifdef dev
    console.error('按曲包筛选歌曲失败:', error)
    // #endif
    return []
  }
}

/**
 * 根据歌曲名称获取歌曲数据
 * @param songName 歌曲名称
 * @returns Promise<SongData | null>
 */
export async function getSongByName(songName: string): Promise<SimpleSongData | null> {
  try {
    const songsData = await loadCachedSongs()
    return songsData.find(song => song.name === songName) || null
  } catch (error) {
    // #ifdef dev
    console.error('获取歌曲数据失败:', error)
    // #endif
    return null
  }
}

/**
 * 根据歌曲名称获取定数
 * @param songName 歌曲名称
 * @param difficulty 难度
 * @returns Promise<number | null>
 */
export async function getSongConstant(songName: string, difficulty: string): Promise<number | null> {
  try {
    const song = await getSongByName(songName)
    if (!song) return null
    const constant = song[difficulty.toLowerCase() as keyof SimpleSongData]
    return typeof constant === 'number' ? constant : null
  } catch (error) {
    // #ifdef dev
    console.error('获取歌曲定数失败:', error)
    // #endif
    return null
  }
}
