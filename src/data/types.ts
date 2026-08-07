/**
 * Arcaea歌曲数据类型定义
 * 基于 arcaea-toolbelt-data 的数据结构。
 * Phase 3 类型清理：类型定义收敛到 src/types/index.ts 单一来源，
 * 本文件仅保留数据转换函数并重新导出类型。
 */
import type { SimpleSongData, SongData } from '../types'

export type { ChartData, SimpleSongData, SongData, SongVersion, PackData } from '../types'

/**
 * 转换SongData到SimpleSongData
 */
export function toSimpleSongData(song: SongData): SimpleSongData {
  const result: SimpleSongData = {
    id: song.id,
    name: song.name,
    pack: song.pack,
    dl: song.dl,
    alias: song.alias,
  }

  // 从charts中提取定数和物量（难度键为联合类型，物量键需显式断言）
  song.charts.forEach(chart => {
    const diff = chart.difficulty
    result[diff] = chart.constant
    const notesKey = `${diff}Notes` as 'pstNotes' | 'prsNotes' | 'ftrNotes' | 'bydNotes' | 'etrNotes'
    result[notesKey] = chart.note
  })

  return result
}
