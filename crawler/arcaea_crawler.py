#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Arcaea 爬虫程序
用于获取Arcaea Online的B30和R10数据，并格式化为PTT计算器可识别的格式
"""

import requests
import json
import re
import sys
import pyperclip
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time

class ArcaeaCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.base_url = "https://arcaea.lowiro.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.session.headers.update(self.headers)
    
    def login(self, username, password):
        """登录Arcaea Online"""
        print("正在登录Arcaea Online...")
        
        # 获取登录页面
        login_page = self.session.get(f"{self.base_url}/login")
        soup = BeautifulSoup(login_page.text, 'html.parser')
        
        # 获取CSRF token（如果存在）
        csrf_token = None
        csrf_meta = soup.find('meta', {'name': 'csrf-token'})
        if csrf_meta:
            csrf_token = csrf_meta.get('content')
        
        # 尝试多种登录方式
        login_data = {
            'username': username,
            'password': password
        }
        
        if csrf_token:
            login_data['_token'] = csrf_token
        
        # 尝试API登录
        try:
            api_response = self.session.post(
                f"{self.base_url}/api/login",
                json=login_data,
                headers={'Content-Type': 'application/json'}
            )
            if api_response.status_code == 200:
                result = api_response.json()
                if 'token' in result or 'success' in result:
                    print("登录成功！")
                    return True
                else:
                    print(f"登录失败: {result.get('message', '未知错误')}")
                    return False
        except Exception as e:
            print(f"API登录尝试失败: {str(e)}")
        
        # 尝试表单登录
        try:
            form_response = self.session.post(
                f"{self.base_url}/login",
                data=login_data
            )
            if "logout" in form_response.text.lower() or "dashboard" in form_response.text.lower():
                print("登录成功！")
                return True
            else:
                print("登录失败，请检查用户名和密码")
                return False
        except Exception as e:
            print(f"表单登录尝试失败: {str(e)}")
            return False
    
    def get_best30(self):
        """获取B30数据"""
        print("正在获取B30数据...")
        try:
            # 尝试API方式
            response = self.session.get(f"{self.base_url}/api/me/best30")
            if response.status_code == 200:
                return self.parse_api_data(response.json())
        except Exception as e:
            print(f"API获取B30失败，尝试网页解析: {str(e)}")
        
        # 如果API失败，尝试解析网页
        try:
            response = self.session.get(f"{self.base_url}/me/best30")
            if response.status_code == 200:
                return self.parse_web_data(response.text, "B30")
        except Exception as e:
            print(f"网页解析B30失败: {str(e)}")
        
        return None
    
    def get_recent10(self):
        """获取R10数据"""
        print("正在获取R10数据...")
        try:
            # 尝试API方式
            response = self.session.get(f"{self.base_url}/api/me/recent10")
            if response.status_code == 200:
                return self.parse_api_data(response.json())
        except Exception as e:
            print(f"API获取R10失败，尝试网页解析: {str(e)}")
        
        # 如果API失败，尝试解析网页
        try:
            response = self.session.get(f"{self.base_url}/me/recent10")
            if response.status_code == 200:
                return self.parse_web_data(response.text, "R10")
        except Exception as e:
            print(f"网页解析R10失败: {str(e)}")
        
        return None
    
    def parse_api_data(self, data):
        """解析API返回的数据"""
        songs = []
        
        # 尝试不同的数据结构
        if isinstance(data, dict):
            if 'data' in data:
                song_list = data['data']
            elif 'songs' in data:
                song_list = data['songs']
            else:
                song_list = []
        elif isinstance(data, list):
            song_list = data
        else:
            song_list = []
        
        for song in song_list:
            if isinstance(song, dict):
                song_name = song.get('name', song.get('song_name', ''))
                difficulty = song.get('difficulty', song.get('diff', ''))
                score = song.get('score', song.get('rating', 0))
                constant = song.get('constant', song.get('chart_constant', 0))
                
                if song_name and difficulty and score > 0:
                    songs.append({
                        'name': song_name,
                        'difficulty': difficulty,
                        'score': score,
                        'constant': constant
                    })
        
        return songs
    
    def parse_web_data(self, html, data_type):
        """解析网页数据"""
        soup = BeautifulSoup(html, 'html.parser')
        songs = []
        
        # 尝试找到包含歌曲信息的元素
        song_elements = []
        
        # 尝试不同的选择器
        selectors = [
            '.song-item',
            '.record-item',
            '.best-item',
            '.recent-item',
            'tr.song-row',
            'div[class*="song"]',
            'li[class*="record"]'
        ]
        
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                song_elements = elements
                break
        
        for element in song_elements:
            # 尝试提取歌曲信息
            song_name = ""
            difficulty = ""
            score = 0
            
            # 歌曲名
            name_elements = [
                element.select_one('.song-name'),
                element.select_one('.title'),
                element.select_one('h3'),
                element.select_one('.name')
            ]
            for name_el in name_elements:
                if name_el:
                    song_name = name_el.text.strip()
                    break
            
            # 难度
            diff_elements = [
                element.select_one('.difficulty'),
                element.select_one('.diff'),
                element.select_one('.class-badge'),
            ]
            for diff_el in diff_elements:
                if diff_el:
                    difficulty = diff_el.text.strip().upper()
                    # 标准化难度名称
                    if 'PAST' in difficulty or 'PST' in difficulty:
                        difficulty = 'PST'
                    elif 'PRESENT' in difficulty or 'PRS' in difficulty:
                        difficulty = 'PRS'
                    elif 'FUTURE' in difficulty or 'FTR' in difficulty:
                        difficulty = 'FTR'
                    elif 'BEYOND' in difficulty or 'BYD' in difficulty:
                        difficulty = 'BYD'
                    break
            
            # 分数
            score_elements = [
                element.select_one('.score'),
                element.select_one('.rating'),
                element.select_one('.points')
            ]
            for score_el in score_elements:
                if score_el:
                    score_text = score_el.text.strip().replace(',', '')
                    # 提取数字
                    score_match = re.search(r'(\d+)', score_text)
                    if score_match:
                        score = int(score_match.group(1))
                    break
            
            if song_name and difficulty and score > 0:
                songs.append({
                    'name': song_name,
                    'difficulty': difficulty,
                    'score': score,
                    'constant': 0  # 网页解析可能无法获取定数
                })
        
        return songs
    
    def format_data_for_ptt_calculator(self, b30_data, r10_data):
        """格式化数据为PTT计算器可识别的格式"""
        formatted_text = ""
        
        # 添加B30数据
        if b30_data:
            formatted_text += "B30数据：\n"
            for i, song in enumerate(b30_data, 1):
                formatted_text += f"{i}. {song['name']} [{song['difficulty']}] {song['score']}\n"
        
        formatted_text += "\n"
        
        # 添加R10数据
        if r10_data:
            formatted_text += "R10数据：\n"
            for i, song in enumerate(r10_data, 1):
                formatted_text += f"{i}. {song['name']} [{song['difficulty']}] {song['score']}\n"
        
        return formatted_text
    
    def save_to_clipboard(self, text):
        """保存文本到剪贴板"""
        try:
            pyperclip.copy(text)
            print("数据已复制到剪贴板，可直接粘贴到PTT计算器")
            return True
        except Exception as e:
            print(f"复制到剪贴板失败: {str(e)}")
            print("请手动复制以下数据：")
            print("=" * 50)
            print(text)
            print("=" * 50)
            return False
    
    def run(self):
        """运行爬虫"""
        print("=" * 50)
        print("Arcaea 数据爬虫程序")
        print("=" * 50)
        
        # 获取用户凭据
        username = input("请输入您的Arcaea Online用户名: ")
        password = input("请输入您的Arcaea Online密码: ")
        
        if not username or not password:
            print("用户名或密码不能为空")
            return
        
        # 登录
        if not self.login(username, password):
            print("登录失败，请检查您的用户名和密码")
            return
        
        # 获取数据
        b30_data = self.get_best30()
        r10_data = self.get_recent10()
        
        if not b30_data and not r10_data:
            print("未能获取任何数据，请检查您的网络连接或账号状态")
            return
        
        # 格式化数据
        formatted_data = self.format_data_for_ptt_calculator(b30_data, r10_data)
        
        # 保存到剪贴板
        self.save_to_clipboard(formatted_data)
        
        print("=" * 50)
        print("爬取完成！")
        print(f"B30数据: {len(b30_data) if b30_data else 0} 首")
        print(f"R10数据: {len(r10_data) if r10_data else 0} 首")
        print("=" * 50)

if __name__ == "__main__":
    # 检查依赖
    try:
        import requests
        import beautifulsoup4
        import pyperclip
    except ImportError as e:
        print(f"缺少依赖库: {str(e)}")
        print("请运行以下命令安装依赖:")
        print("pip install requests beautifulsoup4 pyperclip")
        sys.exit(1)
    
    crawler = ArcaeaCrawler()
    crawler.run()