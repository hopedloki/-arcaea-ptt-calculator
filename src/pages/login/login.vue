<template>
  <view class="container">
    <view class="header">
      <text class="title">Arcaea PTT计算器</text>
      <text class="subtitle">登录你的账号，管理成绩数据</text>
    </view>

    <view class="card form-card">
      <view class="form-group">
        <text class="label">账号</text>
        <input
          class="input"
          v-model="form.username"
          placeholder="请输入账号"
          placeholder-class="placeholder"
          maxlength="20"
        />
      </view>

      <view class="form-group">
        <text class="label">密码</text>
        <input
          class="input"
          v-model="form.password"
          :password="!showPassword"
          placeholder="请输入密码"
          placeholder-class="placeholder"
          maxlength="30"
        />
        <view class="toggle-pwd" @click="showPassword = !showPassword">
          <!-- 眼睛图标：可见 / 不可见 -->
          <view class="eye-icon" v-if="showPassword">
            <view class="eye-open">
              <view class="eye-outer"></view>
              <view class="eye-inner"></view>
            </view>
          </view>
          <view class="eye-icon" v-else>
            <view class="eye-closed">
              <view class="eye-outer"></view>
              <view class="eye-slash"></view>
            </view>
          </view>
        </view>
      </view>

      <button class="btn btn-primary" :disabled="loading" @click="handleLogin">
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <view class="link-row">
        <text class="link-text">还没有账号？</text>
        <text class="link" @click="goRegister">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 登录页面
 * 提供用户名密码登录表单，成功后自动跳转主页
 * 依赖 authStore 进行登录请求和状态管理
 */
import { ref, reactive } from 'vue'
import { authStore } from '@/stores/authStore'
import { showSuccess, showError, showLoading, hideLoading } from '../../services/toast'
import { isOnline } from '../../services/network'

// authStore is directly imported

// 登录表单数据（使用 reactive 实现双向绑定）
const form = reactive({
  username: '',
  password: ''
})

// 密码可见性切换
const showPassword = ref(false)
// 登录请求加载状态
const loading = ref(false)

// 登录提交 — 校验表单后调用 authStore.login，成功后跳转到主页
const handleLogin = async () => {
  if (!isOnline.value) {
    showError('当前无网络连接')
    return
  }
  if (!form.username.trim()) {
    showError('请输入账号')
    return
  }
  if (!form.password) {
    showError('请输入密码')
    return
  }
  if (form.password.length < 6) {
    showError('密码至少6位')
    return
  }
  if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(form.password)) {
    showError('密码需包含字母和数字')
    return
  }

  loading.value = true
  showLoading('登录中...')

  try {
    const res = await authStore.login(form.username, form.password)
    hideLoading()
    if (res.code === 200) {
      showSuccess('登录成功')
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/index/index' })
      }, 800)
    } else if (res.code === 403) {
      showError(res.msg || '无权限登录')
    } else {
      showError(res.msg || '登录失败')
    }
  } catch (e) {
    hideLoading()
    showError('网络异常，请检查连接')
  } finally {
    loading.value = false
  }
}

const goRegister = () => {
  uni.navigateTo({ url: '/pages/register/register' })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%);
  padding: 80rpx 40rpx 0;
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
}

.title {
  display: block;
  font-size: 44rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 16rpx;
}

.subtitle {
  display: block;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.form-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
}

.form-group {
  margin-bottom: 36rpx;
  position: relative;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.input {
  width: 100%;
  height: 88rpx;
  background: #f7f8fa;
  border: 2rpx solid #e8e8e8;
  border-radius: 16rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  color: #333;
}

.placeholder {
  color: #bbb;
}

.toggle-pwd {
  position: absolute;
  right: 24rpx;
  bottom: 20rpx;
  cursor: pointer;
}

/* 眼睛图标 */
.eye-icon {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-open {
  width: 40rpx;
  height: 28rpx;
  position: relative;
}

.eye-open .eye-outer {
  width: 40rpx;
  height: 28rpx;
  border: 3rpx solid #999;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
}

.eye-open .eye-inner {
  width: 10rpx;
  height: 10rpx;
  background: #666;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.eye-closed {
  width: 40rpx;
  height: 28rpx;
  position: relative;
}

.eye-closed .eye-outer {
  width: 40rpx;
  height: 28rpx;
  border: 3rpx solid #999;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
}

.eye-closed .eye-slash {
  width: 46rpx;
  height: 3rpx;
  background: #999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
}

.btn {
  width: 100%;
  height: 88rpx;
  border-radius: 16rpx;
  font-size: 32rpx;
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff;
}

.link-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40rpx;
}

.link-text {
  font-size: 26rpx;
  color: #999;
}

.link {
  font-size: 26rpx;
  color: #4f46e5;
  margin-left: 8rpx;
}
</style>
