import React, { useEffect, useState } from 'react'
import RouletteGame from './components/RouletteGame'
import './App.css'

// Типы для Telegram Web App
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          isProgressVisible: boolean
          setText: (text: string) => void
          onClick: (callback: () => void) => void
          show: () => void
          hide: () => void
          enable: () => void
          disable: () => void
          showProgress: (leaveActive?: boolean) => void
          hideProgress: () => void
        }
        showAlert: (message: string, callback?: () => void) => void
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
        showPopup: (params: {
          title: string
          message: string
          buttons: Array<{
            id?: string
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
            text: string
          }>
        }, callback?: (buttonId: string) => void) => void
        sendData: (data: string) => void
        onEvent: (eventType: string, eventHandler: () => void) => void
        offEvent: (eventType: string, eventHandler: () => void) => void
        initData: string
        initDataUnsafe: {
          query_id?: string
          user?: {
            id: number
            is_bot?: boolean
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
            is_premium?: boolean
            added_to_attachment_menu?: boolean
            allows_write_to_pm?: boolean
            photo_url?: string
          }
          receiver?: {
            id: number
            is_bot?: boolean
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
            is_premium?: boolean
            added_to_attachment_menu?: boolean
            allows_write_to_pm?: boolean
            photo_url?: string
          }
          chat?: {
            id: number
            type: string
            title?: string
            username?: string
            photo_url?: string
          }
          chat_type?: string
          chat_instance?: string
          start_param?: string
          can_send_after?: number
          auth_date: number
          hash: string
        }
        colorScheme: 'light' | 'dark'
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
          secondary_bg_color?: string
        }
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        headerColor: string
        backgroundColor: string
        isClosingConfirmationEnabled: boolean
        BackButton: {
          isVisible: boolean
          onClick: (callback: () => void) => void
          show: () => void
          hide: () => void
        }
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }
        CloudStorage: {
          getItem: (key: string) => Promise<string | null>
          setItem: (key: string, value: string) => Promise<void>
          getItems: (keys: string[]) => Promise<Record<string, string | null>>
          removeItem: (key: string) => Promise<void>
          removeItems: (keys: string[]) => Promise<void>
        }
        version: string
        platform: string
      }
    }
  }
}

function App() {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    console.log('🚀 Инициализация приложения...')
    console.log('📍 URL:', window.location.href)
    console.log('🔍 User Agent:', navigator.userAgent)
    
    // Инициализация Telegram Web App
    if (window.Telegram?.WebApp) {
      console.log('✅ Telegram Web App SDK найден')
      const tg = window.Telegram.WebApp
      
      try {
        // Готовим приложение
        tg.ready()
        console.log('✅ tg.ready() выполнен')
        
        tg.expand()
        console.log('✅ tg.expand() выполнен')
        
        // Получаем данные пользователя
        if (tg.initDataUnsafe?.user) {
          setUser(tg.initDataUnsafe.user)
          console.log('✅ Данные пользователя получены:', tg.initDataUnsafe.user)
        } else {
          console.log('⚠️ Данные пользователя не найдены')
        }
        
        // Настраиваем главную кнопку
        tg.MainButton.setText('🎰 Играть в рулетку')
        tg.MainButton.show()
        console.log('✅ Главная кнопка настроена')
        
        // Обработчик нажатия главной кнопки
        tg.MainButton.onClick(() => {
          tg.HapticFeedback.impactOccurred('medium')
          console.log('🎮 Нажата главная кнопка')
        })
        
        setIsReady(true)
        
        console.log('🎉 Telegram Web App инициализирован:', {
          user: tg.initDataUnsafe?.user,
          platform: tg.platform,
          version: tg.version,
          colorScheme: tg.colorScheme,
          initData: tg.initData
        })
      } catch (error) {
        console.error('❌ Ошибка инициализации Telegram Web App:', error)
        setIsReady(true) // Все равно показываем приложение
      }
    } else {
      console.log('⚠️ Telegram Web App не найден, запуск в режиме разработки')
      console.log('🔍 window.Telegram:', window.Telegram)
      setIsReady(true)
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