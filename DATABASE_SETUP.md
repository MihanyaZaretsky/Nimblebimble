# 🗄️ Настройка облачной базы данных

## 📋 Варианты облачных БД

### 1. **MongoDB Atlas** (Рекомендуется)
- **Бесплатный план**: 512MB, 500 соединений
- **Простота настройки**: веб-интерфейс
- **Поддержка**: отличная документация

### 2. **Supabase** (PostgreSQL)
- **Бесплатный план**: 500MB, 50,000 запросов/месяц
- **Функции**: авторизация, real-time
- **SQL**: знакомый синтаксис

### 3. **PlanetScale** (MySQL)
- **Бесплатный план**: 1GB, 1 миллиард строк
- **Производительность**: очень быстрая
- **Git-подобная работа с БД**

### 4. **Яндекс.Облако** (PostgreSQL/MySQL)
- **Бесплатный план**: 15GB SSD, 2 ядра, 2GB RAM на 60 дней
- **Регион**: Россия (быстрая скорость)
- **Поддержка**: на русском языке

### 5. **VK Cloud** (PostgreSQL/MySQL)
- **Бесплатный план**: 15GB SSD, 1 ядро, 1GB RAM на 30 дней
- **Регион**: Россия
- **Интеграция**: с VK экосистемой

### 6. **Selectel** (PostgreSQL/MySQL)
- **Бесплатный план**: 10GB SSD, 1 ядро, 1GB RAM на 14 дней
- **Регион**: Россия
- **Простота**: легкая настройка

## 🇷🇺 Российские облачные БД (Рекомендуется для РФ)

### 🚀 Настройка Яндекс.Облако

