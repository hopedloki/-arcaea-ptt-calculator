<template>
  <view class="container">
    <!-- 应用信息 -->
    <view class="card app-info-card">
      <view class="app-icon">
        <image class="icon" src="/static/logo.png" mode="aspectFit" />
      </view>
      <text class="app-name">Arcaea PTT计算器</text>
      <text class="app-version">版本 1.9.0</text>
      <text class="app-desc">专为Arcaea玩家设计的PTT计算和管理工具</text>
    </view>

    <!-- 功能介绍 -->
    <view class="card features-card">
      <view class="card-header">
        <text class="card-title">主要功能</text>
      </view>
      <view class="features-list">
        <view class="feature-item">
          <text class="feature-icon">🧮</text>
          <text class="feature-text">成绩与PTT双向转换计算</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">⚖️</text>
          <text class="feature-text">评级容错和分数容错计算</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">📋</text>
          <text class="feature-text">B30成绩管理和统计</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">🎵</text>
          <text class="feature-text">内置完整歌曲数据库</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">📊</text>
          <text class="feature-text">PTT概览和数据统计</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">💾</text>
          <text class="feature-text">数据导入导出和备份</text>
        </view>
      </view>
    </view>

    <!-- PTT计算公式 -->
    <view class="card formula-card">
      <view class="card-header">
        <text class="card-title">PTT计算公式</text>
      </view>
      <view class="formula-list">
        <view class="formula-item">
          <text class="formula-condition">≥10,000,000分</text>
          <text class="formula-result">定数 + 2.0</text>
        </view>
        <view class="formula-item">
          <text class="formula-condition">9,900,000-9,999,999分</text>
          <text class="formula-result">定数 + 1.5 + (得分-9,900,000)/100,000</text>
        </view>
        <view class="formula-item">
          <text class="formula-condition">9,800,000-9,899,999分</text>
          <text class="formula-result">定数 + 1.0 + (得分-9,800,000)/400,000</text>
        </view>
        <view class="formula-item">
          <text class="formula-condition">≤9,800,000分</text>
          <text class="formula-result">定数 + (得分-9,500,000)/300,000</text>
        </view>
      </view>
    </view>

    <!-- 开发信息 -->
    <view class="card dev-info-card">
      <view class="card-header">
        <text class="card-title">开发信息</text>
      </view>
      <view class="info-list">
        <view class="info-item">
          <text class="info-label">开发框架</text>
          <text class="info-value">UniApp</text>
        </view>
        <view class="info-item">
          <text class="info-label">原项目</text>
          <text class="info-value" @click="openOriginalRepo">hopedloki/-arcaea-ptt-calculator</text>
        </view>
        <view class="info-item">
          <text class="info-label">重构日期</text>
          <text class="info-value">2025-12-14</text>
        </view>
        <view class="info-item">
          <text class="info-label">许可证</text>
          <text class="info-value">MIT</text>
        </view>
      </view>
    </view>

    <!-- Web版引导 -->
    <view class="card web-card">
      <view class="card-header">
        <text class="card-title">Web版</text>
      </view>
      <view class="web-content">
        <text class="web-desc">需要云端同步、数据备份、跨设备访问等完整功能？</text>
        <view class="web-features">
          <view class="web-feature-item">
            <text class="web-feature-icon">☁️</text>
            <text class="web-feature-text">云端成绩同步</text>
          </view>
          <view class="web-feature-item">
            <text class="web-feature-icon">💾</text>
            <text class="web-feature-text">数据云端备份</text>
          </view>
          <view class="web-feature-item">
            <text class="web-feature-icon">📱</text>
            <text class="web-feature-text">跨设备访问</text>
          </view>
          <view class="web-feature-item">
            <text class="web-feature-icon">📈</text>
            <text class="web-feature-text">PTT历史记录</text>
          </view>
        </view>
        <button class="web-btn" @click="openWebVersion">访问 Web 版</button>
      </view>
    </view>

    <!-- 致谢 -->
    <view class="card thanks-card">
      <view class="card-header">
        <text class="card-title">致谢</text>
      </view>
      <view class="thanks-content">
        <text class="thanks-text">感谢以下项目和贡献者：</text>
        <view class="thanks-list">
          <text class="thanks-item">• 原版Arcaea PTT计算器的开发者hopedloki</text>
          <text class="thanks-item">• Arcaea游戏官方团队</text>
          <text class="thanks-item">• UniApp开发团队</text>
          <text class="thanks-item">• 所有使用和反馈本应用的用户</text>
        </view>
      </view>
    </view>

    <!-- 反馈和建议 -->
    <view class="card feedback-card">
      <view class="card-header">
        <text class="card-title">反馈和建议</text>
      </view>
      <view class="feedback-content">
        <text class="feedback-text">如果您有任何问题、建议或发现错误，欢迎通过以下方式反馈：</text>
        <view class="feedback-actions">
          <button class="feedback-btn" @click="openGitHub">GitHub Issues</button>
          <button class="feedback-btn" @click="copyEmail">复制邮箱</button>
        </view>
      </view>
    </view>

    <!-- 版权信息 -->
    <view class="footer">
      <text class="copyright">© 2025 Arcaea PTT计算器</text>
      <text class="disclaimer">本应用非官方，与Arcaea游戏开发商无关联</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 关于页面
 * 展示应用信息、主要功能、PTT计算公式、开发信息和反馈渠道
 * 用于向用户介绍应用的完整功能和参数
 */

