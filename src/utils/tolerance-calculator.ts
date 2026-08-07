/**
 * 容错计算工具函数
 * 提供评级容错、分数容错和PTT容错的计算能力
 */

import { RATING_THRESHOLDS } from '../constants'

/**
 * 评级选项
 */
export interface RatingOption {
  name: string
  minScore: number
}

/**
 * 评级容错结果（基础版 - 供 song-detail 使用）
 */
export interface RatingToleranceResult {
  canAchieve: boolean
  maxFarCount: number
  maxLostCount: number
}

/**
 * 评级容错结果（完整版）
 */
export interface RatingToleranceFullResult {
  minScore: number
  maxScore: number
  maxFarCount: number
  maxLostCount: number
  currentScore: number
  canAchieve: boolean
  remainingNotes?: number
  theoreticalMaxScore?: number
}

/**
 * 分数容错结果
 */
export interface ScoreToleranceResult {
  targetScore: number
  currentScore: number
  scoreGap: number
  tolerableFar: number
  tolerableLost: number
  canAchieve: boolean
  remainingNotes?: number
  theoreticalMaxScore?: number
}

/**
 * PTT容错结果
 */
export interface PTTToleranceResult {
  targetPtt: number
  currentPtt: number
  pttGap: number
  tolerableFar: number
  tolerableLost: number
  canAchieve: boolean
  remainingNotes?: number
  theoreticalMaxScore?: number
  theoreticalMaxPtt?: number
}

/**
 * 容错计算统一参数
 */
export interface ToleranceParams {
  notes: number
  pure: number
  far: number
  lost: number
  bigPure: number
  constant: number
}

/**
 * 计算 PTT（从分数和定数）
 */
function calculatePttFromScore(score: number, constant: number): number {
  if (score >= 10000000) {
    return constant + 2.0
  } else if (score >= 9800000) {
    return constant + 1.0 + (score - 9800000) / 200000
  }
  return Math.max(0, constant + (score - 9500000) / 300000)
}

/**
 * 计算目标 PTT 所需的最低分数（与 ptt-calculator.calculateScore 保持同一分段公式）
 */
function calculateScoreFromTargetPtt(targetPtt: number, constant: number): number {
  const offset = targetPtt - constant

  if (offset >= 2.0) {
    return 10000000
  } else if (offset >= 1.0) {
    return Math.floor(9800000 + (offset - 1.0) * 200000)
  }
  return Math.max(0, Math.floor(9500000 + offset * 300000))
}

/**
 * 辅助：基于判定数计算当前分数
 */
function calcCurrentScore(params: ToleranceParams): number {
  const baseScorePerNote = 10000000 / params.notes
  const baseScore = params.pure * baseScorePerNote + params.far * (baseScorePerNote / 2)
  return Math.floor(baseScore + params.bigPure)
}

/**
 * 评级容错计算（基于当前判定）
 */
export function calculateRatingTolerance(
  params: ToleranceParams,
  targetRating: RatingOption
): RatingToleranceFullResult {
  const baseScorePerNote = 10000000 / params.notes
  const currentScore = calcCurrentScore(params)
  const targetScore = targetRating.minScore
  const scoreGap = currentScore - targetScore
  const remainingNotes = params.notes - params.pure - params.far - params.lost

  if (scoreGap >= 0) {
    const maxAdditionalFar = Math.floor(scoreGap / (baseScorePerNote / 2))
    const maxAdditionalLost = Math.floor((scoreGap - maxAdditionalFar * (baseScorePerNote / 2)) / baseScorePerNote)
    const finalMaxLost = Math.min(maxAdditionalLost, remainingNotes)
    const remainingScore = scoreGap - finalMaxLost * baseScorePerNote
    const additionalFar = Math.floor(remainingScore / (baseScorePerNote / 2))
    return {
      minScore: targetScore,
      maxScore: currentScore,
      maxFarCount: params.far + additionalFar,
      maxLostCount: finalMaxLost,
      currentScore,
      canAchieve: true,
    }
  }

  const neededScore = -scoreGap
  const maxPossibleScore = currentScore + remainingNotes * baseScorePerNote

  if (maxPossibleScore < targetScore) {
    const theoreticalMaxScore = currentScore + remainingNotes * baseScorePerNote + remainingNotes
    return {
      minScore: targetScore,
      maxScore: theoreticalMaxScore,
      currentScore,
      maxFarCount: params.far,
      maxLostCount: params.lost,
      canAchieve: false,
      remainingNotes,
      theoreticalMaxScore,
    }
  }

  const neededPureCount = Math.ceil(neededScore / baseScorePerNote)
  const remainingAfterNeededPure = remainingNotes - neededPureCount
  return {
    minScore: targetScore,
    maxScore: currentScore,
    maxFarCount: params.far + remainingAfterNeededPure,
    maxLostCount: params.lost + Math.floor(remainingAfterNeededPure / 2),
    currentScore,
    canAchieve: false,
  }
}

