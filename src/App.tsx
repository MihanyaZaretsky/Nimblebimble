import React, { useEffect, useState } from 'react'
import './App.css'
import { initGradientAnimations } from './gradientAnimations'
import { getTranslations } from './translations'
import { PaymentService } from './services/paymentService'
import { BalanceService } from './services/balanceService'
import { TonConnectUIProvider, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'

// Типы для Telegram Web App
declare global {
  interface Window {
  Telegram?: {
    WebApp: {
      ready: () => void
      sendData: (data: string) => void
      openInvoice?: (url: string) => void
      onEvent?: (eventType: string, eventHandler: (event: any) => void) => void
      offEvent?: (eventType: string, eventHandler: (event: any) => void) => void
      initDataUnsafe?: {
        user?: {
          id: number
          first_name: string
          username?: string
          photo_url?: string
        }
      }
    }
  }
}
}

// SVG иконки
const Icons = {
  diamond: () => (
    <svg width="16" height="16" viewBox="0 0 56 56" fill="none">
      <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0098EA"/>
      <path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z" fill="white"/>
    </svg>
  ),
  star: () => (
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z" fill="#FFD700"/>
    </svg>
  ),
  // Большие иконки для карточек оплаты
  diamondLarge: () => (
    <svg width="96" height="96" viewBox="0 0 56 56" fill="none">
      <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0098EA"/>
      <path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z" fill="white"/>
    </svg>
  ),
  starLarge: () => (
    <svg width="96" height="96" viewBox="0 0 14 15" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z" fill="#FFD700"/>
    </svg>
  ),
  connect: () => (
    <svg width="14" height="14" viewBox="0 0 334.877 334.877" fill="currentColor">
      <path d="M333.196,155.999h-16.067V82.09c0-17.719-14.415-32.134-32.134-32.134h-21.761L240.965,9.917
		C237.571,3.798,231.112,0,224.107,0c-3.265,0-6.504,0.842-9.364,2.429l-85.464,47.526H33.815
		c-17.719,0-32.134,14.415-32.134,32.134v220.653c0,17.719,14.415,32.134,32.134,32.134h251.18
		c17.719,0,32.134-14.415,32.134-32.134v-64.802h16.067V155.999z M284.995,62.809c9.897,0,17.982,7.519,19.068,17.14h-24.152
		l-9.525-17.14H284.995z M220.996,13.663c3.014-1.69,7.07-0.508,8.734,2.494l35.476,63.786H101.798L220.996,13.663z
		 M304.275,302.742c0,10.63-8.651,19.281-19.281,19.281H33.815c-10.63,0-19.281-8.651-19.281-19.281V82.09
		c0-10.63,8.651-19.281,19.281-19.281h72.353L75.345,79.95H37.832c-3.554,0-6.427,2.879-6.427,6.427s2.873,6.427,6.427,6.427h14.396
		h234.83h17.217v63.201h-46.999c-21.826,0-39.589,17.764-39.589,39.589v2.764c0,21.826,17.764,39.589,39.589,39.589h46.999V302.742z
		 M320.342,225.087h-3.213h-59.853c-14.743,0-26.736-11.992-26.736-26.736v-2.764c0-14.743,11.992-26.736,26.736-26.736h59.853
		h3.213V225.087z M276.961,197.497c0,7.841-6.35,14.19-14.19,14.19c-7.841,0-14.19-6.35-14.19-14.19s6.35-14.19,14.19-14.19
		C270.612,183.306,276.961,189.662,276.961,197.497z"/>
    </svg>
  ),
  home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
    </svg>
  ),
  cases: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
      <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H14V17H7V15Z"/>
    </svg>
  ),
  plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
    </svg>
  ),
  upgrade: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z"/>
    </svg>
  ),
  profile: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
    </svg>
  ),
  box: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
      <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H14V17H7V15Z"/>
    </svg>
  ),
  wallet: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 18V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V18ZM12 16C13.66 16 15 14.66 15 13C15 11.34 13.66 10 12 10C10.34 10 9 11.34 9 13C9 14.66 10.34 16 12 16Z"/>
    </svg>
  ),
  money: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H9V13H11V11H9V9H11V7H13V9H15V11H13V13H15V15H13V17Z"/>
    </svg>
  ),
  globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z"/>
    </svg>
  ),
  close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
    </svg>
  ),
  menu: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"/>
    </svg>
  )
}

