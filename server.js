import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createServer as createViteServer } from 'vite'
import TelegramBot from 'node-telegram-bot-api'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// --- Платёжный функционал ---
const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN || '8312865169:AAHmI2FODLlt4Qcf2rr6MtRbUcB8fGtlLoU';

if (!TELEGRAM_BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден в переменных окружения!');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);
const paidUsers = new Map();

app.use(express.json());
app.use(cors());

// Обработчик предварительной проверки платежа
bot.on("pre_checkout_query", (query) => {
  console.log("🔍 Предварительная проверка платежа:", query.id);
  bot.answerPreCheckoutQuery(query.id, true).catch((error) => {
    console.error("❌ Ошибка answerPreCheckoutQuery:", error);
  });
});

// Обработчик команд
bot.on("message", (msg) => {
  // Обработка команды /start
  if (msg.text === '/start') {
    console.log(`🎯 Команда /start от пользователя: ${msg.from.first_name} (ID: ${msg.from.id})`);
    
    const welcomeMessage = `🎰 Добро пожаловать в Nimble Roulette!\n\n` +
      `🎮 Нажмите кнопку ниже, чтобы начать игру:\n\n` +
      `💰 Пополняйте баланс Stars и выигрывайте!`;
    
    const keyboard = {
      inline_keyboard: [[
        {
          text: '🎮 Открыть игру',
          web_app: { url: 'https://nimblebimble.onrender.com' }
        }
      ]]
    };
    
    bot.sendMessage(msg.chat.id, welcomeMessage, { reply_markup: keyboard })
      .then(() => {
        console.log(`✅ Приветственное сообщение отправлено пользователю ${msg.from.first_name}`);
      })
      .catch(error => {
        console.error("❌ Ошибка отправки приветственного сообщения:", error);
      });
  }
  
  // Обработка успешных платежей
  if (msg.successful_payment) {
    const userId = msg.from.id;
    const payment = msg.successful_payment;
    
    console.log(`✅ Успешный платеж для пользователя ${userId}:`, payment);
    
    // Сохраняем информацию о платеже
    paidUsers.set(userId, {
      chargeId: payment.telegram_payment_charge_id,
      amount: payment.total_amount,
      currency: payment.currency,
      timestamp: Date.now()
    });
    
    // Отправляем уведомление пользователю
    bot.sendMessage(msg.chat.id, 
      `🎉 Платеж успешно завершен!\n\n` +
      `💰 Сумма: ${payment.total_amount / 100} ${payment.currency}\n` +
      `💳 ID платежа: ${payment.telegram_payment_charge_id}\n\n` +
      `Ваш баланс обновлен! Можете продолжать игру.`
    ).catch(error => {
      console.error("❌ Ошибка отправки сообщения:", error);
    });
  }
});

// API для создания ссылки на инвойс
app.post("/api/createInvoiceLink", async (req, res) => {
  const { payload, currency, prices } = req.body;
  
  console.log("🔵 Создание инвойса:", { payload, currency, prices });
  
  if (!payload || !currency || !prices || !(prices[0] && prices[0].amount)) {
    return res
      .status(400)
      .json({ success: false, error: "Отсутствуют обязательные параметры." });
  }
  
  const price = prices[0].amount;
  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ success: false, error: "Неверная цена." });
  }
  
  const title = `Пополнение баланса на ${price} Stars`;
  const description = `Покупка Stars для пополнения баланса на ${price} единиц.`;
  const label = `Пополнение на ${price} ${currency}`;
  
  try {
    // Для Telegram Stars используем встроенную систему
    const invoiceLink = await bot.createInvoiceLink(
      title,
      description,
      payload,
      TELEGRAM_BOT_TOKEN, // Используем токен бота для Stars
      currency,
      [{ label, amount: price }]
    );
    
    console.log("✅ Инвойс создан:", invoiceLink);
    res.json({ success: true, invoiceLink });
  } catch (error) {
    console.error("❌ Ошибка создания ссылки на инвойс:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API для проверки статуса платежа
app.get("/api/paymentStatus/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const paymentInfo = paidUsers.get(userId);
  
  res.json({ 
    success: true, 
    hasPaid: !!paymentInfo,
    paymentInfo: paymentInfo || null,
    userId 
  });
});

// API для получения баланса
app.get("/api/balance/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const paymentInfo = paidUsers.get(userId);
  
  // Простая логика: если пользователь платил, даем 1000 Stars
  const balance = paymentInfo ? 1000 : 0;
  
  res.json({ 
    success: true, 
    balance,
    userId 
  });
});

// Запуск бота
bot.startPolling();
console.log("🤖 Telegram бот запущен");

// --- Конец платёжного функционала ---

// В продакшене обслуживаем статические файлы
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')))
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'))
  })
} else {
  // В разработке используем Vite dev server
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  })
  app.use(vite.middlewares)
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`)
  console.log(`📱 URL: http://localhost:${PORT}`)
  console.log(`🤖 Бот токен: ${TELEGRAM_BOT_TOKEN ? '✅ Настроен' : '❌ Не настроен'}`)
  console.log(`💳 Telegram Stars: ✅ Встроенная система`)
}) 