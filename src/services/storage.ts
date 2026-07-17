import { STORAGE_KEYS } from '../constants'

const ENCRYPT_KEY = 'arcaea_ptt_calc_key'

const encrypt = (text: string, key: string) => {
  return text.split('').map((c, i) =>
    String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  ).join('')
}

const decrypt = (text: string, key: string) => {
  return encrypt(text, key)
}

interface TokenData {
  token: string
  expiresAt: number
}

export function setEncryptedToken(token: string, expiresIn: number = 86400000): void {
  const data: TokenData = {
    token: encrypt(token, ENCRYPT_KEY),
    expiresAt: Date.now() + expiresIn
  }
  try {
    uni.setStorageSync(STORAGE_KEYS.TOKEN, JSON.stringify(data))
  } catch (e) {
    // #ifdef dev
    console.error('Token storage error:', e)
    // #endif
  }
}

export function getEncryptedToken(): string {
  try {
    const value = uni.getStorageSync(STORAGE_KEYS.TOKEN)
    if (!value) return ''
    
    let data: TokenData
    try {
      data = JSON.parse(value)
    } catch {
      return ''
    }
    
    if (data.expiresAt && Date.now() > data.expiresAt) {
      uni.removeStorageSync(STORAGE_KEYS.TOKEN)
      return ''
    }
    
    return data.token ? decrypt(data.token, ENCRYPT_KEY) : ''
  } catch {
    return ''
  }
}

export function getStorage<T = any>(key: string, defaultValue: T = null as any): T {
  try {
    const value = uni.getStorageSync(key)
    if (value === '' || value === undefined || value === null) return defaultValue
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  } catch {
    return defaultValue
  }
}

export function setStorage(key: string, value: any): void {
  try {
    const val = typeof value === 'object' ? JSON.stringify(value) : String(value)
    uni.setStorageSync(key, val)
  } catch (e) {
    // #ifdef dev
    console.error('Storage set error:', key, e)
    // #endif
  }
}

export function removeStorage(key: string): void {
  try {
    uni.removeStorageSync(key)
  } catch (e) {
    // #ifdef dev
    console.error('Storage remove error:', key, e)
    // #endif
  }
}

/** 清除双写旧 Key，统一用 STORAGE_KEYS 中的新 Key */
export function migrateOldKeys(): void {
  const oldKeys = ['best30_records', 'ptt_data', 'recent_scores', 'recent_song']
  const newKeys = [STORAGE_KEYS.BEST30_RECORDS, STORAGE_KEYS.PTT_DATA, STORAGE_KEYS.RECENT_SCORES, STORAGE_KEYS.RECENT_SONG]
  
  oldKeys.forEach((oldKey, index) => {
    try {
      const data = uni.getStorageSync(oldKey)
      if (data) {
        setStorage(newKeys[index], data)
        uni.removeStorageSync(oldKey)
      }
    } catch (e) { /* ignore */ }
  })
}