#### Шаг 1: Регистрация
1. Зайдите на [cloud.yandex.ru](https://cloud.yandex.ru)
2. Нажмите "Попробовать бесплатно"
3. Заполните форму (нужна карта для верификации)

#### Шаг 2: Создание БД
1. В консоли выберите "Managed Service for PostgreSQL"
2. Нажмите "Создать кластер"
3. Выберите "Стартовый" план (бесплатный)
4. Настройте:
   - **Имя**: `nimblebot-db`
   - **Пароль**: `сложный_пароль_123!`
   - **База данных**: `nimblebot`

#### Шаг 3: Получение строки подключения
```
postgresql://nimblebot:пароль@c-xxxxx.rw.mdb.yandexcloud.net:6432/nimblebot
```

### 🚀 Настройка VK Cloud

#### Шаг 1: Регистрация
1. Зайдите на [mcs.mail.ru](https://mcs.mail.ru)
2. Нажмите "Попробовать бесплатно"
3. Заполните форму регистрации

#### Шаг 2: Создание БД
1. Выберите "Базы данных" → "PostgreSQL"
2. Нажмите "Создать инстанс"
3. Выберите бесплатный план
4. Настройте подключение

## 🚀 Пошаговая настройка MongoDB Atlas

### Шаг 1: Регистрация
1. Зайдите на [mongodb.com/atlas](https://mongodb.com/atlas)
2. Нажмите "Try Free"
3. Заполните форму регистрации

### Шаг 2: Создание кластера
1. Выберите **"FREE"** план (M0)
2. Выберите провайдера (AWS/Google Cloud/Azure)
3. Выберите регион (ближайший к вам)
4. Нажмите "Create"

### Шаг 3: Настройка безопасности
1. **Database Access**:
   - Создайте пользователя БД
   - Логин: `nimblebot`
   - Пароль: `сложный_пароль_123!`
   - Роль: `Read and write to any database`

2. **Network Access**:
   - Нажмите "Add IP Address"
   - Выберите "Allow Access from Anywhere" (0.0.0.0/0)
   - Или добавьте IP вашего сервера

### Шаг 4: Получение строки подключения
1. Нажмите "Connect"
2. Выберите "Connect your application"
3. Скопируйте строку подключения:
```
mongodb+srv://nimblebot:пароль@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 🔧 Обновление кода

### 1. Установка зависимостей

**Для российских сервисов (PostgreSQL):**
```bash
pip install psycopg2-binary
```

**Для зарубежных сервисов (MongoDB):**
```bash
pip install pymongo
```

### 2. Обновление `requirements.txt`

**Для российских сервисов:**
```
psycopg2-binary==2.9.9
```

**Для зарубежных сервисов:**
```
pymongo==4.6.1
```

### 3. Обновление `bot.py` (PostgreSQL для российских сервисов)

```python
import psycopg2
import os
from psycopg2.extras import RealDictCursor

# Подключение к PostgreSQL (Яндекс.Облако/VK Cloud)
DATABASE_URL = "postgresql://nimblebot:пароль@c-xxxxx.rw.mdb.yandexcloud.net:6432/nimblebot"

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

# Создание таблицы (выполнить один раз)
def create_tables():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS user_balances (
            user_id BIGINT PRIMARY KEY,
            stars INTEGER DEFAULT 0,
            ton DECIMAL(10,2) DEFAULT 0.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

# Функции для работы с балансом
def get_user_balance(user_id: int):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT stars, ton FROM user_balances WHERE user_id = %s", (user_id,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    
    if result:
        return {"stars": result['stars'], "ton": float(result['ton'])}
    return {"stars": 0, "ton": 0}

def update_user_balance(user_id: int, currency: str, amount: float):
    conn = get_db_connection()
    cur = conn.cursor()
    
    if currency == "stars":
        cur.execute("""
            INSERT INTO user_balances (user_id, stars, updated_at) 
            VALUES (%s, %s, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id) 
            DO UPDATE SET stars = user_balances.stars + %s, updated_at = CURRENT_TIMESTAMP
        """, (user_id, amount, amount))
    elif currency == "ton":
        cur.execute("""
            INSERT INTO user_balances (user_id, ton, updated_at) 
            VALUES (%s, %s, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id) 
            DO UPDATE SET ton = user_balances.ton + %s, updated_at = CURRENT_TIMESTAMP
        """, (user_id, amount, amount))
    
    conn.commit()
    cur.close()
    conn.close()
```

### 3. Обновление `bot.py` (MongoDB для зарубежных сервисов)

```python
from pymongo import MongoClient
import os

# Подключение к MongoDB
MONGO_URI = "mongodb+srv://nimblebot:пароль@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)
db = client.nimblebot
balances_collection = db.user_balances

# Функции для работы с балансом
def get_user_balance(user_id: int):
    user_doc = balances_collection.find_one({"user_id": user_id})
    if user_doc:
        return {"stars": user_doc.get("stars", 0), "ton": user_doc.get("ton", 0)}
    return {"stars": 0, "ton": 0}

def update_user_balance(user_id: int, currency: str, amount: float):
    if currency == "stars":
        balances_collection.update_one(
            {"user_id": user_id},
            {"$inc": {"stars": amount}},
            upsert=True
        )
    elif currency == "ton":
        balances_collection.update_one(
            {"user_id": user_id},
            {"$inc": {"ton": amount}},
            upsert=True
        )
```

## 🔐 Переменные окружения

### На Railway:
1. Зайдите в настройки проекта
2. Добавьте переменную:
   - **Ключ**: `MONGO_URI`
   - **Значение**: ваша строка подключения

### Локально:
Создайте файл `.env`:
```
MONGO_URI=mongodb+srv://nimblebot:пароль@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 📊 Структура данных

### Коллекция: `user_balances`
```json
{
  "user_id": 2029065770,
  "stars": 1000,
  "ton": 100.00,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 🧪 Тестирование

### Добавление тестовых данных
```python
# Добавить пользователя с большим балансом
update_user_balance(2029065770, "stars", 1000)
update_user_balance(2029065770, "ton", 100.00)
```

## ⚠️ Важные моменты

1. **Безопасность**: никогда не коммитьте пароли в Git
2. **Резервное копирование**: MongoDB Atlas делает автоматические бэкапы
3. **Мониторинг**: следите за использованием ресурсов
4. **Индексы**: добавьте индекс на `user_id` для быстрого поиска

## 🔄 Миграция данных

Если у вас уже есть данные в `user_balances.json`:
```python
import json

# Загрузить старые данные
with open('user_balances.json', 'r') as f:
    old_data = json.load(f)

# Перенести в MongoDB
for user_id, balance in old_data.items():
    balances_collection.update_one(
        {"user_id": int(user_id)},
        {"$set": balance},
        upsert=True
    )
```

## 📞 Поддержка

- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **PyMongo**: [pymongo.readthedocs.io](https://pymongo.readthedocs.io)
- **Railway**: [docs.railway.app](https://docs.railway.app) 