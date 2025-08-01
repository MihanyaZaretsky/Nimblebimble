import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createServer as createViteServer } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// В продакшене обслуживаем статические файлы
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')))
  app.use('/public', express.static(join(__dirname, 'public')))
  
  // Тестовая страница
  app.get('/test', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'test.html'))
  })
  
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
  console.log(`🧪 Тестовая страница: http://localhost:${PORT}/test`)
}) 