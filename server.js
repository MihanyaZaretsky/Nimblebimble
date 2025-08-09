import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createServer as createViteServer } from 'vite'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(cors());

// --- API для веб-приложения ---

// API для проверки статуса платежа (заглушка)
app.get("/api/paymentStatus/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  
  res.json({ 
    success: true, 
    hasPaid: false, // Всегда false, так как бот отдельно
    paymentInfo: null,
    userId 
  });
});

// API для получения баланса (заглушка)
app.get("/api/balance/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  
  res.json({ 
    success: true, 
    balance: 0, // Всегда 0, так как бот отдельно
    userId 
  });
});

// API для создания ссылки на инвойс (заглушка)
app.post("/api/createInvoiceLink", async (req, res) => {
  const { payload, currency, prices } = req.body;
  
  console.log("🔵 Запрос на создание инвойса:", { payload, currency, prices });
  
  // Возвращаем ошибку, так как бот запущен отдельно
  res.status(503).json({ 
    success: false, 
    error: "Платежная система недоступна. Бот запущен отдельно на VDS." 
  });
});

// В продакшене обслуживаем статические файлы
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')))
  app.get('*', (req, res) => {
    // Отключаем кэширование index.html, чтобы Telegram Mini App не держал старую версию
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    res.set('Surrogate-Control', 'no-store')
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

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Веб-сервер запущен на порту ${PORT}`)
  console.log(`📱 URL: http://localhost:${PORT}`)
  console.log(`🌐 Timeweb URL: https://mihanyazaretsky-nimblebimble-120c.twc1.net`)
  console.log(`🤖 Бот: Запущен отдельно на VDS`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Получен SIGTERM, останавливаем веб-сервер...');
  server.close(() => {
    console.log('✅ Веб-сервер остановлен');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Получен SIGINT, останавливаем веб-сервер...');
  server.close(() => {
    console.log('✅ Веб-сервер остановлен');
    process.exit(0);
  });
}); 