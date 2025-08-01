import React, { useEffect, useState } from 'react'
import { init } from '@telegram-apps/sdk-react'
import RouletteGame from './components/RouletteGame'
import './App.css'

function App() {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    console.log('🚀 Инициализация приложения...')
    console.log('📍 URL:', window.location.href)
    console.log('🔍 User Agent:', navigator.userAgent)
    
    // Таймаут для показа контента даже если инициализация не удалась
    const timeout = setTimeout(() => {
      console.log('⏰ Таймаут инициализации - показываем приложение')
      setIsReady(true)
    }, 3000)
    
    try {
      // Инициализируем Telegram Web App SDK
      init()
      console.log('✅ Telegram Web App SDK инициализирован')
      
      // Пытаемся получить данные пользователя из URL параметров
      const urlParams = new URLSearchParams(window.location.search)
      const userData = urlParams.get('tgWebAppData')
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(userData))
          setUser(parsedUser.user)
          console.log('✅ Данные пользователя получены из URL:', parsedUser.user)
        } catch (e) {
          console.log('⚠️ Не удалось распарсить данные пользователя')
        }
      } else {
        console.log('⚠️ Данные пользователя не найдены в URL')
      }
      
      clearTimeout(timeout)
      setIsReady(true)
      console.log('🎉 Приложение инициализировано')
      
    } catch (error) {
      console.error('❌ Ошибка инициализации:', error)
      clearTimeout(timeout)
      setIsReady(true) // Все равно показываем приложение
    }
  }, [])

  if (!isReady) {
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