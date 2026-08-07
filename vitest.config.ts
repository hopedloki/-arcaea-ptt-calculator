import { defineConfig } from 'vitest/config'

// 独立的 Vitest 配置：仅测试纯计算逻辑，不加载 uni-app 插件
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
})
