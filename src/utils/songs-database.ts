/**
 * Arcaea歌曲数据库工具
 * 用于管理歌曲数据和定数信息
 */

/**
 * 歌曲数据结构
 */
export interface SongData {
  name: string
  artist?: string
  pst?: number | null
  prs?: number | null
  ftr?: number | null
  byd?: number | null
  etr?: number | null
}

/**
 * 保存歌曲数据到本地存储
 * @param songs 歌曲数据数组
 */
export function saveSongsData(songs: SongData[]): void {
  try {
    uni.setStorageSync('songs_data', songs)
  } catch (e) {
    console.error('保存歌曲数据失败', e)
  }
}

/**
 * 从本地存储加载歌曲数据
 * @returns 歌曲数据数组
 */
export function loadSongsData(): SongData[] {
  try {
    return uni.getStorageSync('songs_data') || []
  } catch (e) {
    console.error('加载歌曲数据失败', e)
    return []
  }
}

/**
 * 从API获取歌曲数据
 * @returns Promise<SongData[]>
 */
export async function fetchSongsFromAPI(): Promise<SongData[]> {
  try {
    // 直接导入歌曲常量数据
    const { getSongsData } = await import('@/utils/song-constants.js')
    const songsData = getSongsData()
    return songsData
  } catch (err) {
    throw new Error('加载歌曲数据失败: ' + err)
  }
}

/**
 * 初始化默认歌曲数据
 * @returns 默认歌曲数据数组
 */
export function initializeDefaultSongsData(): SongData[] {
  return [
    {
      name: 'Testify',
      artist: 'Neko Hacker',
      pst: 7.8,
      prs: 9.4,
      ftr: 10.9,
      byd: 12.0,
      etr: null
    },
    {
      name: 'Fracture Ray',
      artist: 'xi',
      pst: 5.0,
      prs: 7.0,
      ftr: 9.8,
      byd: 11.2,
      etr: null
    },
    {
      name: 'Ringed Genesis',
      artist: 'ARForest',
      pst: 4.0,
      prs: 6.0,
      ftr: 8.8,
      byd: 10.5,
      etr: null
    },
    {
      name: 'Grievous Lady',
      artist: 'Laur',
      pst: 5.5,
      prs: 7.5,
      ftr: 9.9,
      byd: 11.1,
      etr: null
    },
    {
      name: 'Harutopia ~Utopia of Spring~',
      artist: 'ARForest',
      pst: 3.0,
      prs: 5.0,
      ftr: 7.5,
      byd: 9.5,
      etr: null
    },
    {
      name: 'World Ender',
      artist: 'Camellia',
      pst: 5.5,
      prs: 8.0,
      ftr: 10.5,
      byd: 11.7,
      etr: null
    },
    {
      name: 'Modelista',
      artist: 'Kukka',
      pst: 2.0,
      prs: 5.0,
      ftr: 8.0,
      byd: 10.5,
      etr: null
    },
    {
      name: 'GOODTEK (Arcaea Edit)',
      artist: 'EBIMAYO',
      pst: 4.0,
      prs: 6.5,
      ftr: 9.0,
      byd: 11.0,
      etr: null
    },
    {
      name: 'Cyaegha',
      artist: 'USAO',
      pst: 6.0,
      prs: 8.0,
      ftr: 10.0,
      byd: 11.4,
      etr: null
    },
    {
      name: 'SOUNDWiTCH',
      artist: 'Kobaryo',
      pst: 4.5,
      prs: 7.0,
      ftr: 9.2,
      byd: 10.8,
      etr: null
    }
  ]
}

/**
 * 初始化歌曲数据库
 * 检查本地存储中是否有歌曲数据，如果没有则初始化默认数据
 */
export function initializeSongsDatabase(): void {
  try {
    const songsData = loadSongsData()
    
    if (songsData.length === 0 || songsData.length < 400) {
      // 如果本地没有数据或者数据不完整（少于400首），尝试加载完整的歌曲数据
      if (songsData.length > 0 && songsData.length < 400) {
        console.log('检测到本地歌曲数据不完整，仅', songsData.length, '首，重新加载完整数据')
      }
      
      loadCompleteSongsData().then(songs => {
        if (songs.length > 0) {
          saveSongsData(songs)
          console.log('已加载完整歌曲数据，共', songs.length, '首歌曲')
        } else {
          // 如果加载失败，使用默认数据
          const defaultSongs = initializeDefaultSongsData()
          saveSongsData(defaultSongs)
          console.log('已初始化默认歌曲数据')
        }
      }).catch(err => {
        console.error('加载完整歌曲数据失败:', err)
        const defaultSongs = initializeDefaultSongsData()
        saveSongsData(defaultSongs)
      })
    }
  } catch (e) {
    console.error('初始化歌曲数据库失败', e)
    const defaultSongs = initializeDefaultSongsData()
    saveSongsData(defaultSongs)
  }
}

/**
 * 加载完整的歌曲数据
 * 从内置的歌曲常量文件加载
 */
async function loadCompleteSongsData(): Promise<SongData[]> {
  try {
    // 直接导入歌曲常量数据
    const { getSongsData } = await import('@/utils/song-constants.js')
    const songsArray = getSongsData()
    return songsArray
  } catch (err) {
    console.error('加载歌曲数据失败:', err)
    throw err
  }
}

/**
 * 搜索歌曲
 * @param query 搜索关键词
 * @param songs 歌曲数据数组
 * @returns 匹配的歌曲数组
 */
export function searchSongs(query: string, songs?: SongData[]): SongData[] {
  const songsData = songs || loadSongsData()
  
  if (!query.trim()) return songsData
  
  const lowerQuery = query.toLowerCase()
  
  return songsData.filter(song => 
    song.name.toLowerCase().includes(lowerQuery) ||
    (song.artist && song.artist.toLowerCase().includes(lowerQuery))
  )
}

