/*
 * 用户认证状态管理
 * 负责登录、注册、登出及 Token 持久化，所有鉴权请求统一通过此模块发送
 * 使用 Vue reactive 模式（避免引入 pinia 依赖，兼容 Uni-app 构建系统）
 */

import { reactive } from 'vue'
import { getStorage, setStorage, removeStorage, getEncryptedToken, setEncryptedToken } from '../services/storage'
import { request } from '../services/request'
import { showError } from '../services/toast'
import { STORAGE_KEYS } from '../constants'
import { API } from '../constants/api'

export interface AuthState {
  token: string
  userId: string
  username: string
  nickname: string
  role: string
  isLoggedIn: boolean
}

function loadState(): AuthState {
  try {
    const token = getEncryptedToken()
    const userId = getStorage(STORAGE_KEYS.USER_ID, '')
    const username = getStorage(STORAGE_KEYS.USERNAME, '')
    const nickname = getStorage(STORAGE_KEYS.NICKNAME, '')
    const role = getStorage(STORAGE_KEYS.ROLE, '')
    return {
      token,
      userId,
      username,
      nickname,
      role,
      isLoggedIn: !!token
    }
  } catch {
    return { token: '', userId: '', username: '', nickname: '', role: '', isLoggedIn: false }
  }
}

function saveState(state: AuthState) {
  setEncryptedToken(state.token)
  setStorage(STORAGE_KEYS.USER_ID, state.userId)
  setStorage(STORAGE_KEYS.USERNAME, state.username)
  setStorage(STORAGE_KEYS.NICKNAME, state.nickname)
  setStorage(STORAGE_KEYS.ROLE, state.role)
}

function clearState() {
  removeStorage(STORAGE_KEYS.TOKEN)
  removeStorage(STORAGE_KEYS.USER_ID)
  removeStorage(STORAGE_KEYS.USERNAME)
  removeStorage(STORAGE_KEYS.NICKNAME)
  removeStorage(STORAGE_KEYS.ROLE)
}

const state = reactive<AuthState>(loadState())

async function login(username: string, password: string) {
  try {
    const data = await request(API.USER.LOGIN, 'POST', { username, password }, { showError: false })
    if (data.role !== 'user') {
      showError('管理员账号请使用管理后台登录')
      return { code: 403, msg: '管理员账号请使用管理后台登录' }
    }
    state.token = data.token
    state.userId = String(data.userId)
    state.username = data.username
    state.nickname = data.nickname
    state.role = data.role
    state.isLoggedIn = true
    saveState(state)
    import('../services/sync-service').then(({ syncService }) => {
      if (syncService.shouldSync('login')) {
        syncService.incrementalSync().catch(() => {})
      }
    })
    return { code: 200, msg: 'success', data }
  } catch (e: any) {
    return { code: e.code || 500, msg: e.msg || '登录失败' }
  }
}

async function register(username: string, password: string, nickname: string) {
  try {
    const data = await request(API.USER.REGISTER, 'POST', {
      username,
      password,
      nickname,
      role: 'user'
    })
    return { code: 200, msg: 'success', data }
  } catch (e: any) {
    return { code: e.code || 500, msg: e.msg || '注册失败' }
  }
}

function logout() {
  state.token = ''
  state.userId = ''
  state.username = ''
  state.nickname = ''
  state.role = ''
  state.isLoggedIn = false
  clearState()
}

export const authStore = {
  state,
  login,
  register,
  logout,
  request
}
