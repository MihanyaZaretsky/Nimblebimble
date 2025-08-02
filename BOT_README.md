# 🤖 Nimble Roulette Bot

Отдельный Telegram бот для игры Nimble Roulette, запускаемый на VDS сервере.

## 🚀 Установка на VDS

### 1. Подготовка сервера
```bash
# Обновляем систему
sudo apt-get update
sudo apt-get upgrade -y

# Устанавливаем Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверяем установку
node --version
npm --version
```

### 2. Создание папки для бота
```bash
mkdir ~/nimble-bot
cd ~/nimble-bot
```

### 3. Загрузка файлов бота
```bash
# Клонируем репозиторий или загружаем файлы
git clone https://github.com/your-repo/nimble-bot.git .
# ИЛИ загрузите файлы вручную:
# - bot.js
# - package-bot.json
# - .env
```

### 4. Установка зависимостей
```bash
# Переименовываем package-bot.json в package.json
mv package-bot.json package.json

# Устанавливаем зависимости
npm install
```

### 5. Настройка переменных окружения
```bash
# Создаем .env файл
nano .env
```

Содержимое `.env`:
```env
BOT_TOKEN=8312865169:AAHmI2FODLlt4Qcf2rr6MtRbUcB8fGtlLoU
API_PORT=3001
```

### 6. Настройка файрвола
```bash
# Открываем порт 3001 для API
sudo ufw allow 3001
sudo ufw enable
```

### 7. Запуск бота
```bash
# Запускаем бота
npm start
```

### 8. Настройка автозапуска с PM2
```bash
# Устанавливаем PM2
sudo npm install -g pm2

# Запускаем бота через PM2
pm2 start bot.js --name "nimble-bot"

# Настраиваем автозапуск
pm2 startup
pm2 save
```

## 🔧 Улучшенный Polling

Бот включает улучшенную систему polling с:
- ✅ Защитой от множественных экземпляров
- ✅ Обработкой конфликтов 409
- ✅ Автоматическими перезапусками
- ✅ Ограничением попыток перезапуска

## 🌐 API Endpoints

Бот предоставляет API на порту 3001:

- `POST /api/createInvoiceLink` - Создание ссылки на оплату
- `GET /api/paymentStatus/:userId` - Проверка статуса платежа
- `GET /api/balance/:userId` - Получение баланса

## 🔗 Интеграция с веб-приложением

В веб-приложении обновите `src/services/paymentService.ts`:
```typescript
const PAYMENT_API_URL = 'http://YOUR_VDS_IP:3001';
```

Замените `YOUR_VDS_IP` на IP адрес вашего VDS сервера.

## 📝 Логи

Просмотр логов:
```bash
# PM2 логи
pm2 logs nimble-bot

# Прямые логи
npm start
```

## 🛠️ Управление

```bash
# Остановить бота
pm2 stop nimble-bot

# Перезапустить бота
pm2 restart nimble-bot

# Удалить бота из PM2
pm2 delete nimble-bot
```

## ✅ Проверка работы

1. Отправьте `/start` боту в Telegram
2. Проверьте API: `http://YOUR_VDS_IP:3001/api/balance/123`
3. Проверьте логи: `pm2 logs nimble-bot`

## 🔒 Безопасность

- Используйте HTTPS для продакшена
- Настройте файрвол
- Регулярно обновляйте зависимости
- Не публикуйте токен бота 