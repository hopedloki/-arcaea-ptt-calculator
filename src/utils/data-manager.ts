/**
 * 数据管理工具
 * 用于处理数据的导入、导出、备份和恢复
 */

import { SongData } from './songs-database'

/**
 * 应用数据结构
 */
export interface AppData {
  version: string
  exportTime: string
  type: 'full-export' | 'best30-only' | 'songs-only'
  best30Records?: any[]
  recentRecords?: any[]
  pttData?: {
    currentPTT: number
    best10Avg: number
    best30Avg: number
    recent10Avg: number
    lastUpdated: number
  }
  songsData?: SongData[]
}

/**
 * 导出所有应用数据
 * @param includeSongs 是否包含歌曲数据
 * @returns 导出的数据
 */
export function exportAllData(includeSongs: boolean = true): AppData {
  try {
    const data: AppData = {
      version: '1.0.0',
      exportTime: new Date().toISOString(),
      type: includeSongs ? 'full-export' : 'best30-only'
    }
    
    // 导出B30记录
    const best30Records = uni.getStorageSync('best30_records') || []
    if (best30Records.length > 0) {
      data.best30Records = best30Records
    }
    
    // 导出最近记录
    const recentRecords = uni.getStorageSync('recent_scores') || []
    if (recentRecords.length > 0) {
      data.recentRecords = recentRecords
    }
    
    // 导出PTT数据
    const pttData = uni.getStorageSync('ptt_data')
    if (pttData) {
      data.pttData = pttData
    }
    
    // 导出歌曲数据（可选）
    if (includeSongs) {
      const songsData = uni.getStorageSync('songs_data') || []
      if (songsData.length > 0) {
        data.songsData = songsData
      }
    }
    
    return data
  } catch (e) {
    console.error('导出数据失败', e)
    throw new Error('导出数据失败: ' + e)
  }
}

/**
 * 导出B30数据
 * @returns 导出的B30数据
 */
export function exportBest30Data(): AppData {
  try {
    const data: AppData = {
      version: '1.0.0',
      exportTime: new Date().toISOString(),
      type: 'best30-only'
    }
    
    // 导出B30记录
    const best30Records = uni.getStorageSync('best30_records') || []
    if (best30Records.length > 0) {
      data.best30Records = best30Records
    }
    
    // 导出PTT数据
    const pttData = uni.getStorageSync('ptt_data')
    if (pttData) {
      data.pttData = pttData
    }
    
    return data
  } catch (e) {
    console.error('导出B30数据失败', e)
    throw new Error('导出B30数据失败: ' + e)
  }
}

/**
 * 导出歌曲数据
 * @returns 导出的歌曲数据
 */
export function exportSongsData(): AppData {
  try {
    const data: AppData = {
      version: '1.0.0',
      exportTime: new Date().toISOString(),
      type: 'songs-only'
    }
    
    // 导出歌曲数据
    const songsData = uni.getStorageSync('songs_data') || []
    if (songsData.length > 0) {
      data.songsData = songsData
    }
    
    return data
  } catch (e) {
    console.error('导出歌曲数据失败', e)
    throw new Error('导出歌曲数据失败: ' + e)
  }
}

/**
 * 导入应用数据
 * @param data 要导入的数据
 * @param options 导入选项
 * @returns 导入结果
 */
export function importData(
  data: AppData, 
  options: {
    overwriteBest30?: boolean,
    overwriteRecent?: boolean,
    overwritePTTData?: boolean,
    overwriteSongs?: boolean
  } = {}
): { success: boolean, message: string } {
  try {
    const {
      overwriteBest30 = true,
      overwriteRecent = true,
      overwritePTTData = true,
      overwriteSongs = false
    } = options
    
    // 导入B30记录
    if (data.best30Records && Array.isArray(data.best30Records) && overwriteBest30) {
      uni.setStorageSync('best30_records', data.best30Records)
    }
    
    // 导入最近记录
    if (data.recentRecords && Array.isArray(data.recentRecords) && overwriteRecent) {
      uni.setStorageSync('recent_scores', data.recentRecords)
    }
    
    // 导入PTT数据
    if (data.pttData && overwritePTTData) {
      uni.setStorageSync('ptt_data', data.pttData)
    }
    
    // 导入歌曲数据
    if (data.songsData && Array.isArray(data.songsData) && overwriteSongs) {
      uni.setStorageSync('songs_data', data.songsData)
    }
    
    return { success: true, message: '数据导入成功' }
  } catch (e) {
    console.error('导入数据失败', e)
    return { success: false, message: '导入数据失败: ' + e }
  }
}

/**
 * 保存数据到本地文件
 * @param data 要保存的数据
 * @param fileName 文件名
 * @returns Promise<成功与否>
 */
export function saveDataToFile(data: any, fileName: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const jsonStr = JSON.stringify(data, null, 2)
      
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
      resolve(true)
      // #endif
      
      // #ifndef H5
      // 在非H5环境下保存到本地文件
      const fileManager = uni.getFileSystemManager()
      const filePath = `${uni.env.USER_DATA_PATH}/${fileName}`
      
      fileManager.writeFile({
        filePath: filePath,
        data: jsonStr,
        encoding: 'utf8',
        success: () => {
          resolve(true)
        },
        fail: () => {
          resolve(false)
        }
      })
      // #endif
    } catch (e) {
      console.error('保存文件失败', e)
      resolve(false)
    }
  })
}

/**
 * 从文件读取数据
 * @param filePath 文件路径
 * @returns Promise<读取的数据>
 */
