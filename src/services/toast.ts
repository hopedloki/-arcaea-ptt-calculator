export function showSuccess(msg: string): void {
  uni.showToast({ title: msg, icon: 'success', duration: 2000 })
}

export function showError(msg: string): void {
  uni.showToast({ title: msg, icon: 'none', duration: 2500 })
}

export function showLoading(msg: string = '加载中...'): void {
  uni.showLoading({ title: msg, mask: true })
}

export function hideLoading(): void {
  uni.hideLoading()
}

export function showConfirm(title: string, content: string): Promise<boolean> {
  return new Promise(resolve => {
    uni.showModal({
      title,
      content,
      success(res: any) {
        resolve(res.confirm)
      },
      fail() {
        resolve(false)
      }
    })
  })
}
