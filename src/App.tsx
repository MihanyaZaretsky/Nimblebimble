import React, { useEffect, useState } from 'react'
import { init, useLaunchParams, mainButton } from '@telegram-apps/sdk-react'
import RouletteGame from './components/RouletteGame'
import './App.css'

function App() {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Получаем параметры запуска
  const launchParams = useLaunchParams()

  useEffect(() => {
    console.log('🚀 Инициализация приложения...')
    console.log('📍 URL:', window.location.href)
    console.log('🔍 User Agent:', navigator.userAgent)
    
    try {
      // Инициализируем Telegram Web App SDK
      init()
      console.log('✅ Telegram Web App SDK инициализирован')
      
      // Монтируем главную кнопку перед использованием
      mainButton.mount()
      console.log('✅ Главная кнопка смонтирована')
      
      // Настраиваем главную кнопку (проверяем доступность)
      if (mainButton.setText && mainButton.setText.isAvailable()) {
        mainButton.setText('🎰 Играть в рулетку')
      }
      
      if (mainButton.show && mainButton.show.isAvailable()) {
        mainButton.show()
      }
      console.log('✅ Главная кнопка настроена')
      
      // Обработчик нажатия главной кнопки
      if (mainButton.onClick && mainButton.onClick.isAvailable()) {
        mainButton.onClick(() => {
          console.log('🎮 Нажата главная кнопка')
          // Здесь будет логика запуска игры
        })
      }
      
      // Получаем данные пользователя из параметров запуска
      if (launchParams?.tgWebAppData?.user) {
        setUser(launchParams.tgWebAppData.user)
        console.log('✅ Данные пользователя получены:', launchParams.tgWebAppData.user)
      } else {
        console.log('⚠️ Данные пользователя не найдены')
      }
      
      setIsReady(true)
      
      console.log('🎉 Приложение инициализировано:', {
        launchParams,
        user: launchParams?.tgWebAppData?.user,
        platform: launchParams?.tgWebAppPlatform,
        version: launchParams?.tgWebAppVersion
      })
      
    } catch (error) {
      console.error('❌ Ошибка инициализации:', error)
      setIsReady(true) // Все равно показываем приложение
    }
  }, [launchParams])

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