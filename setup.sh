#!/bin/bash

# Arcaea PTT Calculator - 项目初始化脚本
echo "🎵 Arcaea PTT Calculator - 项目初始化"
echo "================================"

# 检查Node.js安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js (v18+)"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"

# 检查npm安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm"
    exit 1
fi

echo "✅ npm版本: $(npm --version)"

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 检查Capacitor CLI
if ! npx cap --version &> /dev/null; then
    echo ""
    echo "📦 安装Capacitor CLI..."
    npm install @capacitor/cli --save-dev
fi

echo "✅ Capacitor版本: $(npx cap --version)"

# 初始化Capacitor
echo ""
echo "⚙️ 初始化Capacitor..."
npx cap install

# 添加Android平台
echo ""
echo "📱 添加Android平台..."
if [ ! -d "android" ]; then
    npx cap add android
    echo "✅ Android平台添加成功"
else
    echo "ℹ️ Android平台已存在"
fi

# 同步项目
echo ""
echo "🔄 同步项目..."
npx cap sync android

echo ""
echo "🎉 项目初始化完成！"
echo ""
echo "📋 下一步操作："
echo "1. 运行应用: npm run serve"
echo "2. 或者在Android Studio中打开: npm run android:open"
echo "3. 构建APK: npm run android:build"
echo ""
echo "📖 更多信息请查看 README.md"