/**
 * 按难度筛选歌曲
 * @param difficulty 难度 (pst, prs, ftr, byd, etr)
 * @param songs 歌曲数据数组
 * @returns 筛选后的歌曲数组
 */
export function filterSongsByDifficulty(difficulty: string, songs?: SongData[]): SongData[] {
  const songsData = songs || loadSongsData()
  
  if (difficulty === 'all') return songsData
  
  return songsData.filter(song => 
    song[difficulty] !== null && song[difficulty] !== undefined
  )
}

/**
 * 按定数范围筛选歌曲
 * @param min 最小定数
 * @param max 最大定数
 * @param songs 歌曲数据数组
 * @returns 筛选后的歌曲数组
 */
export function filterSongsByConstantRange(min: number, max: number, songs?: SongData[]): SongData[] {
  const songsData = songs || loadSongsData()
  
  return songsData.filter(song => {
    const difficulties = ['pst', 'prs', 'ftr', 'byd', 'etr']
    return difficulties.some(diff => {
      const constant = song[diff]
      return constant !== null && 
             constant !== undefined && 
             constant >= min && 
             constant < max
    })
  })
}

/**
 * 获取歌曲的所有可用难度
 * @param song 歌曲数据
 * @returns 可用难度对象
 */
export function getAvailableDifficulties(song: SongData): Record<string, { name: string, constant: number }> {
  const difficulties = {
    pst: { name: 'PST', constant: song.pst },
    prs: { name: 'PRS', constant: song.prs },
    ftr: { name: 'FTR', constant: song.ftr },
    byd: { name: 'BYD', constant: song.byd },
    etr: { name: 'ETR', constant: song.etr }
  }
  
  // 过滤掉不存在的难度
  const available: Record<string, { name: string, constant: number }> = {}
  for (const key in difficulties) {
    if (difficulties[key].constant !== null && difficulties[key].constant !== undefined) {
      available[key] = difficulties[key]
    }
  }
  
  return available
}

/**
 * 获取歌曲的最高定数
 * @param song 歌曲数据
 * @returns 最高定数和对应难度
 */
export function getHighestConstant(song: SongData): { constant: number, difficulty: string } {
  const available = getAvailableDifficulties(song)
  let highest = { constant: 0, difficulty: 'ftr' }
  
  for (const diff in available) {
    if (available[diff].constant > highest.constant) {
      highest = {
        constant: available[diff].constant,
        difficulty: diff
      }
    }
  }
  
  return highest
}

/**
 * 按定数排序歌曲
 * @param songs 歌曲数据数组
 * @param difficulty 指定难度
 * @param ascending 是否升序
 * @returns 排序后的歌曲数组
 */
export function sortSongsByConstant(songs: SongData[], difficulty: string = 'ftr', ascending: boolean = false): SongData[] {
  return [...songs].sort((a, b) => {
    const aConstant = a[difficulty] || 0
    const bConstant = b[difficulty] || 0
    
    return ascending ? aConstant - bConstant : bConstant - aConstant
  })
}

/**
 * 按名称排序歌曲
 * @param songs 歌曲数据数组
 * @param ascending 是否升序
 * @returns 排序后的歌曲数组
 */
export function sortSongsByName(songs: SongData[], ascending: boolean = true): SongData[] {
  return [...songs].sort((a, b) => {
    return ascending ? 
      a.name.localeCompare(b.name) : 
      b.name.localeCompare(a.name)
  })
}

/**
 * 获取歌曲统计信息
 * @param songs 歌曲数据数组
 * @returns 统计信息
 */
export function getSongsStatistics(songs?: SongData[]): {
  totalSongs: number,
  difficultyCounts: Record<string, number>,
  avgConstants: Record<string, number>
} {
  const songsData = songs || loadSongsData()
  
  const difficulties = ['pst', 'prs', 'ftr', 'byd', 'etr']
  const difficultyCounts: Record<string, number> = {}
  const totalConstants: Record<string, number> = {}
  
  difficulties.forEach(diff => {
    difficultyCounts[diff] = 0
    totalConstants[diff] = 0
  })
  
  songsData.forEach(song => {
    difficulties.forEach(diff => {
      if (song[diff] !== null && song[diff] !== undefined) {
        difficultyCounts[diff]++
        totalConstants[diff] += song[diff] as number
      }
    })
  })
  
  const avgConstants: Record<string, number> = {}
  difficulties.forEach(diff => {
    avgConstants[diff] = difficultyCounts[diff] > 0 ? 
      totalConstants[diff] / difficultyCounts[diff] : 0
  })
  
  return {
    totalSongs: songsData.length,
    difficultyCounts,
    avgConstants
  }
}

/**
 * 根据定数范围推荐歌曲
 * @param minConstant 最小定数
 * @param maxConstant 最大定数
 * @param difficulty 难度
 * @param count 推荐数量
 * @param songs 歌曲数据数组
 * @returns 推荐歌曲数组
 */
export function recommendSongsByConstant(
  minConstant: number, 
  maxConstant: number, 
  difficulty: string = 'ftr',
  count: number = 10,
  songs?: SongData[]
): SongData[] {
  const songsData = songs || loadSongsData()
  
  // 筛选在指定定数范围内的歌曲
  const filteredSongs = songsData.filter(song => {
    const constant = song[difficulty]
    return constant !== null && 
           constant !== undefined && 
           constant >= minConstant && 
           constant < maxConstant
  })
  
  // 随机打乱并取前count个
  return filteredSongs
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
}