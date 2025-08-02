# 🎰 Nimble Roulette Bot

Telegram бот для игры в рулетку с интеграцией платежей через Telegram Stars и TON.

## 🚀 Быстрый запуск

### Windows
```bash
start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

## 📋 Требования

- Node.js 18+
- Python 3.8+
- Telegram Bot Token
- Payment Provider Token (для Telegram Payments)

## ⚙️ Настройка

1. **Скопируйте файл с переменными окружения:**
```bash
cp env.example .env
```

2. **Настройте переменные окружения в `.env`:**
```env
# Telegram Bot Token
BOT_TOKEN=your_bot_token_here

# Web App URL
WEBAPP_URL=https://your-domain.com

# Payment Provider Token (для Telegram Payments)
PAYMENT_PROVIDER_TOKEN=your_payment_provider_token_here

# Server Configuration
PORT=3000
NODE_ENV=production
```

3. **Установите зависимости:**
```bash
npm install
pip install -r requirements.txt
```

## 🔧 Ручной запуск

### Запуск Python бота
```bash
python bot.py
```

### Запуск веб-сервера
```bash
npm run dev
```

## 💳 Настройка платежей

### Telegram Stars Payments

1. Получите Payment Provider Token у @BotFather
2. Добавьте токен в переменную `PAYMENT_PROVIDER_TOKEN`
3. Настройте платежи в боте через @BotFather

### TON Payments (в разработке)

TON платежи пока находятся в разработке.

## 🏗️ Архитектура

- **Python Bot** (`bot.py`) - основной бот для обработки команд и платежей
- **Web App** (`src/App.tsx`) - веб-интерфейс для игры
- **Node.js Server** (`server.js`) - API для платежей и статические файлы
- **WebSocket** - реальное время для игры

## 🔄 Поток платежей

1. Пользователь выбирает метод оплаты (Stars/TON)
2. Вводит сумму
3. Нажимает "Пополнить"
4. Создается ссылка на оплату через Telegram
5. Пользователь оплачивает
6. Бот получает уведомление об успешном платеже
7. Баланс пользователя обновляется

## 📱 Использование

1. Откройте бота в Telegram
2. Нажмите кнопку "🎮 Открыть Nimble Roulette"
3. Выберите вкладку "Пополнить"
4. Выберите метод оплаты и введите сумму
5. Нажмите "Пополнить"
6. Оплатите через Telegram

## 🛠️ Разработка

### Структура проекта
```
nimble3bot/
├── bot.py              # Python бот
├── server.js           # Node.js сервер
├── src/                # React приложение
│   ├── App.tsx         # Главный компонент
│   ├── services/       # Сервисы
│   └── components/     # Компоненты
├── public/             # Статические файлы
└── requirements.txt    # Python зависимости
```

### Команды разработки
```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview
```

## 🔧 Устранение неполадок

### Проблема: Выбор метода оплаты не сохраняется
**Решение:** Исправлено - состояние теперь сохраняется на уровне приложения.

### Проблема: Платежи не работают
**Решение:** 
1. Проверьте `PAYMENT_PROVIDER_TOKEN`
2. Убедитесь, что бот настроен для платежей в @BotFather
3. Проверьте логи сервера

### Проблема: WebSocket не подключается
**Решение:**
1. Убедитесь, что Python бот запущен
2. Проверьте порт 8765
3. Проверьте логи бота

## 📞 Поддержка

Если у вас возникли проблемы, создайте issue в репозитории.

## 📄 Лицензия

MIT License 