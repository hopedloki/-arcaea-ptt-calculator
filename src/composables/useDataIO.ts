/**
 * 数据导入导出逻辑提取
 * 提供跨平台的文件导出（JSON下载/写入）和文件导入（FileReader/uni.chooseFile）能力
 * 统一管理 best30.vue 和 data.vue 中的导入导出流程
 */
import { showSuccess, showError } from '@/services/toast'

/**
 * 将 JSON 数据导出为文件
 * H5: Blob + download link
 * 小程序: 写入本地文件系统 + 复制到剪贴板
 */
export function exportJsonFile(
  data: unknown,
  fileName: string,
  options?: { copyOnMobile?: boolean; clipboardMessage?: string }
) {
  const jsonStr = JSON.stringify(data, null, 2)
  const { copyOnMobile = false, clipboardMessage = '已复制到剪贴板' } = options || {}

  // #ifdef H5
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
  showSuccess('导出成功')
  // #endif

  // #ifndef H5
  if (copyOnMobile) {
    uni.setClipboardData({
      data: jsonStr,
      success: () => showError(clipboardMessage),
    })
    return
  }
  const fileManager = uni.getFileSystemManager()
  const filePath = `${uni.env.USER_DATA_PATH || ''}${fileName}`
  fileManager.writeFile({
    filePath,
    data: jsonStr,
    encoding: 'utf8',
    success: () => showSuccess(`已保存至: ${filePath}`),
    fail: () => showError('导出失败'),
  })
  // #endif
}

/**
 * 从 JSON 文件导入数据
 * H5: 创建 DOM input[type=file] + FileReader
 * 小程序: uni.chooseFile + uni.getFileSystemManager
 * @returns Promise<string> 解析后的 JSON 字符串
 */
export function importJsonFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) {
        reject(new Error('未选择文件'))
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        resolve((event.target?.result as string) || '')
      }
      reader.onerror = () => reject(new Error('读取文件失败'))
      reader.readAsText(file)
    }
    input.click()
    // #endif

    // #ifndef H5
    // @dcloudio/types 的 chooseFile 选项类型与小程序端实际 API 不一致，这里按实际用法断言
    uni.chooseFile({
      count: 1,
      type: 'file',
      extension: ['.json'],
      success: (res: any) => {
        const tempFilePath = res.tempFilePaths?.[0]
        if (!tempFilePath) {
          reject(new Error('未选择文件'))
          return
        }
        const fileManager = uni.getFileSystemManager()
        fileManager.readFile({
          filePath: tempFilePath,
          encoding: 'utf8',
          success: (readRes) => resolve(readRes.data as string),
          fail: (err) => {
            // #ifdef dev
            console.error('读取文件失败', err)
            // #endif
            reject(new Error('读取文件失败'))
          },
        })
      },
      fail: () => reject(new Error('选择文件失败')),
    } as any)
    // #endif
  })
}

/**
 * 格式化时间为简短显示（MM-DD HH:mm）
 */
export function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}