// Компонент для кнопки кошелька в верхней плашке
const WalletButton = ({ t, setActiveTab }: { t: any, setActiveTab: (tab: string) => void }) => {
  const address = useTonAddress()

  const handleClick = () => {
    setActiveTab('profile')
  }

  return (
    <button className="connect-btn" onClick={handleClick}>
      <span className="btn-icon">
        <Icons.connect />
      </span>
      <span>
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : t.connectWallet}
      </span>
    </button>
  )
}

// Компоненты для разных вкладок
const HomeTab = ({ user, t, setActiveTab }: { user: any, t: any, setActiveTab: (tab: string) => void }) => {
  const handleChannelClick = () => {
    window.open('https://t.me/nimble_roulette', '_blank')
  }

  return (
    <div className="tab-content">
      <div className="welcome-box">
        <h2>{t.welcome}</h2>
        <p>{t.welcomeSubtitle}</p>
      </div>
      
      <div className="action-buttons">
        <button className="action-btn" onClick={() => setActiveTab('cases')}>
          <span className="btn-icon">
            <Icons.box />
          </span>
          <span>{t.openCase}</span>
        </button>
        <button className="action-btn topup-home-btn" onClick={() => setActiveTab('topup')}>
          <span className="btn-icon">
            <Icons.plus />
          </span>
          <span>{t.topUp}</span>
        </button>
      </div>
      
      {/* Секция канала */}
      <div className="channel-section">
        <h3 className="channel-title">{t.subscribeChannel}</h3>
        <div className="channel-card" onClick={handleChannelClick}>
          {/* Текст внутри плашки удален по запросу пользователя */}
        </div>
      </div>
    </div>
  )
}

const CasesTab = ({ t }: { t: any }) => (
  <div className="tab-content">
    <h2 className="section-title">{t.cases}</h2>
    
    <div className="cases-grid">
      <div className="case-card">
        <div className="case-icon">
          <Icons.box />
        </div>
        <h3>{t.commonCase}</h3>
        <p>{t.price}: 100 <Icons.money /></p>
        <button className="open-btn">{t.open}</button>
      </div>
      
      <div className="case-card">
        <div className="case-icon">
          <Icons.box />
        </div>
        <h3>{t.rareCase}</h3>
        <p>{t.price}: 500 <Icons.money /></p>
        <button className="open-btn">{t.open}</button>
      </div>
      
      <div className="case-card">
        <div className="case-icon">
          <Icons.box />
        </div>
        <h3>{t.epicCase}</h3>
        <p>{t.price}: 1000 <Icons.money /></p>
        <button className="open-btn">{t.open}</button>
      </div>
      
      <div className="case-card">
        <div className="case-icon">
          <Icons.box />
        </div>
        <h3>{t.legendaryCase}</h3>
        <p>{t.price}: 5000 <Icons.money /></p>
        <button className="open-btn">{t.open}</button>
      </div>
    </div>
  </div>
)

