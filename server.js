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
}) 