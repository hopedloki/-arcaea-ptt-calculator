import { describe, expect, it } from 'vitest'
import { getRating } from './helpers'
import { RATING_OPTIONS } from './tolerance-calculator'

describe('getRating（评级阈值，官方口径）', () => {
  it('各阈值边界', () => {
    expect(getRating(10000000)).toBe('PM')
    expect(getRating(9999999)).toBe('EX+')
    expect(getRating(9900000)).toBe('EX+')
    expect(getRating(9899999)).toBe('EX')
    expect(getRating(9800000)).toBe('EX')
    expect(getRating(9799999)).toBe('AA')
    expect(getRating(9500000)).toBe('AA')
    expect(getRating(9499999)).toBe('A')
    expect(getRating(9200000)).toBe('A')
    expect(getRating(9199999)).toBe('B')
    expect(getRating(8900000)).toBe('B')
    expect(getRating(8899999)).toBe('C')
    expect(getRating(8600000)).toBe('C')
    expect(getRating(8599999)).toBe('D')
    expect(getRating(0)).toBe('D')
  })
})

describe('RATING_OPTIONS（容错计算评级选项，与官方阈值一致）', () => {
  it('包含全部评级且阈值正确', () => {
    const map = Object.fromEntries(RATING_OPTIONS.map(r => [r.name, r.minScore]))
    expect(map).toEqual({
      PM: 10000000,
      'EX+': 9900000,
      EX: 9800000,
      AA: 9500000,
      A: 9200000,
      B: 8900000,
      C: 8600000,
      D: 0
    })
  })
})
