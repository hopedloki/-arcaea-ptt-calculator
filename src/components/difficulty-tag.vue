<template>
  <view class="difficulty-tag" :class="difficultyClass">
    <text class="difficulty-text">{{ difficultyText }}</text>
    <text class="difficulty-constant" v-if="showConstant && constant">{{ constant }}</text>
  </view>
</template>

<script setup lang="ts">
/*
 * 组件名称: difficulty-tag
 * 功能描述: 展示Arcaea难度标签（PAST/PRESENT/FUTURE/BEYOND/ETERNAL），可选显示定数
 * 适用场景: 成绩列表、歌曲信息中展示难度标识
 */

import { computed } from 'vue'

const props = withDefaults(defineProps<{
  difficulty: string   // 难度代码 pst/prs/ftr/byd/etr
  constant?: number    // 谱面定数，传入后显示
  showConstant?: boolean // 是否同时显示定数值
}>(), {
  showConstant: false
})

// 难度代码转显示文本
const difficultyText = computed(() => {
  const difficultyMap: Record<string, string> = {
    'pst': 'PAST',
    'prs': 'PRESENT',
    'ftr': 'FUTURE',
    'byd': 'BEYOND',
    'etr': 'ETERNAL'
  }
  return difficultyMap[props.difficulty] || props.difficulty.toUpperCase()
})

// 难度对应样式类
const difficultyClass = computed(() => {
  const difficultyMap: Record<string, string> = {
    'pst': 'difficulty-pst',
    'prs': 'difficulty-prs',
    'ftr': 'difficulty-ftr',
    'byd': 'difficulty-byd',
    'etr': 'difficulty-etr'
  }
  return difficultyMap[props.difficulty] || ''
})
</script>

<style scoped>
.difficulty-tag {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.difficulty-text {
  font-size: 24rpx;
  font-weight: 600;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  line-height: 1.2;
}

.difficulty-constant {
  font-size: 24rpx;
  color: #666;
  background: #f5f5f5;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
}

/* 各难度对应配色 */
.difficulty-pst .difficulty-text {
  background: rgba(76, 175, 80, 0.15);
  color: #2e7d32;
}

.difficulty-prs .difficulty-text {
  background: rgba(33, 150, 243, 0.15);
  color: #1565c0;
}

.difficulty-ftr .difficulty-text {
  background: rgba(255, 152, 0, 0.15);
  color: #e65100;
}

.difficulty-byd .difficulty-text {
  background: rgba(244, 67, 54, 0.15);
  color: #c62828;
}

.difficulty-etr .difficulty-text {
  background: rgba(156, 39, 176, 0.15);
  color: #7b1fa2;
}
</style>
