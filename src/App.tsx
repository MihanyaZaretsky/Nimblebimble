import React, { useEffect, useState } from 'react'
import RouletteGame from './components/RouletteGame'
import './App.css'

// Типы для Telegram Web App
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        initDataUnsafe?: {
          user?: {
            id: number
            first_name: string
            username?: string
          }
        }
      }
    }
  }
}

function App() {
  const [user, setUser] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    console.log('🚀 Запуск приложения...')
    console.log('📍 URL:', window.location.href)
    console.log('🔍 User Agent:', navigator.userAgent)
    
    // Проверяем, запущено ли в Telegram
    const isTelegram = window.Telegram && window.Telegram.WebApp
    console.log('📱 Запущено в Telegram:', !!isTelegram)
    
    if (isTelegram) {
      try {
        // Инициализируем Telegram Web App
        window.Telegram.WebApp.ready()
        console.log('✅ Telegram Web App готов')
        
        // Получаем данные пользователя
        const tgUser = window.Telegram.WebApp.initDataUnsafe?.user
        if (tgUser) {
          setUser(tgUser)
          console.log('✅ Пользователь Telegram:', tgUser)
        }
        
      } catch (error) {
        console.error('❌ Ошибка инициализации Telegram:', error)
      }
    } else {
      console.log('🌐 Запущено в браузере')
    }
    
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <RouletteGame user={user} />
    </div>
  )
}

export default App 