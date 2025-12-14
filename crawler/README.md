# Arcaea 爬虫程序

这是一个简单的Python脚本，用于获取Arcaea Online的B30和R10数据，并将其格式化为PTT计算器可识别的格式。

## 功能特性

- 自动登录Arcaea Online
- 获取用户的B30和R10成绩
- 自动格式化数据，可直接粘贴到PTT计算器
- 支持Windows、macOS和Linux

## 安装依赖

```bash
pip install requests beautifulsoup4 pyperclip
```

## 使用方法

1. 下载本程序到本地
2. 打开命令行/终端
3. 运行以下命令：
   ```bash
   python arcaea_crawler.py
   ```
4. 按提示输入您的Arcaea Online用户名和密码
5. 程序会自动获取数据并复制到剪贴板
6. 返回PTT计算器，使用"手动粘贴"功能导入数据

## 注意事项

- 请确保您的账号可以正常登录Arcaea Online
- 程序不会保存您的密码，使用后安全退出
- 仅用于个人用途，请勿用于商业用途或违反服务条款
- 如果遇到登录问题，请检查账号密码是否正确

## 故障排除

如果程序无法正常运行：

1. 检查Python版本（推荐Python 3.6+）
2. 确认已安装所有依赖库
3. 检查网络连接是否正常
4. 尝试手动登录Arcaea Online确认账号状态

## 安全说明

本程序仅用于获取您自己的游戏数据，不会分享给第三方。密码仅在内存中临时使用，不会被保存或传输。

## 开发者

如果您是开发者，欢迎贡献代码或提出改进建议。

## 许可证

MIT License