@echo off
echo ========================================
echo Arcaea 数据爬虫程序
echo ========================================
echo.
echo 正在检查Python环境...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未找到Python环境
    echo 请先安装Python 3.6或更高版本
    echo 下载地址：https://www.python.org/downloads/
    pause
    exit /b 1
)

echo Python环境检查通过
echo.
echo 正在检查依赖库...
python -c "import requests, beautifulsoup4, pyperclip" >nul 2>&1
if %errorlevel% neq 0 (
    echo 正在安装必要的依赖库...
    pip install requests beautifulsoup4 pyperclip
    if %errorlevel% neq 0 (
        echo 错误：依赖库安装失败
        echo 请手动运行：pip install requests beautifulsoup4 pyperclip
        pause
        exit /b 1
    )
    echo 依赖库安装完成
)
echo 依赖库检查通过
echo.
echo 启动爬虫程序...
echo.
python arcaea_crawler.py

pause