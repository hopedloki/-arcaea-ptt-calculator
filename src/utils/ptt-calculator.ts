/**
 * Arcaea PTT计算工具函数
 * 基于官方PTT计算公式实现
 */

/**
 * 根据成绩和定数计算PTT
 * @param score 成绩 (0-10000000)
 * @param constant 谱面定数
 * @returns PTT值
 */
export function calculatePtt(score: number, constant: number): number {
  if (score >= 10000000) {
    return constant + 2.0
  } else if (score >= 9800000) {
    return constant + 1.0 + (score - 9800000) / 200000
  } else {
    return constant + Math.max(0, (score - 9500000) / 300000)
  }
}

/**
 * 根据目标PTT和定数计算所需成绩
 * @param targetPtt 目标PTT
 * @param constant 谱面定数
 * @returns 所需成绩
 */
export function calculateScore(targetPtt: number, constant: number): number {
  const targetPttAboveConstant = targetPtt - constant
  
  if (targetPttAboveConstant >= 2.0) {
    return 10000000
  } else if (targetPttAboveConstant >= 1.0) {
    return Math.floor(9800000 + (targetPttAboveConstant - 1.0) * 200000)
  } else if (targetPttAboveConstant >= 0) {
    return Math.floor(9500000 + targetPttAboveConstant * 300000)
  } else {
    return Math.floor(9500000 + targetPttAboveConstant * 300000) // 可能低于950万
  }
}

/**
 * 根据成绩获取评级
 * @param score 成绩
 * @returns 评级字符串
 */
export function getRating(score: number): string {
  if (score === 10000000) return 'PM'
  else if (score >= 9900000) return 'EX+'
  else if (score >= 9800000) return 'EX'
  else if (score >= 9500000) return 'AA'
  else if (score >= 9200000) return 'A'
  else if (score >= 8900000) return 'B'
  else if (score >= 8600000) return 'C'
  else return 'D'
}

/**
 * 根据评级获取最低分数
 * @param rating 评级
 * @returns 最低分数
 */
export function getMinScoreByRating(rating: string): number {
  const ratingMap: Record<string, number> = {
    'PM': 10000000,
    'EX+': 9900000,
    'EX': 9800000,
    'AA': 9500000,
    'A': 9200000,
    'B': 8900000,
    'C': 8600000,
    'D': 0
  }
  return ratingMap[rating] || 0
}

/**
 * 计算评级容错
 * @param pureCount Pure数量
 * @param farCount Far数量
 * @param lostCount Lost数量
 * @param targetRating 目标评级
 * @param totalNotes 总Note数
 * @param bigPureCount 大Pure数量（可选）
 * @returns 容错信息对象
 */
export function calculateRatingTolerance(
  pureCount: number, 
  farCount: number = 0,
  lostCount: number = 0,
  targetRating: string, 
  totalNotes: number = 1200,
  bigPureCount: number = 0
): { 
  maxFarCount: number, 
  maxLostCount: number, 
  currentScore: number,
  targetScore: number,
  canAchieve: boolean
} {
  const targetScore = getMinScoreByRating(targetRating)
  
  // 计算基本分
  const baseScorePerNote = 10000000 / totalNotes
  const baseScore = pureCount * baseScorePerNote + farCount * (baseScorePerNote / 2)
  
  // 计算判定附加分（大Pure每个+1分）
  const bonusScore = bigPureCount
  
  // 总分数（向下取整）
  const currentScore = Math.floor(baseScore + bonusScore)
  
  // 检查是否已达成目标评级
  if (currentScore >= targetScore) {
    // 已经达成目标，计算可以额外容错的判定数
    const scoreGap = currentScore - targetScore
    const maxAdditionalFar = Math.floor(scoreGap / (baseScorePerNote / 2))
    const maxAdditionalLost = Math.floor((scoreGap - maxAdditionalFar * (baseScorePerNote / 2)) / baseScorePerNote)
    
    // 检查容错数是否超过剩余Note数
    const remainingNotes = totalNotes - pureCount - farCount - lostCount
    const finalMaxLost = Math.min(maxAdditionalLost, remainingNotes)
    // 计算剩余的分数空间能容纳多少Far（在已经计入Lost后）
    const remainingScore = scoreGap - finalMaxLost * baseScorePerNote
    const additionalFar = Math.floor(remainingScore / (baseScorePerNote / 2))
    const finalMaxFar = farCount + additionalFar
    
    return {
      maxFarCount: finalMaxFar,
      maxLostCount: finalMaxLost,
      currentScore,
      targetScore,
      canAchieve: true
    }
  }
  
  // 未达成目标，正确计算剩余Note数是否能达成目标
  const scoreNeeded = targetScore - currentScore
  const remainingNotes = totalNotes - pureCount - farCount - lostCount
  
  // 计算剩余Note全P能获得的最大分数
  const maxPossibleScore = currentScore + remainingNotes * baseScorePerNote
  
  if (maxPossibleScore < targetScore) {
    // 即使剩余Note全P也无法达成目标，容错为当前值
    return {
      maxFarCount: farCount,
      maxLostCount: lostCount,
      currentScore,
      targetScore,
      canAchieve: false
    }
  } else {
    // 剩余Note全P可以达成目标，计算具体容错数
    // 计算需要多少个未判定Note转为Pure才能达成目标
    const neededPureCount = Math.ceil(scoreNeeded / baseScorePerNote)
    
    // 剩余Note中还可以容忍多少Far（这些Far代替Pure）
    const remainingAfterNeededPure = remainingNotes - neededPureCount
    const maxFarCount = farCount + remainingAfterNeededPure
    
    // 剩余Note中还可以容忍多少Lost（这些Lost代替Pure）
    const maxLostCount = lostCount + Math.floor(remainingAfterNeededPure / 2)
    
    return {
      maxFarCount,
      maxLostCount,
      currentScore,
      targetScore,
      canAchieve: false
    }
  }
}

