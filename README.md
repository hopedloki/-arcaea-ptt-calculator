# 🎵 Arcaea PTT Calculator

一个专为 Arcaea 玩家设计的 PTT (Potential) 计算器移动应用，支持精确的成绩转换和容错分析。

## 📱 **立即下载**

### **最新版本 v1.0.0**
- 🟢 **下载 APK**: [app-debug.apk](https://github.com/hopedloki/-arcaea-ptt-calculator/releases/download/v1.0.0/app-debug.apk) (3.76 MB)
- 🔧 **系统要求**: Android 5.0+ (API 21)
- 📅 **更新时间**: 2025-12-07

[📥 所有版本下载](https://github.com/hopedloki/-arcaea-ptt-calculator/releases)

## ✨ **主要功能**

- 🔄 **双向计算**: 成绩 ↔ PTT 相互转换
- 🎯 **精准计算**: 基于官方算法的精确 PTT 计算  
- 📊 **容错分析**: 不同评级下的 Far 容错数量
- 📱 **原生体验**: 专为 Android 优化的流畅界面
- 🎨 **现代设计**: 渐变色主题 + 流畅动画
- ⚡ **实时响应**: 输入即时显示计算结果

## 🎮 **使用指南**

### 安装步骤
1. 下载最新的 `app-debug.apk` 文件
2. 在 Android 设置中开启"未知来源"安装权限
3. 点击 APK 文件完成安装
4. 打开应用开始使用

### 使用方法
1. **成绩转 PTT**: 输入您的分数，立即获得对应的 PTT 值
2. **PTT 转成绩**: 输入目标 PTT，查看需要的分数
3. **容错计算**: 查看在不同评级下可以失误的 Far 数量

## 📸 **应用截图**

> 💡 *应用截图区域 - 您可以添加实际的应用截图*

## 📋 **版本历史**

### v1.0.0 (2025-12-07)
- ✅ 首次发布完整功能版本
- ✅ 实现双向 PTT 计算
- ✅ 添加容错分析功能
- ✅ 优化 Android 原生体验
- ✅ 完善现代化 UI 设计

## 🔧 **应用信息**

| 项目 | 详细信息 |
|------|----------|
| **应用名称** | Arcaea PTT Calculator |
| **包名** | com.arcaea.pttcalculator |
| **版本** | v1.0.0 |
| **最低系统** | Android 5.0+ (API 21) |
| **文件大小** | 3.76 MB |
| **开发状态** | ✅ 已发布可用 |

## 🌟 **特色亮点**

### 🎯 **专为 Arcaea 玩家设计**
- 支持 PST, PRS, FTR, BYD, ETR 所有难度
- 基于最新的 Arcaea PTT 计算公式
- 适配各种段位和技能水平

### 💎 **极致用户体验**
- 无需网络连接，离线使用
- 响应式设计，完美适配各种屏幕
- 流畅动画效果，操作体验顺滑

### 🔒 **安全可靠**
- 无需注册登录，保护隐私
- 本地计算，不上传任何数据
- 开源透明，代码可审查

## 🛠️ **开发信息**

### 技术栈
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **框架**: Capacitor 6.0
- **平台**: Android
- **构建**: Gradle 8.2.1

### 开发者
如果你想参与开发或查看源码：

[📂 源代码](https://github.com/hopedloki/-arcaea-ptt-calculator) | [🔧 开发指南](#开发者指南)

---

## 🔧 **开发者指南**

<details>
<summary>👨‍💻 点击展开开发相关内容</summary>

### 开发环境设置

1. 克隆项目：
```bash
git clone https://github.com/hopedloki/-arcaea-ptt-calculator.git
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

### 构建APK

#### 开发版本（Debug）
```bash
npm run android:build
```

#### 发布版本（Release）
需要配置签名密钥后才能构建发布版本。

### GitHub Actions自动构建

本项目配置了GitHub Actions，支持：

- **推送构建**: 每次推送到main或develop分支时自动构建Debug APK
- **发布构建**: 创建Release标签时自动构建Release APK
- **手动构建**: 支持手动触发构建流程

### 项目结构

```
arcaea-ptt-calculator/
├── index.html                 # 主页面
├── package.json               # npm配置
├── capacitor.config.ts        # Capacitor配置
├── android/                 # Android平台代码
│   ├── app/
│   └── build.gradle         # Android构建配置
└── README.md                # 项目说明
```

### 版本发布

1. 更新`package.json`中的版本号
2. 创建Git标签：
```bash
git tag v1.0.0
git push origin v1.0.0
```
3. GitHub Actions会自动构建并发布Release APK

</details>

---

## 📞 **反馈与支持**

### 🐛 **问题反馈**
- 如果遇到 Bug，请在 [Issues](https://github.com/hopedloki/-arcaea-ptt-calculator/issues) 中报告
- 描述问题时请包含：Android 版本、手机型号、具体操作步骤

### 💡 **功能建议**
- 欢迎提出新功能建议
- 可以在 Issues 中讨论改进方案

### 🤝 **贡献代码**
- 欢迎提交 Pull Request
- 请遵循现有代码风格和提交规范

## 📜 **许可证**

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 **致谢**

- 感谢 Arcaea 官方提供的游戏数据
- 使用 Capacitor 框架实现混合应用开发
- 感谢所有贡献者和用户的宝贵建议

---

<div align="center">

**⭐ 如果这个应用对您有帮助，请给项目一个 Star！**

[📱 下载 APK](https://github.com/hopedloki/-arcaea-ptt-calculator/releases/download/v1.0.0/app-debug.apk) | [⭐ Star 本项目](https://github.com/hopedloki/-arcaea-ptt-calculator) | [🔧 查看源码](https://github.com/hopedloki/-arcaea-ptt-calculator)

</div>