const TopUpTab = ({ t, user, onBalanceUpdate }: { t: any, user: any, onBalanceUpdate?: () => void }) => {
  const [amount, setAmount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'ton' | 'stars'>('stars')
  const [tonConnectUI] = useTonConnectUI()
  const address = useTonAddress()

  // Сбрасываем значение при смене метода оплаты
  useEffect(() => {
    if (selectedPaymentMethod === 'stars') {
      setAmount(1)
    } else {
      setAmount(0.01)
    }
  }, [selectedPaymentMethod])

  const handlePayment = async () => {
    console.log('🔵 Начинаем платеж:', { user: user?.id, amount, selectedMethod: selectedPaymentMethod })
    
    if (!user?.id) {
      setError('Пользователь не найден')
      return
    }

    // Проверка минимальной суммы для TON
    if (selectedPaymentMethod === 'ton' && amount < 0.01) {
      setError('Минимальная сумма для TON платежа: 0.01')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      if (selectedPaymentMethod === 'stars') {
        console.log('🔵 Вызываем PaymentService.processStarsPayment...')
        const response = await PaymentService.processStarsPayment(amount, user.id)
        console.log('🔵 Ответ от PaymentService:', response)
        
        if (response.success && response.invoice_url) {
          console.log('🔵 Открываем инвойс:', response.invoice_url)
          
          // Добавляем обработчик события закрытия инвойса
          const handleInvoiceClosed = (event: any) => {
            console.log('🔵 Событие invoiceClosed:', event)
            if (event.status === 'paid') {
              console.log('✅ Платеж успешно оплачен, обновляем баланс')
              // Обновляем баланс после успешной оплаты звездами
              if (onBalanceUpdate) {
                onBalanceUpdate()
              }
            }
            // Удаляем обработчик после использования
            if (window.Telegram?.WebApp?.offEvent) {
              window.Telegram.WebApp.offEvent('invoiceClosed', handleInvoiceClosed)
            }
          }
          
          // Подписываемся на событие закрытия инвойса
          if (window.Telegram?.WebApp?.onEvent) {
            window.Telegram.WebApp.onEvent('invoiceClosed', handleInvoiceClosed)
          }
          
          // Отправляем данные в Telegram Web App
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.sendData(JSON.stringify({
              action: 'payment_initiated',
              method: 'stars',
              amount: amount,
              userId: user.id
            }))
          }
          
          // Открываем инвойс через Telegram API
          if (window.Telegram?.WebApp?.openInvoice) {
            window.Telegram.WebApp.openInvoice(response.invoice_url)
          } else {
            // Fallback для старых версий
            window.open(response.invoice_url, '_blank')
          }
        } else {
          console.error('🔴 Ошибка в ответе:', response.error)
          setError(response.error || 'Ошибка создания платежа')
        }
      } else {
        // Для TON платежей
        if (!address) {
          setError('Сначала подключите TON кошелек')
          return
        }

        try {
          // Генерируем уникальное мемо для идентификации платежа
          const memo = `nimble_${user.id}_${Date.now()}`
          
          // Создаем транзакцию для пополнения баланса
          const transaction = {
            validUntil: Date.now() + 5 * 60 * 1000, // 5 минут
            messages: [
              {
                address: "UQBimhjgyaNdL7tNkvQF26T8llmevqau32tS2opyypF5U_z-", // Адрес для приема TON платежей
                amount: (amount * 1000000000).toString(), // Конвертируем в nanotons
                stateInit: undefined,
                payload: memo // Добавляем мемо в транзакцию
              },
            ],
          }

          console.log('🔵 Отправляем TON транзакцию:', transaction)
          
          // Отправляем транзакцию
          await tonConnectUI.sendTransaction(transaction)
          console.log('🔵 TON транзакция отправлена')
          
          // Показываем пользователю, что транзакция отправлена
          setError('Транзакция отправлена. Ожидаем подтверждения...')
          
          // Для простоты пока просто обновляем баланс
          // В будущем здесь будет проверка через TON Center API
          try {
            const balanceResponse = await BalanceService.updateBalance({
              user_id: user.id,
              currency: 'TON',
              amount: amount
            })
            
            if (balanceResponse.success) {
              console.log('✅ Баланс обновлен:', balanceResponse.balance)
              setError('')
              // Обновляем баланс в интерфейсе
              if (onBalanceUpdate) {
                onBalanceUpdate()
              }
            } else {
              console.error('❌ Ошибка обновления баланса:', balanceResponse.error)
              setError('Ошибка обновления баланса')
            }
          } catch (err) {
            console.error('❌ Ошибка обновления баланса:', err)
            setError('Ошибка обновления баланса')
          }
          
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.sendData(JSON.stringify({
              action: 'payment_initiated',
              method: 'ton',
              amount: amount,
              userId: user.id
            }))
          }
        } catch (err) {
          console.error('Ошибка TON транзакции:', err)
          setError('Ошибка отправки TON транзакции')
        }
      }
    } catch (err) {
      console.error('🔴 Ошибка в handlePayment:', err)
      setError('Ошибка сети')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="tab-content">
      <div className="topup-header">
        <span className="header-icon">
          <Icons.wallet />
        </span>
        <span>{t.topUpBalance}</span>
      </div>
      
      <div className="payment-methods">
        <div 
          className={`payment-card ton-card ${selectedPaymentMethod === 'ton' ? 'selected' : ''}`}
          onClick={() => setSelectedPaymentMethod('ton')}
        >
          <div className="payment-icon">
            <Icons.diamondLarge />
          </div>
          <h3>TON</h3>
          <p>{t.fastAndSecure}</p>
        </div>
        
        <div 
          className={`payment-card stars-card ${selectedPaymentMethod === 'stars' ? 'selected' : ''}`}
          onClick={() => setSelectedPaymentMethod('stars')}
        >
          <div className="payment-icon">
            <Icons.starLarge />
          </div>
          <h3>Звёзды</h3>
          <p>{t.starsPayment}</p>
        </div>
      </div>
      
             <div className="amount-input">
         <input 
           type="number" 
                       placeholder="" 
            value={amount}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0
              if (selectedPaymentMethod === 'stars') {
                // Для звезд только целые числа, минимум 1
                setAmount(Math.max(1, Math.floor(value)))
              } else {
                // Для TON можно дробные числа, без ограничений в поле
                setAmount(value)
              }
            }}
            min={selectedPaymentMethod === 'stars' ? '1' : ''}
            step={selectedPaymentMethod === 'stars' ? '1' : '0.001'}
         />
       </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        className={`topup-btn ${isLoading ? 'loading' : ''}`}
        onClick={handlePayment}
        disabled={isLoading}
      >
        <span className="btn-icon">
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            <Icons.plus />
          )}
        </span>
        <span>{isLoading ? 'Обработка...' : t.topUp}</span>
      </button>
    </div>
  )
}

