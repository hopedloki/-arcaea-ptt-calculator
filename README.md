# Arcaea PTT 计算器（离线版）

专为 Arcaea 玩家设计的 PTT 计算与管理工具。本仓库为**离线版**：所有数据仅保存在本地，不依赖云端。

## 云端版

如需**云端存储、跨设备同步与最新歌曲数据**，请访问云端版：

**[https://hopeddev.online](https://hopeddev.online)**

## 本仓库内容

- `index.html` / `assets/` / `static/`：离线版 H5 构建产物（`npm run build:offline:h5` 产出），可下载后自行部署或直接打开使用
- **Releases**：uni-app 打包的 Android App，下载安装后可离线使用

## 功能

- 成绩 ↔ PTT 双向转换
- B30 成绩管理与统计
- 评级 / 分数 / PTT 容错计算
- 内置歌曲数据库（含定数、物量、谱师信息）
- 数据导入导出与备份

> 重要数据请使用应用内的"导出"功能备份；卸载应用或清除浏览器数据会清空本地记录。

## 构建（开发者）

```bash
npm install
npm run build:offline:h5
```
