import { describe, expect, it } from 'vitest'
import {
  calculateTheoreticalPTTTolerance,
  calculatePTTTolerance,
  calculateScoreTolerance
} from './tolerance-calculator'

describe('tolerance-calculator（统一官方 PTT 公式后的行为）', () => {
  it('理论最优 PTT 容错：全 Pure 得分为 1000 万 + 物量，PTT = 定数 + 2', () => {
    const result = calculateTheoreticalPTTTolerance(1000, 10, 12, 'far')
    expect(result.currentPtt).toBe(12)
    expect(result.canAchieve).toBe(true)
  })

  it('当前判定 PTT 计算与主计算器一致（9.8M 档边界）', () => {
    // pure=980, far=0, lost=20, notes=1000 → 得分 9,800,000
    const result = calculateScoreTolerance(
      { notes: 1000, pure: 980, far: 0, lost: 20, bigPure: 0, constant: 10 },
      9800000
    )
    expect(result.currentScore).toBe(9800000)
    expect(result.canAchieve).toBe(true)
  })

  it('目标 PTT 低于定数时仍能正确给出分数缺口（回归：统一按 (score-9.5M)/300k 反推）', () => {
    // 9,500,000 分、定数 10 → PTT = 10.0；目标 9.5 需要 9,350,000，已达成
    const result = calculatePTTTolerance(
      { notes: 1000, pure: 950, far: 0, lost: 50, bigPure: 0, constant: 10 },
      9.5
    )
    expect(result.currentPtt).toBe(10)
    expect(result.canAchieve).toBe(true)
  })
})
