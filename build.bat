@echo off
REM Arcaea PTT Calculator - Windows构建脚本

echo 🎵 Arcaea PTT Calculator - 构建APK
echo ====================================

REM 检查Node.js安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到Node.js，请先安装Node.js (v18+)
    pause
    exit /b 1
)

echo ✅ Node.js版本: 
node --version

REM 检查npm安装
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到npm
    pause
    exit /b 1
)

echo ✅ npm版本: 
npm --version

REM 检查依赖
if not exist "node_modules" (
    echo 📦 安装项目依赖...
    npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已存在
)

REM 检查Capacitor
npx cap --version >nul 2>&1
if errorlevel 1 (
    echo 📦 安装Capacitor CLI...
    npm install @capacitor/cli --save-dev
)

echo ✅ Capacitor版本:
npx cap --version

REM 初始化Capacitor
echo ⚙️ 初始化Capacitor...
npx cap install

REM 添加Android平台
echo 📱 添加Android平台...
if not exist "android" (
    npx cap add android
    echo ✅ Android平台添加成功
) else (
    echo ℹ️ Android平台已存在
)

REM 同步项目
echo 🔄 同步项目...
npx cap sync android

REM 构建APK
echo 🔨 构建Debug APK...
cd android

REM 检查gradlew
if not exist "gradlew.bat" (
    echo ❌ 未找到gradlew.bat，请检查Android项目配置
    pause
    exit /b 1
)

REM 执行构建
gradlew.bat assembleDebug

if errorlevel 1 (
    echo ❌ APK构建失败
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ 构建完成！
echo 📱 APK文件位置: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 📋 下一步操作：
echo 1. 使用adb安装: adb install android\app\build\outputs\apk\debug\app-debug.apk
echo 2. 或直接传输到手机安装
echo 3. 上传到GitHub可获得自动构建
echo.
pause