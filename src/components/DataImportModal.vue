<template>
  <view v-if="visible" class="import-modal-mask" @touchmove.stop.prevent>
    <view class="import-modal">
      <view class="import-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4a6cf7" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </view>
      <view class="import-title">{{ title }}</view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: progress + '%' }"></view>
      </view>
      <view class="progress-text">
        <text v-if="status === 'syncing'">正在导入歌曲数据... {{ progress }}%</text>
        <text v-else-if="status === 'success'">导入完成，共 {{ total }} 首歌曲</text>
        <text v-else-if="status === 'failed'" class="error-text">导入失败，请检查网络连接</text>
      </view>
      <view v-if="status === 'failed'" class="import-actions">
        <button class="btn-retry" @click="$emit('retry')">重试</button>
        <button class="btn-skip" @click="$emit('skip')">跳过</button>
      </view>
      <view v-if="status === 'success'" class="import-actions">
        <button class="btn-confirm" @click="$emit('confirm')">开始使用</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title: string
  status: string
  progress: number
  total: number
}>()
defineEmits<{
  retry: []
  skip: []
  confirm: []
}>()
</script>

<style scoped>
.import-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.import-modal {
  background: #1a1a2e;
  border-radius: 16px;
  padding: 32px 24px;
  width: 85%;
  max-width: 340px;
  text-align: center;
  color: #fff;
}
.import-icon {
  margin-bottom: 16px;
}
.import-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #e0e0e0;
}
.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4a6cf7, #6c5ce7);
  border-radius: 3px;
  transition: width 0.3s ease;
}
.progress-text {
  font-size: 13px;
  color: #a0a0b0;
  margin-bottom: 20px;
}
.error-text {
  color: #ff6b6b;
}
.import-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.btn-confirm {
  background: #4a6cf7;
  color: #fff;
  border: none;
  padding: 10px 32px;
  border-radius: 8px;
  font-size: 14px;
}
.btn-retry {
  background: #4a6cf7;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
}
.btn-skip {
  background: transparent;
  color: #a0a0b0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
}
</style>
