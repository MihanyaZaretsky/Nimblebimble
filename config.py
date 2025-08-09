import os
import urllib.parse
from dotenv import load_dotenv

# Загружаем переменные окружения из .env файла
load_dotenv()

# Правильно кодируем пароль для URL (используем raw string)
password = r'g%0TS{<QY:V5K!'
encoded_password = urllib.parse.quote_plus(password)

# Строка подключения к PostgreSQL
DATABASE_URL = os.getenv('DATABASE_URL', f'postgresql://nimblebot_user:{encoded_password}@5.129.222.183:5432/default_db')

# Конфигурация базы данных PostgreSQL (для совместимости)
DB_CONFIG = {
    'host': os.getenv('DB_HOST', '5.129.222.183'),
    'port': os.getenv('DB_PORT', '5432'),
    'user': os.getenv('DB_USER', 'nimblebot_user'),
    'password': os.getenv('DB_PASSWORD', 'g%0TS{<QY:V5K!'),
    'database': os.getenv('DB_NAME', 'default_db')
}

# Токен бота Telegram
BOT_TOKEN = os.getenv('BOT_TOKEN', '8059014140:AAEJxrSDSkEDH8f3I4MjywDjJCkaNcGqh8g')

# TON Center API ключ
TON_CENTER_API_KEY = os.getenv('TON_CENTER_API_KEY', 'df82b466369447773fbaf3c2e4ad82f6e37c0b53648ed2a934c1165041e6312d')

# URL Web App
WEBAPP_URL = os.getenv('WEBAPP_URL', 'https://mihanyazaretsky-nimblebimble-6af6.twc1.net')

# Принудительное версионирование для сброса кэша в Telegram Mini App
# Установите переменную окружения WEBAPP_VERSION (например, 20250806),
# чтобы мини‑приложение открывалось всегда со свежей версией фронтенда
WEBAPP_VERSION = os.getenv('WEBAPP_VERSION', '')
if WEBAPP_VERSION:
    separator = '&' if '?' in WEBAPP_URL else '?'
    WEBAPP_URL = f"{WEBAPP_URL}{separator}v={WEBAPP_VERSION}"