<template>
  <view class="rating-tag" :class="ratingClass">
    <text class="rating-text">{{ rating }}</text>
  </view>
</template>

<script setup lang="ts">
/*
 * 组件名称: rating-tag
 * 功能描述: 展示Arcaea评级标签（PM/EX+/EX/AA/A/B/C/D），根据评级自动匹配渐变色
 * 适用场景: 成绩列表、计算结果中展示评级信息
 */

import { computed } from 'vue'

const props = defineProps<{
  rating: string   // 评级字符串 PM/EX+/EX/AA/A/B/C/D
}>()

// 评级对应样式类，用于匹配渐变色
const ratingClass = computed(() => {
  const ratingMap: Record<string, string> = {
    'PM': 'rating-pm',
    'EX+': 'rating-ex-plus',
    'EX': 'rating-ex',
    'AA': 'rating-aa',
    'A': 'rating-a',
    'B': 'rating-b',
    'C': 'rating-c',
    'D': 'rating-d'
  }
  return ratingMap[props.rating] || ''
})
</script>

<style scoped>
.rating-tag {
  font-size: 24rpx;
  font-weight: bold;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  display: inline-block;
  line-height: 1.2;
}

/* Arcaea各评级对应渐变配色 */
.rating-pm {
  background: linear-gradient(135deg, #ff3366 0%, #ff6b9d 100%);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(255, 51, 102, 0.3);
}

.rating-ex-plus {
  background: linear-gradient(135deg, #ff9a00 0%, #ffc947 100%);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(255, 154, 0, 0.3);
}

.rating-ex {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(0, 212, 255, 0.3);
}

.rating-aa {
  background: linear-gradient(135deg, #66ff66 0%, #00cc66 100%);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(102, 255, 102, 0.3);
}

.rating-a {
  background: linear-gradient(135deg, #66ccff 0%, #3399ff 100%);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(102, 204, 255, 0.3);
}

.rating-b {
  background: linear-gradient(135deg, #cc99ff 0%, #9966cc 100%);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(204, 153, 255, 0.3);
}

.rating-c {
  background: linear-gradient(135deg, #ffcc99 0%, #ff9966 100%);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(255, 204, 153, 0.3);
}

.rating-d {
  background: linear-gradient(135deg, #999999 0%, #666666 100%);
  color: white;
  box-shadow: 0 2rpx 8rpx rgba(153, 153, 153, 0.3);
}
</style>