/**
 * 分数容错计算（基于当前判定）
 */
export function calculateScoreTolerance(
  params: ToleranceParams,
  targetScore: number
): ScoreToleranceResult {
  const baseScorePerNote = 10000000 / params.notes
  const currentScore = calcCurrentScore(params)
  const scoreGap = currentScore - targetScore

  if (scoreGap >= 0) {
    const maxAdditionalFar = Math.floor(scoreGap / (baseScorePerNote / 2))
    const maxAdditionalLost = Math.floor((scoreGap - maxAdditionalFar * (baseScorePerNote / 2)) / baseScorePerNote)
    const remainingNotes = params.notes - params.pure - params.far - params.lost
    const finalMaxLost = Math.min(maxAdditionalLost, remainingNotes)
    const remainingScore = scoreGap - finalMaxLost * baseScorePerNote
    return {
      targetScore,
      currentScore,
      scoreGap,
      tolerableFar: params.far + Math.floor(remainingScore / (baseScorePerNote / 2)),
      tolerableLost: finalMaxLost,
      canAchieve: true,
    }
  }

  return _calcScoreNotAchieved(currentScore, targetScore, scoreGap, baseScorePerNote, params)
}

function _calcScoreNotAchieved(
  currentScore: number,
  targetScore: number,
  scoreGap: number,
  baseScorePerNote: number,
  params: ToleranceParams
): ScoreToleranceResult {
  const neededScore = -scoreGap
  const remainingNotes = params.notes - params.pure - params.far - params.lost
  const maxPossibleScore = currentScore + remainingNotes * baseScorePerNote

  if (maxPossibleScore < targetScore) {
    const theoreticalMaxScore = currentScore + remainingNotes * baseScorePerNote + remainingNotes
    return {
      targetScore,
      currentScore,
      scoreGap,
      theoreticalMaxScore,
      tolerableFar: params.far,
      tolerableLost: params.lost,
      canAchieve: false,
      remainingNotes,
    }
  }

  const neededPureCount = Math.ceil(neededScore / baseScorePerNote)
  const remainingAfterNeededPure = remainingNotes - neededPureCount
  return {
    targetScore,
    currentScore,
    scoreGap,
    tolerableFar: params.far + remainingAfterNeededPure,
    tolerableLost: params.lost + Math.floor(remainingAfterNeededPure / 2),
    canAchieve: false,
  }
}

/**
 * PTT容错计算（基于当前判定）
 */
export function calculatePTTTolerance(
  params: ToleranceParams,
  targetPtt: number
): PTTToleranceResult {
  const baseScorePerNote = 10000000 / params.notes
  const currentScore = calcCurrentScore(params)
  const currentPtt = calculatePttFromScore(currentScore, params.constant)

  const targetScore = calculateScoreFromTargetPtt(targetPtt, params.constant)
  const scoreGap = currentScore - targetScore

  if (scoreGap >= 0) {
    const maxAdditionalFar = Math.floor(scoreGap / (baseScorePerNote / 2))
    const maxAdditionalLost = Math.floor((scoreGap - maxAdditionalFar * (baseScorePerNote / 2)) / baseScorePerNote)
    const remainingNotes = params.notes - params.pure - params.far - params.lost
    const finalMaxLost = Math.min(maxAdditionalLost, remainingNotes)
    const remainingScore = scoreGap - finalMaxLost * baseScorePerNote
    return {
      targetPtt,
      currentPtt,
      pttGap: currentPtt - targetPtt,
      tolerableFar: params.far + Math.floor(remainingScore / (baseScorePerNote / 2)),
      tolerableLost: finalMaxLost,
      canAchieve: true,
    }
  }

  return _calcPttNotAchieved(currentScore, currentPtt, targetPtt, targetScore, scoreGap, baseScorePerNote, params)
}

function _calcPttNotAchieved(
  currentScore: number,
  currentPtt: number,
  targetPtt: number,
  targetScore: number,
  scoreGap: number,
  baseScorePerNote: number,
  params: ToleranceParams
): PTTToleranceResult {
  const neededScore = -scoreGap
  const remainingNotes = params.notes - params.pure - params.far - params.lost
  const maxPossibleScore = currentScore + remainingNotes * baseScorePerNote

  if (maxPossibleScore < targetScore) {
    const theoreticalMaxScore = currentScore + remainingNotes * baseScorePerNote + remainingNotes
    const theoreticalMaxPtt = calculatePttFromScore(theoreticalMaxScore, params.constant)
    return {
      targetPtt,
      currentPtt,
      pttGap: currentPtt - targetPtt,
      theoreticalMaxScore,
      theoreticalMaxPtt,
      tolerableFar: params.far,
      tolerableLost: params.lost,
      canAchieve: false,
      remainingNotes,
    }
  }

  const neededPureCount = Math.ceil(neededScore / baseScorePerNote)
  const remainingAfterNeededPure = remainingNotes - neededPureCount
  return {
    targetPtt,
    currentPtt,
    pttGap: currentPtt - targetPtt,
    tolerableFar: params.far + remainingAfterNeededPure,
    tolerableLost: params.lost + Math.floor(remainingAfterNeededPure / 2),
    canAchieve: false,
  }
}