// 打开原始项目仓库 — H5端直接新标签页打开，非H5端复制链接到剪贴板
const openOriginalRepo = () => {
  // #ifdef H5
  window.open('https://github.com/hopedloki/-arcaea-ptt-calculator', '_blank')
  // #endif
  
  // #ifndef H5
  uni.setClipboardData({
    data: 'https://github.com/hopedloki/-arcaea-ptt-calculator',
    success: () => {
      uni.showToast({
        title: '链接已复制到剪贴板',
        icon: 'success'
      })
    }
  })
  // #endif
}

// 打开GitHub Issues — 弹窗提示并复制Issue链接到剪贴板
const openGitHub = () => {
  uni.showModal({
    title: '提示',
    content: '请访问GitHub仓库提交Issue：\nhttps://github.com/hopedloki/-arcaea-ptt-calculator/issues',
    confirmText: '复制链接',
    success: (res) => {
      if (res.confirm) {
        uni.setClipboardData({
          data: 'https://github.com/hopedloki/-arcaea-ptt-calculator/issues',
          success: () => {
            uni.showToast({
              title: '链接已复制',
              icon: 'success'
            })
          }
        })
      }
    }
  })
}

// 打开 Web 版 — H5 端新标签页打开，非 H5 端复制链接
const openWebVersion = () => {
  // #ifdef H5
  window.open('https://hopeddev.online', '_blank')
  // #endif
  
  // #ifndef H5
  uni.setClipboardData({
    data: 'https://hopeddev.online',
    success: () => {
      uni.showToast({
        title: '链接已复制，请在浏览器中打开',
        icon: 'success'
      })
    }
  })
  // #endif
}

// 复制联系邮箱到剪贴板
const copyEmail = () => {
  uni.setClipboardData({
    data: 'example@example.com',
    success: () => {
      uni.showToast({
        title: '邮箱已复制',
        icon: 'success'
      })
    }
  })
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 24rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.app-info-card {
  text-align: center;
  padding-bottom: 40rpx;
}

.app-icon {
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto 20rpx;
  border-radius: 30rpx;
  overflow: hidden;
}

.icon {
  width: 100%;
  height: 100%;
}

.app-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.app-version {
  font-size: 26rpx;
  color: #667eea;
  display: block;
  margin-bottom: 16rpx;
}

.app-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  padding: 0 20rpx;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 20rpx;
}

.feature-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.feature-text {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.formula-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.formula-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #eee;
}

.formula-condition {
  font-size: 26rpx;
  color: #666;
  flex: 1;
}

.formula-result {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  flex: 2;
  text-align: right;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #eee;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  width: 150rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  text-align: right;
  flex: 1;
}

.info-value[style*="color"] {
  color: #667eea;
}

.thanks-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.thanks-text {
  display: block;
  margin-bottom: 16rpx;
}

.thanks-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding-left: 20rpx;
}

.thanks-item {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.feedback-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.feedback-text {
  display: block;
  margin-bottom: 20rpx;
}

.feedback-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.feedback-btn {
  flex: 1;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 40rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.footer {
  text-align: center;
  padding: 40rpx 0;
}

.copyright {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}

.disclaimer {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.web-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 2rpx solid rgba(102, 126, 234, 0.2);
}

.web-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.web-desc {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  font-weight: 500;
}

.web-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.web-feature-item {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12rpx;
  padding: 16rpx;
  gap: 12rpx;
}

.web-feature-icon {
  font-size: 28rpx;
}

.web-feature-text {
  font-size: 24rpx;
  color: #555;
}

.web-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 40rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin-top: 8rpx;
}
</style>