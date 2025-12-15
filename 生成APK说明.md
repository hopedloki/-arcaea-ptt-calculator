# Arcaea PTT计算器 - APK生成指南

## 方法一：使用HBuilderX IDE（推荐）

1. **下载并安装HBuilderX**
   - 访问 [DCloud官网](https://www.dcloud.io/hbuilderx.html) 下载HBuilderX
   - 选择"标准版"或"App开发版"

2. **导入项目**
   - 打开HBuilderX
   - 文件 → 导入 → 从本地目录导入
   - 选择项目根目录：`C:/Users/hopedloki/CodeBuddy/20251215113240`

3. **配置App信息**
   - 打开 `manifest.json` 文件
   - 确保填写了 `appid`（应用ID）
   - 配置应用名称、图标等信息

4. **生成APK**
   - 在项目管理器中右键点击项目
   - 选择"发行" → "原生App-云打包"
   - 选择Android平台
   - 填写应用信息（包名、证书等）
   - 点击"打包"，等待云端完成

## 方法二：使用HBuilderX本地打包

1. **准备Android SDK**
   - 安装Android Studio
   - 配置ANDROID_HOME环境变量
   - 下载Android SDK Build-Tools

2. **在HBuilderX中本地打包**
   - 在项目管理器中右键点击项目
   - 选择"发行" → "原生App-本地打包"
   - 选择Android平台
   - 配置打包参数
   - 点击"打包"

## 方法三：使用命令行工具（高级）

1. **安装DCloud CLI**
   ```bash
   npm install -g @dcloudio/uni-cli
   ```

2. **构建App资源**
   ```bash
   npm run build:app-plus
   ```

3. **使用Android Studio打包**
   - 创建新的Android项目
   - 将生成的资源复制到Android项目中
   - 配置build.gradle
   - 生成签名APK

## 注意事项

1. **应用ID（AppID）**
   - 在manifest.json中必须填写有效的appid
   - 格式通常为反向域名，如：com.example.arcaea

2. **签名证书**
   - 发布到应用商店的APK需要签名
   - 可以使用HBuilderX生成测试证书
   - 生产环境建议使用正式签名证书

3. **云打包限制**
   - 免费版DCloud账号每日有打包次数限制
   - 付费账号享有更多打包次数

## 当前项目状态

✅ 项目代码已同步到GitHub
✅ UniApp代码已编译完成（位于dist/build/app目录）
⚠️ 需要配置manifest.json中的appid
⚠️ 需要选择合适的打包方式生成APK

## 快速开始

1. 下载安装HBuilderX
2. 导入项目
3. 在manifest.json中配置appid
4. 使用云打包功能生成APK

## 技术支持

- HBuilderX官方文档：https://hx.dcloud.net.cn/
- UniApp官方文档：https://uniapp.dcloud.io/
- DCloud开发者社区：https://ask.dcloud.net.cn/