/**
 * 计算分数容错（基于正确的评分系统）
 * @param pureCount Pure数量
 * @param farCount Far数量
 * @param lostCount Lost数量
 * @param bigPureCount 大Pure数量
 * @param targetScore 目标分数
 * @param totalNotes 总Note数
 * @returns 容错信息
 */
export function calculateScoreTolerance(
  pureCount: number,
  farCount: number = 0,
  lostCount: number = 0,
  bigPureCount: number = 0,
  targetScore: number,
  totalNotes: number = 1200
): {
  currentScore: number,
  maxFarCount: number,
  maxLostCount: number,
  canAchieve: boolean,
  tolerableFar: number,
  tolerableLost: number
} {
  // 计算基本分
  const baseScorePerNote = 10000000 / totalNotes
  const baseScore = pureCount * baseScorePerNote + farCount * (baseScorePerNote / 2)
  
  // 计算判定附加分（大Pure每个+1分）
  const bonusScore = bigPureCount
  
  // 总分数（向下取整）
  const currentScore = Math.floor(baseScore + bonusScore)
  
  // 检查是否已达成目标
  if (currentScore >= targetScore) {
    // 已经达成目标，计算可以额外容错的判定数
    const scoreGap = currentScore - targetScore
    const maxAdditionalFar = Math.floor(scoreGap / (baseScorePerNote / 2))
    const maxAdditionalLost = Math.floor((scoreGap - maxAdditionalFar * (baseScorePerNote / 2)) / baseScorePerNote)
    
    // 检查容错数是否超过剩余Note数
    const remainingNotes = totalNotes - pureCount - farCount - lostCount
    const finalMaxLost = Math.min(maxAdditionalLost, remainingNotes)
    // 计算剩余的分数空间能容纳多少Far（在已经计入Lost后）
    const remainingScore = scoreGap - finalMaxLost * baseScorePerNote
    const additionalFar = Math.floor(remainingScore / (baseScorePerNote / 2))
    const finalMaxFar = farCount + additionalFar
    
    return {
      currentScore,
      maxFarCount: finalMaxFar,
      maxLostCount: finalMaxLost,
      canAchieve: true,
      tolerableFar: finalMaxFar,
      tolerableLost: finalMaxLost
    }
  } else {
    // 未达成目标，正确计算剩余Note数是否能达成目标
    const neededScore = targetScore - currentScore
    const remainingNotes = totalNotes - pureCount - farCount - lostCount
    
    // 计算剩余Note全P能获得的最大分数
    const maxPossibleScore = currentScore + remainingNotes * baseScorePerNote
    
    if (maxPossibleScore < targetScore) {
      // 即使剩余Note全P也无法达成目标，容错为当前值
      return {
        currentScore,
        maxFarCount: farCount,
        maxLostCount: lostCount,
        canAchieve: false,
        tolerableFar: farCount,
        tolerableLost: lostCount
      }
    } else {
      // 剩余Note全P可以达成目标，计算具体容错数
      // 计算需要多少个未判定Note转为Pure才能达成目标
      const neededPureCount = Math.ceil(neededScore / baseScorePerNote)
      
      // 剩余Note中还可以容忍多少Far（这些Far代替Pure）
      const remainingAfterNeededPure = remainingNotes - neededPureCount
      const tolerableFar = farCount + remainingAfterNeededPure
      
      // 剩余Note中还可以容忍多少Lost（这些Lost代替Pure）
      const tolerableLost = lostCount + Math.floor(remainingAfterNeededPure / 2)
      
      return {
        currentScore,
        maxFarCount: tolerableFar,
        maxLostCount: tolerableLost,
        canAchieve: false,
        tolerableFar,
        tolerableLost
      }
    }
  }
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
 * 获取难度文本
 * @param difficulty 难度代码
 * @returns 难度文本
 */
export function getDifficultyText(difficulty: string): string {
  const difficultyMap: Record<string, string> = {
    'pst': 'PAST',
    'prs': 'PRESENT',
    'ftr': 'FUTURE',
    'byd': 'BEYOND',
    'etr': 'ETERNAL'
  }
  return difficultyMap[difficulty] || difficulty.toUpperCase()
}

/**
 * 获取难度样式类
 * @param difficulty 难度代码
 * @returns 难度样式类
 */
export function getDifficultyClass(difficulty: string): string {
  const difficultyMap: Record<string, string> = {
    'pst': 'difficulty-pst',
    'prs': 'difficulty-prs',
    'ftr': 'difficulty-ftr',
    'byd': 'difficulty-byd',
    'etr': 'difficulty-etr'
  }
  return difficultyMap[difficulty] || ''
}

/**
 * 获取评级样式类
 * @param rating 评级
 * @returns 评级样式类
 */
export function getRatingClass(rating: string): string {
  const ratingMap: Record<string, string> = {
    'PM': 'rating-pm',
    'EX+': 'rating-ex-plus',
    'EX': 'rating-ex',
    'AA': 'rating-aa',
    'A': 'rating-a',
    'B': 'rating-b',
    'C': 'rating-c',
    'D': 'rating-d'
  }
  return ratingMap[rating] || ''
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