import { getEncryptedToken, removeStorage } from './storage'
import { STORAGE_KEYS } from '../constants'
import { showError } from './toast'
import { checkNetworkSync } from './network'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const TIMEOUT = 15000

if (import.meta.env.PROD && !BASE_URL) {
  // #ifdef dev
  console.error('[Security] VITE_API_BASE_URL is not configured in production environment')
  // #endif
}

interface RequestOptions {
  showError?: boolean
}

function getToken(): string {
  return getEncryptedToken()
}

export function request<T = any>(url: string, method: 'GET' | 'POST' = 'GET', data?: any, options: RequestOptions = {}): Promise<T> {
  const { showError: shouldShowError = true } = options

  // 前置网络检查，断网时立即 reject，避免等待 15 秒超时
  if (!checkNetworkSync()) {
    if (shouldShowError) showError('当前无网络连接')
    return Promise.reject({ code: -1, msg: '无网络连接' })
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      timeout: TIMEOUT,
      header: {
        'Content-Type': 'application/json',
        ...(getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {})
      },
      success(res: any) {
        const { statusCode, data: resData } = res
        if (statusCode === 200) {
          const { code, msg, data: innerData } = resData || {}
          if (code === 200) {
            resolve(innerData)
          } else {
            if (shouldShowError) showError(msg || '操作失败')
            reject({ code, msg, data: innerData })
          }
        } else if (statusCode === 401) {
          removeStorage(STORAGE_KEYS.TOKEN)
          if (shouldShowError) showError('登录已失效，请重新登录')
          reject({ code: 401, msg: '未授权' })
        } else {
          // 提取服务端返回的真实错误消息，避免丢弃 resData.msg
          const errorMsg = (resData && resData.msg) ? resData.msg : '请求失败'
          if (shouldShowError) {
            uni.hideLoading()
            showError(errorMsg)
          }
          reject({ code: (resData && resData.code) || statusCode, msg: errorMsg })
        }
      },
      fail(err: any) {
        if (shouldShowError) showError('网络异常，请检查网络连接')
        reject(err)
      }
    })
  })
}
