import { DIFFICULTY_TEXT, DIFFICULTY_CLASS, RATING_CLASS, RATING_THRESHOLDS, MAX_PTT } from '../constants'

export function getDifficultyText(code: string): string {
  return DIFFICULTY_TEXT[code] || code
}

export function getDifficultyClass(code: string): string {
  return DIFFICULTY_CLASS[code] || 'difficulty-default'
}

export function getRating(score: number): string {
  for (const { label, min } of RATING_THRESHOLDS) {
    if (score >= min) return label
  }
  return 'D'
}

export function getRatingClass(rating: string): string {
  return RATING_CLASS[rating] || ''
}

export function getPTTProgress(ptt: number): number {
  return Math.min((ptt / MAX_PTT) * 100, 100)
}

export function getPTTProgressText(ptt: number): string {
  return getPTTProgress(ptt).toFixed(1) + '%'
}

export function getMaxPtt(): number {
  return MAX_PTT
}
