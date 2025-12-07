# Arcaea PTT Calculator

一个用于计算Arcaea游戏PTT（Potential）的移动应用，支持双向计算（成绩↔PTT）和容错计算。

## 功能特性

- 📱 **移动端优化**: 专为Android设备设计的原生应用
- 🔄 **双向计算**: 支持成绩转PTT和PTT转成绩
- 🎯 **容错计算**: 计算不同评级和PTT下的Far容错数量
- 📊 **实时计算**: 输入数据即时显示结果
- 🎨 **现代UI**: 采用渐变色设计和流畅动画
- 📱 **PWA支持**: 支持离线使用和添加到主屏幕

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **框架**: Capacitor 6.0
- **平台**: Android
- **构建**: Gradle, GitHub Actions

## 安装和运行

### 开发环境设置

1. 克隆项目：
```bash
git clone https://github.com/your-username/arcaea-ptt-calculator.git
cd arcaea-ptt-calculator
```

2. 安装依赖：
```bash
npm install
```

3. 添加Android平台（首次运行）：
```bash
npx cap add android
```

4. 同步项目：
```bash
npx cap sync android
```

5. 运行应用：
```bash
npm run serve
```

或者直接打开Android Studio：
```bash
npm run android:open
```

### 构建APK

#### 开发版本（Debug）
```bash
npm run android:build
```

#### 发布版本（Release）
需要配置签名密钥后才能构建发布版本。

## GitHub Actions自动构建

本项目配置了GitHub Actions，支持：

- **推送构建**: 每次推送到main或develop分支时自动构建Debug APK
- **发布构建**: 创建Release标签时自动构建Release APK
- **手动构建**: 支持手动触发构建流程

### 构建产物

- Debug APK: 可在Actions页面的Artifacts中下载
- Release APK: 自动附加到GitHub Release

## 项目结构

```
arcaea-ptt-calculator/
├── index.html                 # 主页面
├── package.json               # npm配置
├── capacitor.config.ts        # Capacitor配置
├── tsconfig.json             # TypeScript配置
├── manifest.json             # PWA清单
├── .github/workflows/        # GitHub Actions工作流
│   ├── build-apk.yml        # 构建APK工作流
│   └── release.yml          # 发布工作流
├── android/                 # Android平台代码
│   ├── app/
│   │   └── src/main/res/   # Android资源文件
│   ├── build.gradle         # Android构建配置
│   └── gradle/              # Gradle配置
└── README.md                # 项目说明
```

## 配置说明

### 应用信息

- **应用名称**: Arcaea PTT Calculator
- **包名**: com.arcaea.pttcalculator
- **版本**: 1.0.0
- **最低Android版本**: API 21 (Android 5.0)

### 发布配置

要构建Release版本，需要在GitHub仓库设置中添加以下Secrets：

- `KEYSTORE_BASE64`: Base64编码的Android签名密钥文件
- `KEYSTORE_PASSWORD`: 密钥库密码
- `KEY_ALIAS`: 密钥别名
- `KEY_PASSWORD`: 密钥密码

### 签名密钥生成

生成发布密钥：
```bash
keytool -genkey -v -keystore release.keystore -alias your-alias -keyalg RSA -keysize 2048 -validity 10000
```

转换为Base64（用于GitHub Secrets）：
```bash
base64 release.keystore
```

## 开发指南

### 添加新功能

1. 修改`index.html`中的HTML和JavaScript代码
2. 运行`npx cap sync android`同步更改到Android项目
3. 使用`npm run serve`测试功能

### 样式修改

- 全局样式在`index.html`的`<style>`标签中
- Android特定样式在`android/app/src/main/res/`目录中

### 版本发布

1. 更新`package.json`中的版本号
2. 创建Git标签：
```bash
git tag v1.0.0
git push origin v1.0.0
```
3. GitHub Actions会自动构建并发布Release APK

## 许可证

MIT License - 详见LICENSE文件

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 致谢

- Arcaea游戏数据来源于官方
- 使用Capacitor框架实现混合应用开发
- 感谢所有贡献者的支持