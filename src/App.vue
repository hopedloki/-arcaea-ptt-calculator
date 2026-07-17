<template>
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { pttStore } from "./stores/pttStore";
import { migrateOldKeys } from "./services/storage";
import { initNetwork } from './services/network'

// pttStore is directly imported, no need to call usePttStore()

onLaunch(async () => {
  // #ifdef dev
  console.log("App Launch");
  // #endif

  // 初始化网络状态监听
  initNetwork()

  migrateOldKeys();
  pttStore.initStore();
  
  // 独立版：歌曲数据由本地 JSON 文件提供，无需后端同步
});

onShow(() => {
  // #ifdef dev
  console.log("App Show");
  // #endif
});

onHide(() => {
  // #ifdef dev
  console.log("App Hide");
  // #endif
});
</script>

<style>
/* 全局样式 */
@import './styles/ratings.scss';
@import './styles/difficulties.scss';

page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 通用按钮样式 */
.btn {
  border-radius: 12rpx;
  font-size: 28rpx;
  padding: 20rpx 40rpx;
  border: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #007aff;
  color: white;
}

.btn-primary:active {
  background-color: #0056cc;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:active {
  background-color: #e0e0e0;
}

.btn:disabled {
  opacity: 0.5;
}

/* 通用卡片样式 */
.card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

/* 通用输入框样式 */
.input {
  padding: 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 12rpx;
  font-size: 28rpx;
  background-color: white;
}

.input:focus {
  border-color: #007aff;
}
</style>
