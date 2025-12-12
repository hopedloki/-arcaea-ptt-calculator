#!/bin/bash

echo "========================================"
echo "Arcaea 数据爬虫程序"
echo "========================================"
echo

# 检查Python环境
echo "正在检查Python环境..."
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "错误：未找到Python环境"
    echo "请先安装Python 3.6或更高版本"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS用户可以使用Homebrew安装：brew install python"
    else
        echo "Linux用户请使用包管理器安装，如：apt-get install python3"
    fi
    exit 1
fi

# 确定Python命令
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

echo "Python环境检查通过 ($PYTHON_CMD)"
echo

# 检查依赖库
echo "正在检查依赖库..."
$PYTHON_CMD -c "import requests, beautifulsoup4, pyperclip" &> /dev/null
if [ $? -ne 0 ]; then
    echo "正在安装必要的依赖库..."
    $PYTHON_CMD -m pip install requests beautifulsoup4 pyperclip
    if [ $? -ne 0 ]; then
        echo "错误：依赖库安装失败"
        echo "请手动运行：$PYTHON_CMD -m pip install requests beautifulsoup4 pyperclip"
        exit 1
    fi
    echo "依赖库安装完成"
fi

echo "依赖库检查通过"
echo
echo "启动爬虫程序..."
echo

# 运行爬虫
$PYTHON_CMD arcaea_crawler.py