const UpgradeTab = ({ t }: { t: any }) => (
  <div className="tab-content">
    <h2 className="section-title">{t.upgrades}</h2>
    <p className="coming-soon">{t.comingSoon}</p>
  </div>
)

const ProfileTab = ({ user, t, language, setLanguage, balance }: { user: any, t: any, language: string, setLanguage: (lang: string) => void, balance: any }) => {
  const [tonConnectUI] = useTonConnectUI()
  const address = useTonAddress()

  const handleConnectWallet = () => {
    if (address) {
      // Если кошелек уже подключен, отключаем
      tonConnectUI.disconnect()
    } else {
      // Если не подключен, открываем модальное окно
      tonConnectUI.openModal()
    }
  }

  return (
  <div className="tab-content">
    <div className="profile-section">
      <div className="profile-avatar">
        {user?.photo_url ? (
          <img src={user.photo_url} alt="Profile" />
        ) : (
          <div className="default-avatar">
            <Icons.profile />
          </div>
        )}
      </div>
      
      <h2 className="username">{user?.first_name || t.user}</h2>
      <p className="user-handle">@{user?.username || t.username}</p>
      <p className="user-id">ID: {user?.id || '0000000000'}</p>
    </div>
    
         <div className="stats-grid">
       <div className="stat-card">
         <h3>{t.balance}</h3>
         <p>{balance.ton.toFixed(2)} <Icons.diamond /></p>
       </div>
       <div className="stat-card">
         <h3>Звезды</h3>
         <p>{balance.stars} <Icons.star /></p>
       </div>
     </div>
    
    {/* Секция кошелька */}
    <div className="wallet-section">
      <div className="wallet-info">
        {address ? (
          <div className="connected-wallet">
            <div className="wallet-address">
              <span className="address-label">Адрес кошелька:</span>
              <span className="address-value">{address}</span>
            </div>
            <button className="disconnect-btn" onClick={handleConnectWallet}>
              <Icons.connect />
              Отключить кошелек
            </button>
          </div>
        ) : (
          <button className="connect-wallet-btn" onClick={handleConnectWallet}>
            <Icons.connect />
            {t.connectWallet}
          </button>
        )}
      </div>
    </div>
    
    <div className="language-section">
      <h3>{t.language}</h3>
      <div className="language-buttons">
        <button 
          className={`lang-btn ${language === 'ru' ? 'active' : ''}`}
          onClick={() => setLanguage('ru')}
        >
          <Icons.globe />
          Русский
        </button>
        <button 
          className={`lang-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
        >
          <Icons.globe />
          English
        </button>
      </div>
    </div>
  </div>
  )
}

function AppContent() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('home')
  const [balance, setBalance] = useState({ ton: 0, stars: 0 })
  const [language, setLanguage] = useState('ru')
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const address = useTonAddress()
  
  // Получаем переводы для текущего языка
  const t = getTranslations(language)

  useEffect(() => {
    console.log('🚀 Запуск приложения...')
    
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
          
          // Загружаем баланс пользователя
          loadUserBalance(tgUser.id)
        }
        
      } catch (error) {
        console.error('❌ Ошибка инициализации Telegram:', error)
      }
    } else {
      console.log('🌐 Запущено в браузере')
    }

    // Инициализируем плавные анимации градиентов
    setTimeout(() => {
      console.log('🚀 Запуск анимаций градиентов...')
      initGradientAnimations()
    }, 500)
  }, [])

  // Функция загрузки баланса пользователя
  const loadUserBalance = async (userId: number) => {
    try {
      console.log('💰 Загружаем баланс пользователя:', userId)
      const response = await BalanceService.getUserBalance(userId)
      
      if (response.success && response.balance) {
        setBalance(response.balance)
        console.log('✅ Баланс загружен:', response.balance)
      } else {
        console.error('❌ Ошибка загрузки баланса:', response.error)
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки баланса:', error)
    }
  }

  const getTabContainerClass = () => {
    switch (activeTab) {
      case 'home':
        return 'slide-home'
      case 'cases':
        return 'slide-cases'
      case 'topup':
        return 'slide-topup'
      case 'upgrade':
        return 'slide-upgrade'
      case 'profile':
        return 'slide-profile'
      default:
        return 'slide-home'
    }
  }

  const handleProfileClick = () => {
    setActiveTab('profile')
  }

  // Функции для свайпа
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      // Свайп влево - следующая вкладка
      switch (activeTab) {
        case 'home':
          setActiveTab('cases')
          break
        case 'cases':
          setActiveTab('topup')
          break
        case 'topup':
          setActiveTab('upgrade')
          break
        case 'upgrade':
          setActiveTab('profile')
          break
      }
    }
    
    if (isRightSwipe) {
      // Свайп вправо - предыдущая вкладка
      switch (activeTab) {
        case 'cases':
          setActiveTab('home')
          break
        case 'topup':
          setActiveTab('cases')
          break
        case 'upgrade':
          setActiveTab('topup')
          break
        case 'profile':
          setActiveTab('upgrade')
          break
      }
    }
  }

  return (
    <div className="app">
      {/* Balance Bar */}
      <div className="balance-bar">
        <div className="balance-item">
          <span className="balance-icon">
            <Icons.diamond />
          </span>
          <span className="balance-amount">{balance.ton.toFixed(2)}</span>
        </div>
        <div className="balance-item">
          <span className="balance-icon">
            <Icons.star />
          </span>
          <span className="balance-amount">{balance.stars}</span>
        </div>
        <WalletButton t={t} setActiveTab={setActiveTab} />
        <div className="user-avatar" onClick={handleProfileClick}>
          {user?.photo_url ? (
            <img src={user.photo_url} alt="Avatar" />
          ) : (
            <div className="default-avatar">
              <Icons.profile />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div 
          className={`tab-container ${getTabContainerClass()}`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <HomeTab user={user} t={t} setActiveTab={setActiveTab} />
          <CasesTab t={t} />
                     <TopUpTab t={t} user={user} onBalanceUpdate={() => loadUserBalance(user.id)} />
          <UpgradeTab t={t} />
                     <ProfileTab user={user} t={t} language={language} setLanguage={setLanguage} balance={balance} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button 
          className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <span className="nav-icon">
            <Icons.home />
          </span>
          <span>{t.home}</span>
        </button>
        
        <button 
          className={`nav-btn ${activeTab === 'cases' ? 'active' : ''}`}
          onClick={() => setActiveTab('cases')}
        >
          <span className="nav-icon">
            <Icons.cases />
          </span>
          <span>{t.cases}</span>
        </button>
        
        <button 
          className={`nav-btn primary ${activeTab === 'topup' ? 'active' : ''}`}
          onClick={() => setActiveTab('topup')}
        >
          <span className="nav-icon">
            <Icons.plus />
          </span>
          <span>{t.topUp}</span>
        </button>
        
        <button 
          className={`nav-btn ${activeTab === 'upgrade' ? 'active' : ''}`}
          onClick={() => setActiveTab('upgrade')}
        >
          <span className="nav-icon">
            <Icons.upgrade />
          </span>
          <span>{t.upgrade}</span>
        </button>
        
        <button 
          className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="nav-icon">
            <Icons.profile />
          </span>
          <span>{t.profile}</span>
        </button>
      </div>
    </div>
  )
}

// Основной компонент с TonConnectUIProvider
function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://nimblebimble.onrender.com/tonconnect-manifest.json">
      <AppContent />
    </TonConnectUIProvider>
  )
}

export default App 