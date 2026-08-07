/**
 * Arcaea PTT计算工具函数
 * 基于官方PTT计算公式实现
 */

import { RATING_THRESHOLDS } from '../constants'

// 评级、难度相关函数统一由 helpers.ts 提供（走 constants 常量表）
export { getRating, getRatingClass, getDifficultyText, getDifficultyClass } from './helpers'

/**
 * 根据成绩和定数计算PTT
 * @param score 成绩 (0-10000000)
 * @param constant 谱面定数
 * @returns PTT值
 *
 * 官方公式（Arcaea 中文维基）：
 * - ≥10,000,000：定数 + 2
 * - ≥9,800,000：定数 + 1 + (分数 - 9,800,000) / 200,000
 * - <9,800,000：定数 + (分数 - 9,500,000) / 300,000（向下线性，下限为 0）
 */
export function calculatePtt(score: number, constant: number): number {
  if (score >= 10000000) return constant + 2
  if (score >= 9800000) return constant + 1 + (score - 9800000) / 200000
  return Math.max(0, constant + (score - 9500000) / 300000)
}

/**
 * 根据目标PTT和定数计算所需成绩
 * @param targetPtt 目标PTT
 * @param constant 谱面定数
 * @returns 所需成绩
 */
export function calculateScore(targetPtt: number, constant: number): number {
  const offset = targetPtt - constant
  
  if (offset >= 2.0) {
    return 10000000
  } else if (offset >= 1.0) {
    return Math.floor(9800000 + (offset - 1.0) * 200000)
  }
  // 低于 9,800,000：ptt = max(0, constant + (score - 9,500,000) / 300,000)
  return Math.max(0, Math.floor(9500000 + offset * 300000))
}

/**
 * 根据评级获取最低分数
 * @param rating 评级
 * @returns 最低分数
 */
export function getMinScoreByRating(rating: string): number {
  // 评级阈值收敛到 constants 单一来源（RATING_THRESHOLDS，官方口径）
  const found = RATING_THRESHOLDS.find(t => t.label === rating)
  return found ? found.min : 0
}

/**
 * 计算B30和R10的平均PTT
 * @param best30Records B30记录数组
 * @param recent10Records R10记录数组
 * @returns 包含各种平均PTT的对象
 */
export function calculatePttAverages(
  best30Records: any[], 
  recent10Records: any[]
): { best30Avg: number, best10Avg: number, recent10Avg: number, currentPTT: number } {
  let best30Avg = 0
  let best10Avg = 0
  let recent10Avg = 0
  let currentPTT = 0
  
  // 计算B30平均
  if (best30Records.length > 0) {
    const best30Total = best30Records.reduce((sum, record) => sum + record.ptt, 0)
    best30Avg = best30Total / best30Records.length
    
    // 计算B10平均
    const top10Records = [...best30Records].sort((a, b) => b.ptt - a.ptt).slice(0, 10)
    const best10Total = top10Records.reduce((sum, record) => sum + record.ptt, 0)
    best10Avg = best10Total / top10Records.length
  }
  
  // 计算R10平均
  if (recent10Records.length > 0) {
    const recent10Total = recent10Records.reduce((sum, record) => sum + record.ptt, 0)
    recent10Avg = recent10Total / recent10Records.length
  }
  
  // 计算当前PTT (B10*0.75 + R10*0.25)
  currentPTT = best10Avg * 0.75 + recent10Avg * 0.25
  
  return { best30Avg, best10Avg, recent10Avg, currentPTT }
}

/**
 * 格式化PTT值显示
 * @param ptt PTT值
 * @param decimals 小数位数，默认2
 * @returns 格式化后的PTT字符串
 */
export function formatPtt(ptt: number, decimals: number = 2): string {
  return ptt.toFixed(decimals)
}

/**
 * 格式化成绩显示
 * @param score 成绩
 * @returns 格式化后的成绩字符串
 */
export function formatScore(score: number): string {
  return score.toLocaleString()
}

/**
 * 验证成绩是否在有效范围内
 * @param score 成绩
 * @returns 是否有效
 */
export function isValidScore(score: number): boolean {
  return !isNaN(score) && score >= 0 && score <= 10000000
}

/**
 * 验证PTT是否在合理范围内
 * @param ptt PTT值
 * @returns 是否有效
 */
export function isValidPtt(ptt: number): boolean {
  return !isNaN(ptt) && ptt >= 0 && ptt <= 20
}

/**
 * 计算两个PTT值之间的差距
 * @param current 当前PTT
 * @param target 目标PTT
 * @returns PTT差距
 */
export function calculatePttGap(current: number, target: number): number {
  return target - current
}
