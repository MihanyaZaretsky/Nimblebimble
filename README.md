# 🎰 Nimble Roulette Web App

Современное Telegram Web App для игры в рулетку, созданное на Vite.js + React + TypeScript.

## 🚀 Особенности

- ✅ **Vite.js** - быстрая сборка и разработка
- ✅ **React 18** - современный UI фреймворк
- ✅ **TypeScript** - типобезопасность
- ✅ **Telegram Web App SDK** - полная интеграция с Telegram
- ✅ **WebSocket** - реальное время с Python ботом
- ✅ **Telegram Stars** - поддержка платежей
- ✅ **Адаптивный дизайн** - для всех устройств
- ✅ **Красивая анимация** - колесо рулетки

## 📋 Установка

### 1. Клонирование репозитория
```bash
git clone https://github.com/your-username/nimble-roulette-webapp.git
cd nimble-roulette-webapp
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Запуск в режиме разработки
```bash
npm run dev
```

### 4. Сборка для продакшена
```bash
npm run build
```

## 🎮 Функции

### 🎰 Игра в рулетку:
- Классическая рулетка 0-36
- Выбор размера ставки
- Анимированное колесо
- Результаты в реальном времени

### 💎 Telegram Stars:
- Покупка Stars через Telegram
- Вывод выигрышей
- Баланс в реальном времени

### ⚡ Интеграция:
- WebSocket с Python ботом
- Telegram Web App SDK
- Haptic Feedback
- Popup уведомления

## 🔗 Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Vite.js App    │    │  Python Bot     │    │  Telegram API   │
│  (Frontend)     │◄──►│  (Backend)      │◄──►│  (Mini Apps)    │
│  React + TS     │    │  aiogram 3      │    │  Web App        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  WebSocket      │    │  Telegram Stars │
│  (Real-time)    │    │  (Payments)     │
└─────────────────┘    └─────────────────┘
```

## 🛠️ Технологии

- **Frontend**: Vite.js, React 18, TypeScript
- **Styling**: CSS3, Flexbox, Grid
- **Telegram**: Web App SDK, Mini Apps
- **Real-time**: WebSocket
- **Build**: Vite, TypeScript Compiler

## 📱 Telegram Web App

### Инициализация:
```typescript
const tg = window.Telegram.WebApp
tg.ready()
tg.expand()
```

### Отправка данных:
```typescript
tg.sendData(JSON.stringify({
  action: 'place_bet',
  amount: 100,
  user_id: user.id
}))
```

### Уведомления:
```typescript
tg.showAlert('🎉 Выигрыш!')
tg.HapticFeedback.notificationOccurred('success')
```

## 🚀 Деплой

### На Render:
1. Подключите GitHub репозиторий
2. Выберите **Static Site**
3. Build Command: `npm run build`
4. Publish Directory: `dist`

### На Vercel:
```bash
npm install -g vercel
vercel
```

### На Netlify:
```bash
npm run build
# Загрузите папку dist
```

## 🔧 Разработка

### Структура проекта:
```
src/
├── components/
│   ├── RouletteGame.tsx    # Основной компонент игры
│   └── RouletteGame.css    # Стили игры
├── App.tsx                 # Главный компонент
├── App.css                 # Стили приложения
├── main.tsx               # Точка входа
└── index.css              # Глобальные стили
```

### Добавление новых функций:
1. Создайте компонент в `src/components/`
2. Добавьте TypeScript типы
3. Интегрируйте с Telegram SDK
4. Обновите WebSocket логику

## 📞 Поддержка

- **Telegram**: @your_support_username
- **Email**: support@your-domain.com
- **GitHub Issues**: [Создать issue](https://github.com/your-username/nimble-roulette-webapp/issues)

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

---

**🎰 Удачной игры в Nimble Roulette!** 🎰 