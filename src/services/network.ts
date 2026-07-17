/**
 * 全局网络状态模块
 * 提供响应式网络状态，供所有页面绑定按钮 disabled 状态
 */
import { ref } from 'vue'

export const isOnline = ref(true)
export const networkType = ref<string>('unknown')

let initialized = false

export function initNetwork() {
  if (initialized) return
  initialized = true

  // 初始查询网络状态
  uni.getNetworkType({
    success(res) {
      isOnline.value = res.networkType !== 'none'
      networkType.value = res.networkType
    }
  })

  // 监听网络变化
  uni.onNetworkStatusChange((res: any) => {
    isOnline.value = res.isConnected
    networkType.value = res.networkType
  })
}

/**
 * 同步检查网络状态（供 request.ts 使用，不依赖响应式）
 */
export function checkNetworkSync(): boolean {
  return isOnline.value
}