/**
 * 基于理论值的评级容错计算
 */
export function calculateTheoreticalRatingTolerance(
  notes: number,
  targetRating: RatingOption,
  displayMode: 'far' | 'lost'
): RatingToleranceFullResult {
  const baseScorePerNote = 10000000 / notes
  const theoreticalMaxScore = 10000000 + notes
  const targetScore = targetRating.minScore
  const scoreGap = theoreticalMaxScore - targetScore

  let maxFarCount = 0
  let maxLostCount = 0

  if (displayMode === 'far') {
    maxFarCount = Math.floor(scoreGap / (baseScorePerNote / 2))
  } else {
    maxLostCount = Math.floor(scoreGap / baseScorePerNote)
  }

  return {
    minScore: targetScore,
    maxScore: theoreticalMaxScore,
    maxFarCount,
    maxLostCount,
    currentScore: theoreticalMaxScore,
    canAchieve: true,
  }
}

/**
 * 基于理论值的分数容错计算
 */
export function calculateTheoreticalScoreTolerance(
  notes: number,
  target: number,
  displayMode: 'far' | 'lost'
): ScoreToleranceResult {
  const baseScorePerNote = 10000000 / notes
  const theoreticalMaxScore = 10000000 + notes
  const scoreGap = theoreticalMaxScore - target

  let tolerableFar = 0
  let tolerableLost = 0

  if (displayMode === 'far') {
    tolerableFar = Math.floor(scoreGap / (baseScorePerNote / 2))
  } else {
    tolerableLost = Math.floor(scoreGap / baseScorePerNote)
  }

  return {
    targetScore: target,
    currentScore: theoreticalMaxScore,
    scoreGap,
    tolerableFar,
    tolerableLost,
    canAchieve: true,
  }
}

/**
 * 基于理论值的PTT容错计算
 */
export function calculateTheoreticalPTTTolerance(
  notes: number,
  constant: number,
  targetPtt: number,
  displayMode: 'far' | 'lost'
): PTTToleranceResult {
  const baseScorePerNote = 10000000 / notes
  const theoreticalMaxScore = 10000000 + notes
  const currentPtt = constant + 2.0

  const targetScore = calculateScoreFromTargetPtt(targetPtt, constant)
  const scoreGap = theoreticalMaxScore - targetScore

  let tolerableFar = 0
  let tolerableLost = 0

  if (displayMode === 'far') {
    tolerableFar = Math.floor(scoreGap / (baseScorePerNote / 2))
  } else {
    tolerableLost = Math.floor(scoreGap / baseScorePerNote)
  }

  return {
    targetPtt,
    currentPtt,
    pttGap: currentPtt - targetPtt,
    tolerableFar,
    tolerableLost,
    canAchieve: true,
  }
}

/**
 * 基于理论值计算评级容错（兼容旧接口）
 * @param totalNotes 物量
 * @param rating 评级
 * @returns 容错结果
 */
export function calculateRatingToleranceFromTheoretical(
  totalNotes: number,
  rating: RatingOption
): RatingToleranceResult {
  const theoreticalValue = 10000000 + totalNotes
  const targetScore = rating.minScore
  const scoreGap = theoreticalValue - targetScore
  const scorePerNote = 10000000 / totalNotes
  const scorePerFar = 5000000 / totalNotes
  const maxFarCount = Math.floor(scoreGap / scorePerFar)
  const remainingScoreAfterFar = scoreGap - maxFarCount * scorePerFar
  const maxLostCount = Math.floor(remainingScoreAfterFar / scorePerNote)

  return {
    canAchieve: maxFarCount >= 0,
    maxFarCount: Math.max(0, maxFarCount),
    maxLostCount: Math.max(0, Math.floor(maxLostCount)),
  }
}

/**
 * 评级选项列表（Phase 3：由 constants 的 RATING_THRESHOLDS 单一来源派生）
 */
export const RATING_OPTIONS: RatingOption[] = RATING_THRESHOLDS.map(t => ({
  name: t.label,
  minScore: t.min
}))
