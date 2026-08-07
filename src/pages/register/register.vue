<template>
  <view class="container">
    <view class="header">
      <text class="title">创建账号</text>
      <text class="subtitle">注册后即可管理你的成绩数据</text>
    </view>

    <view class="card form-card">
      <view class="form-group">
        <text class="label">账号</text>
        <input
          class="input"
          v-model="form.username"
          placeholder="3-20位字母或数字"
          placeholder-class="placeholder"
          maxlength="20"
        />
      </view>

      <view class="form-group">
        <text class="label">昵称</text>
        <input
          class="input"
          v-model="form.nickname"
          placeholder="2-20个字符"
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
          placeholder="至少6位，含字母和数字"
          placeholder-class="placeholder"
          maxlength="30"
        />
        <view class="toggle-pwd" @click="showPassword = !showPassword">
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

      <view class="form-group">
        <text class="label">确认密码</text>
        <input
          class="input"
          v-model="form.confirmPassword"
          :password="!showConfirm"
          placeholder="请再次输入密码"
          placeholder-class="placeholder"
          maxlength="30"
        />
        <view class="toggle-pwd" @click="showConfirm = !showConfirm">
          <view class="eye-icon" v-if="showConfirm">
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

      <button class="btn btn-primary" :disabled="loading" @click="handleRegister">
        {{ loading ? '注册中...' : '注册' }}
      </button>

      <view class="link-row">
        <text class="link-text">已有账号？</text>
        <text class="link" @click="goLogin">立即登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 注册页面
 * 提供账号、昵称、密码注册表单，含客户端格式校验
 * 注册成功后自动返回登录页
 * 依赖 authStore 进行注册请求
 */
import { ref, reactive } from 'vue'
import { authStore } from '@/stores/authStore'
import { showSuccess, showError, showLoading, hideLoading } from '../../services/toast'
import { isOnline } from '../../services/network'

// authStore is directly imported

// 注册表单数据
const form = reactive({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

// 密码/确认密码可见性切换
const showPassword = ref(false)
const showConfirm = ref(false)
// 注册请求加载状态
const loading = ref(false)

// 客户端表单校验 — 返回错误信息字符串，校验通过返回 null
const validate = (): string | null => {
  if (!form.username.trim()) return '请输入账号'
  if (!/^[a-zA-Z0-9]{3,20}$/.test(form.username)) return '账号需为3-20位字母或数字'
  if (!form.nickname.trim()) return '请输入昵称'
  if (form.nickname.length < 2 || form.nickname.length > 20) return '昵称长度为2-20个字符'
  if (!form.password) return '请输入密码'
  if (form.password.length < 6) return '密码至少6位'
  if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(form.password)) return '密码需包含字母和数字'
  if (form.password !== form.confirmPassword) return '两次密码输入不一致'
  return null
}

const handleRegister = async () => {
  if (!isOnline.value) {
    showError('当前无网络连接')
    return
  }
  const error = validate()
  if (error) {
    showError(error)
    return
  }

  loading.value = true
  showLoading('注册中...')

  try {
    const res = await authStore.register(form.username, form.password, form.nickname)
    hideLoading()
    if (res.code === 200) {
      showSuccess('注册成功，请登录')
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    } else {
      showError(res.msg || '注册失败')
    }
  } catch (e) {
    hideLoading()
    showError('网络异常，请检查连接')
  } finally {
    loading.value = false
  }
}

const goLogin = () => {
  uni.navigateBack()
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
  margin-bottom: 32rpx;
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
