@echo off
echo 正在准备生成APK...
echo 注意：此脚本需要您已安装Android SDK和配置好环境变量
echo.

REM 检查ANDROID_HOME环境变量
if "%ANDROID_HOME%"=="" (
    echo 错误：未找到ANDROID_HOME环境变量
    echo 请确保已安装Android SDK并设置ANDROID_HOME环境变量
    pause
    exit /b 1
)

echo ANDROID_HOME: %ANDROID_HOME%

REM 设置项目路径
set PROJECT_DIR=%~dp0
set APP_RESOURCES_DIR=%PROJECT_DIR%dist\build\app
set BUILD_DIR=%PROJECT_DIR%android-build

REM 创建Android项目目录
if not exist "%BUILD_DIR%" mkdir "%BUILD_DIR%"

echo 正在复制App资源到Android项目目录...
xcopy "%APP_RESOURCES_DIR%\*" "%BUILD_DIR%\assets\" /E /I /Y

echo.
echo App资源已准备完成！
echo 接下来您需要：
echo 1. 使用HBuilderX导入 %BUILD_DIR% 目录并打包成APK
echo 2. 或者使用Android Studio创建项目并复制资源
echo.
pause