<template>
  <view class="icp-container">
    <text class="icp-label">粤ICP备</text>
    <text class="icp-number" @click="openBeian">2026074364</text>
    <text class="icp-label">号</text>
    <text class="icp-separator">|</text>
    <image
      class="gongan-icon"
      src="https://www.beian.gov.cn/img/ghs.png"
      mode="aspectFit"
    />
    <text class="icp-number" @click="openGongan">粤公网安备44180302000265号</text>
  </view>
</template>

<script setup lang="ts">
/*
 * 组件名称: icp-info
 * 功能描述: 展示ICP备案号并提供跳转至工信部备案查询系统
 * 适用场景: 页面底部版权区域，满足ICP备案展示合规要求
 */

// 跳转至工信部备案查询官网
const openBeian = () => {
  // #ifdef H5
  window.open('https://beian.miit.gov.cn/', '_blank')
  // #endif
  // #ifndef H5
  uni.setClipboardData({
    data: 'https://beian.miit.gov.cn/',
    success: () => {
      uni.showToast({
        title: '已复制备案查询链接',
        icon: 'none'
      })
    }
  })
  // #endif
}

// 跳转至全国互联网安全管理服务平台
const openGongan = () => {
  // #ifdef H5
  window.open('http://www.beian.gov.cn/', '_blank')
  // #endif
  // #ifndef H5
  uni.setClipboardData({
    data: 'http://www.beian.gov.cn/',
    success: () => {
      uni.showToast({
        title: '已复制公安备案查询链接',
        icon: 'none'
      })
    }
  })
  // #endif
}
</script>

<style lang="scss" scoped>
.icp-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24rpx 0;
  margin-top: 20rpx;
}

.icp-label {
  font-size: 22rpx;
  color: #999;
  line-height: 1.5;
}

.icp-number {
  font-size: 22rpx;
  color: #007aff;
  line-height: 1.5;
  text-decoration: underline;
  margin: 0 4rpx;
  
  &:active {
    opacity: 0.7;
    color: #0056cc;
  }
}

.icp-separator {
  font-size: 22rpx;
  color: #999;
  margin: 0 12rpx;
}

.gongan-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 6rpx;
}
</style>
