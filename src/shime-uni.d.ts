export {}

declare module "vue" {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks {}
}

// 补充 uni-app 类型缺失：uni.env（H5/App 环境变量，如 USER_DATA_PATH）
// 以及 Vite 环境变量类型（VITE_OFFLINE 用于离线版构建）
declare global {
  interface Uni {
    env: Record<string, string | undefined>
  }

  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string
    readonly VITE_OFFLINE?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