export function readDataFromFile(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const fileManager = uni.getFileSystemManager()
      
      fileManager.readFile({
        filePath: filePath,
        encoding: 'utf8',
        success: (res) => {
          try {
            const data = JSON.parse(res.data as string)
            resolve(data)
          } catch (e) {
            reject(new Error('解析JSON失败'))
          }
        },
        fail: (err) => {
          reject(new Error('读取文件失败: ' + err.errMsg))
        }
      })
    } catch (e) {
      reject(new Error('读取文件失败: ' + e))
    }
  })
}

/**
 * 生成数据备份
 * @param includeSongs 是否包含歌曲数据
 * @returns Promise<备份文件路径或下载URL>
 */
export async function createBackup(includeSongs: boolean = true): Promise<string> {
  try {
    const data = exportAllData(includeSongs)
    const fileName = `arcaea-ptt-backup-${Date.now()}.json`
    
    const success = await saveDataToFile(data, fileName)
    
    if (!success) {
      throw new Error('创建备份失败')
    }
    
    // #ifdef H5
    // H5环境下返回一个提示信息，因为文件已经通过下载处理
    return '备份文件已开始下载'
    // #endif
    
    // #ifndef H5
    // 非H5环境下返回文件路径
    return `${uni.env.USER_DATA_PATH}/${fileName}`
    // #endif
  } catch (e) {
    console.error('创建备份失败', e)
    throw new Error('创建备份失败: ' + e)
  }
}

/**
 * 从备份恢复数据
 * @param filePath 备份文件路径
 * @param options 导入选项
 * @returns Promise<恢复结果>
 */
export async function restoreFromBackup(
  filePath: string, 
  options: {
    overwriteBest30?: boolean,
    overwriteRecent?: boolean,
    overwritePTTData?: boolean,
    overwriteSongs?: boolean
  } = {}
): Promise<{ success: boolean, message: string }> {
  try {
    const data = await readDataFromFile(filePath)
    
    // 验证数据格式
    if (!data.version || !data.exportTime || !data.type) {
      return { success: false, message: '备份文件格式不正确' }
    }
    
    return importData(data, options)
  } catch (e) {
    console.error('恢复备份失败', e)
    return { success: false, message: '恢复备份失败: ' + e }
  }
}

/**
 * 清空所有应用数据
 */
export function clearAllData(): void {
  try {
    uni.removeStorageSync('best30_records')
    uni.removeStorageSync('recent_scores')
    uni.removeStorageSync('ptt_data')
    // 注意：不清空歌曲数据，除非用户明确要求
  } catch (e) {
    console.error('清空数据失败', e)
    throw new Error('清空数据失败: ' + e)
  }
}

/**
 * 获取数据统计信息
 * @returns 数据统计信息
 */
export function getDataStatistics(): {
  best30Count: number,
  recentCount: number,
  songsCount: number,
  lastPTTUpdate: string | null,
  totalSize: string
} {
  try {
    const best30Records = uni.getStorageSync('best30_records') || []
    const recentRecords = uni.getStorageSync('recent_scores') || []
    const songsData = uni.getStorageSync('songs_data') || []
    const pttData = uni.getStorageSync('ptt_data')
    
    let lastPTTUpdate = null
    if (pttData && pttData.lastUpdated) {
      lastPTTUpdate = new Date(pttData.lastUpdated).toLocaleString()
    }
    
    // 简单估算数据大小
    const best30Size = JSON.stringify(best30Records).length
    const recentSize = JSON.stringify(recentRecords).length
    const songsSize = JSON.stringify(songsData).length
    const pttSize = JSON.stringify(pttData).length
    const totalBytes = best30Size + recentSize + songsSize + pttSize
    
    let totalSize = '0 B'
    if (totalBytes < 1024) {
      totalSize = `${totalBytes} B`
    } else if (totalBytes < 1024 * 1024) {
      totalSize = `${(totalBytes / 1024).toFixed(2)} KB`
    } else {
      totalSize = `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
    }
    
    return {
      best30Count: best30Records.length,
      recentCount: recentRecords.length,
      songsCount: songsData.length,
      lastPTTUpdate,
      totalSize
    }
  } catch (e) {
    console.error('获取数据统计失败', e)
    return {
      best30Count: 0,
      recentCount: 0,
      songsCount: 0,
      lastPTTUpdate: null,
      totalSize: '0 B'
    }
  }
}

/**
 * 验证数据完整性
 * @returns 验证结果
 */
export function validateDataIntegrity(): {
  isValid: boolean,
  issues: string[]
} {
  const issues: string[] = []
  
  try {
    // 验证B30记录
    const best30Records = uni.getStorageSync('best30_records') || []
    if (!Array.isArray(best30Records)) {
      issues.push('B30记录格式不正确')
    } else {
      best30Records.forEach((record, index) => {
        if (!record.songName || !record.difficulty || record.constant === undefined || record.score === undefined || record.ptt === undefined) {
          issues.push(`B30记录 ${index + 1} 数据不完整`)
        }
      })
    }
    
    // 验证最近记录
    const recentRecords = uni.getStorageSync('recent_scores') || []
    if (!Array.isArray(recentRecords)) {
      issues.push('最近记录格式不正确')
    }
    
    // 验证PTT数据
    const pttData = uni.getStorageSync('ptt_data')
    if (pttData && (typeof pttData.currentPTT !== 'number' || typeof pttData.best10Avg !== 'number')) {
      issues.push('PTT数据格式不正确')
    }
    
    // 验证歌曲数据
    const songsData = uni.getStorageSync('songs_data') || []
    if (!Array.isArray(songsData)) {
      issues.push('歌曲数据格式不正确')
    }
    
    return {
      isValid: issues.length === 0,
      issues
    }
  } catch (e) {
    console.error('验证数据完整性失败', e)
    return {
      isValid: false,
      issues: ['验证数据完整性时发生错误']
    }
  }
}