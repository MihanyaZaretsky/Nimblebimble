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
```bash
pip install pymongo
```

### 2. Обновление `requirements.txt`
```
pymongo==4.6.1
```

### 3. Обновление `bot.py`
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