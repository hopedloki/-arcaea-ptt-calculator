<template>
  <DataImportModal
    :visible="importVisible"
    :title="importTitle"
    :status="importStatus"
    :progress="importProgress"
    :total="importTotal"
    @retry="onImportRetry"
    @skip="onImportSkip"
    @confirm="onImportConfirm"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { pttStore } from "./stores/pttStore";
import { migrateOldKeys } from "./services/storage";
import { syncService } from './services/sync-service'
import { initNetwork, isOnline } from './services/network'
import DataImportModal from './components/DataImportModal.vue'
import { OFFLINE_MODE } from './constants'

// pttStore is directly imported, no need to call usePttStore()

const importVisible = ref(false)
const importTitle = ref('')
const importStatus = ref('idle')
const importProgress = ref(0)
const importTotal = ref(0)

async function handleDataImport() {
  const localValid = syncService.checkLocalIntegrity()

  if (!localValid) {
    // 断网且无本地数据时，显示离线提示而非失败弹窗
    if (!isOnline.value) {
      importTitle.value = '需要网络初始化歌曲数据'
      importVisible.value = true
      importStatus.value = 'failed'
      return
    }

    importTitle.value = '首次初始化歌曲数据'
    importVisible.value = true
    importStatus.value = 'syncing'

    try {
      await syncService.fullImport((percent: number) => {
        importProgress.value = percent
      })
      importTotal.value = syncService.getState().totalSongs
      importStatus.value = 'success'
    } catch {
      importStatus.value = 'failed'
    }
  } else if (syncService.shouldSync('startup')) {
    // 断网时跳过后台同步，等网络恢复自动触发
    if (isOnline.value) {
      syncService.incrementalSync().catch(() => {})
    }
  }
}

function onImportRetry() {
  if (!isOnline.value) {
    uni.showToast({ title: '当前无网络连接', icon: 'none' })
    return
  }
  importStatus.value = 'syncing'
  syncService.fullImport((percent: number) => {
    importProgress.value = percent
  }).then(() => {
    importTotal.value = syncService.getState().totalSongs
    importStatus.value = 'success'
  }).catch(() => {
    importStatus.value = 'failed'
  })
}

function onImportSkip() {
  importVisible.value = false
}

function onImportConfirm() {
  importVisible.value = false
}

onLaunch(async () => {
  // #ifdef dev
  console.log("App Launch");
  // #endif

  // 初始化网络状态监听（必须在其他服务之前）
  initNetwork()

  migrateOldKeys();
  pttStore.initStore();

  // 离线版：歌曲数据由内置 JSON 提供，无需在线同步与云端功能
  if (OFFLINE_MODE) {
    return
  }

  syncService.init();
  handleDataImport();

  // 网络恢复时自动补偿：如果本地无数据则全量导入，否则增量同步
  // 使用 isSyncing 互斥锁，防止 60 秒内多次断网重连触发多次 fullImport
  let isSyncing = false
  uni.onNetworkStatusChange(async (res: { isConnected: boolean }) => {
    if (!res.isConnected || isSyncing) return
    isSyncing = true
    try {
      syncService.init()
      const localValid = syncService.checkLocalIntegrity()
      if (!localValid) {
        // 本地无数据，重新走全量导入流程
        importVisible.value = true
        importTitle.value = '首次初始化歌曲数据'
        importStatus.value = 'syncing'
        importProgress.value = 0
        try {
          await syncService.fullImport((percent: number) => {
            importProgress.value = percent
          })
          importTotal.value = syncService.getState().totalSongs
          importStatus.value = 'success'
        } catch {
          importStatus.value = 'failed'
        } finally {
          isSyncing = false
        }
      } else if (syncService.shouldSync('network')) {
        try {
          await syncService.incrementalSync()
        } catch {
          // 静默失败
        } finally {
          isSyncing = false
        }
      } else {
        isSyncing = false
      }
    } catch {
      isSyncing = false
    }
  })
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
