import { describe, expect, it } from 'vitest'
import { calculatePtt, calculateScore, getMinScoreByRating } from './ptt-calculator'

describe('calculatePtt（官方公式）', () => {
  it('满分返回定数 + 2', () => {
    expect(calculatePtt(10000000, 10)).toBe(12)
  })

  it('9,800,000 ~ 9,999,999 档：+1.0 + (score-9.8M)/200k', () => {
    expect(calculatePtt(9800000, 10)).toBe(11)
    expect(calculatePtt(9900000, 10)).toBe(11.5)
  })

  it('9,500,000 ~ 9,799,999 档：定数 + (score-9.5M)/300k', () => {
    expect(calculatePtt(9500000, 10)).toBe(10)
    expect(calculatePtt(9650000, 10)).toBe(10.5)
  })

  it('9,000,000 ~ 9,499,999 档：与 9.5M 以下共用同一线性公式', () => {
    expect(calculatePtt(9250000, 10)).toBeCloseTo(9.1667, 4)
    expect(calculatePtt(9000000, 10)).toBeCloseTo(8.3333, 4)
  })

  it('低于 9,500,000 继续线性下探，下限截断为 0', () => {
    // 9.2M → 定数−1，8.9M → 定数−2，8.6M → 定数−3
    expect(calculatePtt(9200000, 10)).toBe(9)
    expect(calculatePtt(8900000, 10)).toBe(8)
    expect(calculatePtt(8600000, 10)).toBe(7)
    expect(calculatePtt(4500000, 10)).toBe(0)
    expect(calculatePtt(0, 10)).toBe(0)
  })
})

describe('calculateScore（PTT 反推分数，与 calculatePtt 互为逆运算）', () => {
  it('目标高于定数 +2 时返回满分', () => {
    expect(calculateScore(12.5, 10)).toBe(10000000)
  })

  it('10M 档边界', () => {
    expect(calculateScore(12, 10)).toBe(10000000)
  })

  it('9.8M ~ 10M 档', () => {
    expect(calculateScore(11.5, 10)).toBe(9900000)
    expect(calculateScore(11, 10)).toBe(9800000)
  })

  it('9.5M ~ 9.8M 档', () => {
    expect(calculateScore(10, 10)).toBe(9500000)
  })

  it('9.0M ~ 9.5M 档（修复：与 <9.8M 统一使用 300k 系数反推）', () => {
    expect(calculateScore(9.5, 10)).toBe(9350000)
    expect(calculateScore(9, 10)).toBe(9200000)
  })

  it('低于 9.0M 档（同一公式继续下探，保持与 calculatePtt 自洽）', () => {
    expect(calculateScore(8, 10)).toBe(8900000)
    const score = calculateScore(8.5, 10)
    expect(score).toBe(9050000)
    expect(calculatePtt(score, 10)).toBe(8.5)
  })

  it('目标 PTT 很低时仍按公式反推（PTT 下限 0 由 calculatePtt 截断）', () => {
    expect(calculateScore(0, 10)).toBe(6500000)
    expect(calculateScore(1, 2)).toBe(9200000)
    expect(calculatePtt(calculateScore(0, 10), 10)).toBe(0)
    expect(calculatePtt(calculateScore(1, 2), 2)).toBe(1)
  })

  it('PTT 反推与正算自洽（官方公式锚点）', () => {
    for (const target of [0, 1, 3, 5, 8, 9, 9.5, 10, 11, 11.5, 12]) {
      const score = calculateScore(target, 10)
      expect(calculatePtt(score, 10)).toBeCloseTo(target, 4)
    }
  })
})

describe('getMinScoreByRating（评级最低分数，官方阈值）', () => {
  it('各评级最低分', () => {
    expect(getMinScoreByRating('PM')).toBe(10000000)
    expect(getMinScoreByRating('EX+')).toBe(9900000)
    expect(getMinScoreByRating('EX')).toBe(9800000)
    expect(getMinScoreByRating('AA')).toBe(9500000)
    expect(getMinScoreByRating('A')).toBe(9200000)
    expect(getMinScoreByRating('B')).toBe(8900000)
    expect(getMinScoreByRating('C')).toBe(8600000)
    expect(getMinScoreByRating('D')).toBe(0)
  })
})
