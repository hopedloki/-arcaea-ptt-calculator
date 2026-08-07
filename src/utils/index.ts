/*
 * 工具函数统一导出入口
 * 汇集PTT计算、容错计算、数据管理和通用工具函数
 */

export * from './ptt-calculator'
// Phase 3：容错计算已收敛到 tolerance-calculator 单一实现，
// 与 ptt-calculator 不再有同名冲突，统一从入口导出
export * from './tolerance-calculator'
export * from './data-manager'

// 按指定格式格式化日期（占位符：YYYY/MM/DD/HH/mm/ss）
export function formatDate(date: Date | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

// 统一的页面跳转方法，支持navigateTo/redirectTo/switchTab三种模式
export function navigateTo(url: string, type: 'navigateTo' | 'redirectTo' | 'switchTab' = 'navigateTo') {
  switch (type) {
    case 'navigateTo':
      uni.navigateTo({ url });
      break;
    case 'redirectTo':
      uni.redirectTo({ url });
      break;
    case 'switchTab':
      uni.switchTab({ url });
      break;
  }
}

export function getSystemInfo(): Promise<UniApp.GetSystemInfoResult> {
  return new Promise((resolve, reject) => {
    uni.getSystemInfo({
      success: resolve,
      fail: reject
    });
  });
}

// 递归深拷贝对象，支持Date和Array类型
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const cloned = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
} 

export function parseQueryString(search: string): Record<string, string> {
  const params: any = {};
  const cleanSearch = search.replace(/^[?#]/, '');
  
  if (!cleanSearch) {
    return params;
  }
  
  const pairs = cleanSearch.split('&');
  
  pairs.forEach((item) => {
    let [key, value] = item.split('=');
    key = decodeURIComponent(key);
    value = decodeURIComponent(value);
    if (key) {
      if (params[key]) {
        if (Array.isArray(params[key])) {
          params[key].push(value);
        } else {
          params[key] = [params[key], value];
        }
      } else {
        params[key] = value;
      }
    }
  });
  
  return params;
}
