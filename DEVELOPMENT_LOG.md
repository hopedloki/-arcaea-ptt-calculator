# Arcaea B30 管理应用开发日志

本文档记录了 Arcaea B30 管理应用开发过程中遇到的问题及其解决方案。

---

## 2025-12-16

### 问题1：添加记录后页面未自动刷新

**问题描述：**
- 在 add 页面添加新记录后，返回 best30 页面时新记录不显示
- 需要手动刷新页面才能看到新添加的记录

**解决方案：**
- 在 best30.vue 中添加 UniApp 的 `onShow` 生命周期钩子
- 导入 UniApp 特有的生命周期钩子：`import { onShow } from '@dcloudio/uni-app'`
- 在 `onShow` 回调中调用 `loadDataFromStorage()` 刷新数据

**代码修改：**
```javascript
// 添加导入
import { onShow } from '@dcloudio/uni-app'

// 添加生命周期钩子
onShow(() => {
  loadDataFromStorage()
})
```

**原因分析：**
- `onMounted` 只在页面首次加载时触发
- 从其他页面返回时，`onShow` 会触发但 `onMounted` 不会
- UniApp 的 `onShow` 钩子专门处理页面显示时的逻辑

---

### 问题2：Vue 3 导入 onShow 生命周期钩子错误

**问题描述：**
- 尝试从 Vue 导入 `onShow`：`import { ref, computed, onMounted, onShow } from 'vue'`
- 控制台报错：Vue 3 中没有 `onShow` 生命周期钩子

**解决方案：**
- 从 Vue 中移除 `onShow` 导入
- 改为从 UniApp 导入：`import { onShow } from '@dcloudio/uni-app'`

**原因分析：**
- `onShow` 是 UniApp 扩展的生命周期钩子，不是 Vue 3 标准API
- UniApp 提供了专门的包来导入这些扩展钩子

---

### 问题3：网页端(H5)导出数据失败

**问题描述：**
- 在网页端点击导出按钮，显示"导出失败"
- 原代码尝试使用 `uni.getFileSystemManager()` 在 H5 环境下写入文件

**解决方案：**
- 使用条件编译分离 H5 和非 H5 环境的处理逻辑
- H5 环境直接使用浏览器原生 API 创建下载链接
- 添加备用方案：如果下载失败，复制到剪贴板

**代码修改：**
```javascript
// #ifdef H5
// 在H5环境下直接创建下载链接
const blob = new Blob([jsonStr], { type: 'application/json' })
const url = URL.createObjectURL(blob)
const link = document.createElement('a')
link.href = url
link.download = fileName
document.body.appendChild(link)
link.click()
document.body.removeChild(link)
URL.revokeObjectURL(url)

// 备用方案：复制到剪贴板
navigator.clipboard.writeText(jsonStr).then(() => {
  uni.showModal({
    title: '导出成功',
    content: '数据已复制到剪贴板，请手动保存为.json文件',
    showCancel: false
  })
})
// #endif
```

**原因分析：**
- `uni.getFileSystemManager()` 在 H5 环境下不可用或行为不一致
- H5 环境应使用浏览器原生 API 进行文件下载
- 条件编译 `#ifdef H5` / `#ifndef H5` 用于区分平台

---

### 问题4：网页端(H5)导入数据无反应

**问题描述：**
- 在网页端选择文件后，没有反应
- 原代码尝试使用 `uni.getFileSystemManager()` 读取文件

**解决方案：**
- 使用条件编译分离 H5 和非 H5 环境的处理逻辑
- H5 环境使用浏览器原生 `FileReader` API
- 区分文件数据来源：H5使用 `res.tempFiles`，非H5使用 `res.tempFilePaths`

**代码修改：**
```javascript
// #ifdef H5
// H5环境使用原生FileReader API
if (res.tempFiles && res.tempFiles.length > 0) {
  const file = res.tempFiles[0]
  const reader = new FileReader()
  
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result as string)
    // 处理导入数据...
  }
  
  reader.readAsText(file, 'utf8')
}
// #endif

// #ifndef H5
// 非H5环境使用UniApp文件系统API
const fileManager = uni.getFileSystemManager()
fileManager.readFile({
  filePath: tempFilePaths[0],
  encoding: 'utf8',
  success: (readRes) => {
    const data = JSON.parse(readRes.data as string)
    // 处理导入数据...
  }
})
// #endif
```

**原因分析：**
- H5 环境下，`uni.chooseFile()` 返回的文件结构与非 H5 环境不同
- H5 环境应使用 `res.tempFiles` 获取 File 对象，而非 `res.tempFilePaths`
- H5 环境应使用 `FileReader` API 而非 UniApp 的文件系统 API

---

## 经验总结

### UniApp 跨平台开发最佳实践

1. **正确使用条件编译**：
   - 使用 `#ifdef H5` / `#ifndef H5` 区分平台特定代码
   - 不要试图在不同平台间混用不兼容的API

2. **文件操作注意事项**：
   - H5 环境使用浏览器原生 File API 和 FileReader
   - 非H5环境使用 UniApp 文件系统 API
   - 注意不同平台文件选择器返回数据结构的差异

3. **生命周期钩子**：
   - Vue 标准钩子从 Vue 导入
   - UniApp 扩展钩子从 `@dcloudio/uni-app` 导入
   - 理解各钩子的触发时机和适用场景

4. **错误处理和备用方案**：
   - 为平台差异提供备用方案
   - 确保用户在任何环境下都有合理的反馈

5. **测试覆盖**：
   - 跨平台功能需要在不同环境下充分测试
   - 特别是文件操作、数据存储等系统级功能

---

## 技术点记录

### UniApp 条件编译指令

- `#ifdef H5`：仅在H5平台编译
- `#ifndef H5`：在非H5平台编译
- `#endif`：条件编译结束

### 文件操作 API 对比

| 操作 | H5 环境 | 非H5 环境 |
|------|---------|-----------|
| 文件选择 | `uni.chooseFile()` 返回 `tempFiles` | `uni.chooseFile()` 返回 `tempFilePaths` |
| 文件读取 | `FileReader.readAsText()` | `uni.getFileSystemManager().readFile()` |
| 文件写入/导出 | `Blob` + `URL.createObjectURL()` | `uni.getFileSystemManager().writeFile()` |

### 生命周期钩子对比

| 钩子 | Vue 3 标准 | UniApp 扩展 |
|------|------------|-------------|
| 页面加载 | `onMounted` | `onLoad` |
| 页面显示 | - | `onShow` |
| 页面隐藏 | - | `onHide` |
| 页面卸载 | `onUnmounted` | `onUnload` |

---

*最后更新：2025-12-16*