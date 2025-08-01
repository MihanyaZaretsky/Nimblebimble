const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const cors = require("cors");
const app = express();
const port = process.env.PAYMENT_PORT || 3001;

require("dotenv").config();

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN || '8312865169:AAHmI2FODLlt4Qcf2rr6MtRbUcB8fGtlLoU';
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

// Map для отслеживания платежей
const paidUsers = new Map();

app.use(express.json());
app.use(cors());

// Обработка pre-checkout запросов
bot.on("pre_checkout_query", (query) => {
  bot.answerPreCheckoutQuery(query.id, true).catch(() => {
    console.error("answerPreCheckoutQuery failed");
  });
});

// Обработка успешных платежей
bot.on("message", (msg) => {
  if (msg.successful_payment) {
    const userId = msg.from.id;
    paidUsers.set(userId, msg.successful_payment.telegram_payment_charge_id);
    console.log(`✅ Платеж успешен для пользователя ${userId}`);
  }
});

// Команда /status для проверки статуса платежа
bot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const message = paidUsers.has(userId) ? "Вы уже оплатили" : "Вы еще не оплатили";
  bot.sendMessage(chatId, message);
});

// Команда /refund для возврата Stars
bot.onText(/\/refund/, async (msg) => {
  const userId = msg.from.id;
  if (!paidUsers.has(userId)) {
    return bot.sendMessage(
      msg.chat.id,
      "Вы еще не оплатили, нечего возвращать."
    );
  }
  
  const chargeId = paidUsers.get(userId);
  try {
    const form = {
      user_id: userId,
      telegram_payment_charge_id: chargeId,
    };
    
    const refundResponse = await bot._request("refundStarPayment", { form });
    
    if (refundResponse) {
      paidUsers.delete(userId);
      bot.sendMessage(msg.chat.id, "Ваш платеж был возвращен.");
    } else {
      bot.sendMessage(msg.chat.id, "Возврат не удался. Попробуйте позже.");
    }
  } catch (error) {
    console.error("Ошибка возврата:", error);
    bot.sendMessage(msg.chat.id, "Возврат не удался. Попробуйте позже.");
  }
});

// API для создания ссылки на инвойс
app.post("/api/createInvoiceLink", async (req, res) => {
  const { payload, currency, prices } = req.body;
  
  // Проверка обязательных полей
  if (!payload || !currency || !prices || !(prices[0] && prices[0].amount)) {
    return res
      .status(400)
      .json({ success: false, error: "Отсутствуют обязательные параметры." });
  }
  
  const price = prices[0].amount;
  
  // Валидация цены
  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ success: false, error: "Неверная цена." });
  }
  
  // Динамически устанавливаем заголовок, описание и метку на основе цены
  const title = `Пополнение баланса на ${price} Stars`;
  const description = `Покупка Stars для пополнения баланса на ${price} единиц.`;
  const label = `Пополнение на ${price} ${currency}`;
  
  try {
    // Создаем ссылку на инвойс используя Telegram Bot API
    const invoiceLink = await bot.createInvoiceLink(
      title,
      description,
      payload,
      TELEGRAM_BOT_TOKEN,
      currency,
      [{ label, amount: price }]
    );
    
    res.json({ success: true, invoiceLink });
  } catch (error) {
    console.error("Ошибка создания ссылки на инвойс:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API для проверки статуса платежа пользователя
app.get("/api/paymentStatus/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const hasPaid = paidUsers.has(userId);
  
  res.json({ 
    success: true, 
    hasPaid,
    userId 
  });
});

// API для получения баланса пользователя (заглушка)
app.get("/api/balance/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  // Здесь можно добавить логику получения баланса из базы данных
  const balance = paidUsers.has(userId) ? 1000 : 0; // Пример
  
  res.json({ 
    success: true, 
    balance,
    userId 
  });
});

// Запуск бота
bot.startPolling();

// Запуск сервера
app.listen(port, () => {
  console.log(`💳 Платежный сервер запущен на порту ${port}`);
  console.log(`🔗 URL: http://localhost:${port}`);
}); 