import React, { useEffect, useState } from 'react'
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
            photo_url?: string
          }
        }
      }
    }
  }
}

// Компоненты для разных вкладок
const HomeTab = ({ user }: { user: any }) => (
  <div className="tab-content">
    <div className="welcome-box">
      <h2>Добро пожаловать!</h2>
      <p>Выберите действие для начала игры</p>
    </div>
    
    <div className="action-buttons">
      <button className="action-btn">
        <span className="btn-icon">📦</span>
        <span>Открыть кейс</span>
      </button>
      <button className="action-btn">
        <span className="btn-icon">💎</span>
        <span>Пополнить</span>
      </button>
    </div>
  </div>
)

const CasesTab = () => (
  <div className="tab-content">
    <h2 className="section-title">Кейсы</h2>
    
    <div className="cases-grid">
      <div className="case-card">
        <div className="case-icon">🟢</div>
        <h3>Обычный кейс</h3>
        <p>Цена: 100 💰</p>
        <button className="open-btn">Открыть</button>
      </div>
      
      <div className="case-card">
        <div className="case-icon">🔵</div>
        <h3>Редкий кейс</h3>
        <p>Цена: 500 💰</p>
        <button className="open-btn">Открыть</button>
      </div>
      
      <div className="case-card">
        <div className="case-icon">🟣</div>
        <h3>Эпический кейс</h3>
        <p>Цена: 1000 💰</p>
        <button className="open-btn">Открыть</button>
      </div>
      
      <div className="case-card">
        <div className="case-icon">🟠</div>
        <h3>Легендарный кейс</h3>
        <p>Цена: 5000 💰</p>
        <button className="open-btn">Открыть</button>
      </div>
    </div>
  </div>
)

const TopUpTab = () => (
  <div className="tab-content">
    <div className="topup-header">
      <span className="header-icon">💰</span>
      <span>Пополнить баланс</span>
    </div>
    
    <div className="payment-methods">
      <div className="payment-card">
        <div className="payment-icon">💎</div>
        <h3>TON</h3>
        <p>Быстро и безопасно</p>
      </div>
      
      <div className="payment-card">
        <div className="payment-icon">⭐</div>
        <h3>Звёзды</h3>
        <p>Пополнение через Звёзды</p>
      </div>
    </div>
    
    <div className="amount-input">
      <input type="number" placeholder="1" defaultValue="1" />
    </div>
    
    <button className="topup-btn">
      <span className="btn-icon">➕</span>
      <span>Пополнить</span>
    </button>
  </div>
)

const UpgradeTab = () => (
  <div className="tab-content">
    <h2 className="section-title">Улучшения</h2>
    <p className="coming-soon">Скоро здесь будут доступны улучшения</p>
  </div>
)

const ProfileTab = ({ user }: { user: any }) => (
  <div className="tab-content">
    <div className="profile-section">
      <div className="profile-avatar">
        {user?.photo_url ? (
          <img src={user.photo_url} alt="Profile" />
        ) : (
          <div className="default-avatar">👤</div>
        )}
      </div>
      
      <h2 className="username">{user?.first_name || 'Пользователь'}</h2>
      <p className="user-handle">@{user?.username || 'username'}</p>
      <p className="user-id">ID: {user?.id || '0000000000'}</p>
    </div>
    
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Баланс</h3>
        <p>0.00 💎</p>
      </div>
      <div className="stat-card">
        <h3>Открыто кейсов</h3>
        <p>0 📦</p>
      </div>
    </div>
    
    <div className="language-section">
      <h3>Язык</h3>
      <div className="language-buttons">
        <button className="lang-btn active">🌐 Русский</button>
        <button className="lang-btn">🌐 English</button>
      </div>
    </div>
  </div>
)

function App() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('home')
  const [balance, setBalance] = useState({ ton: 0, stars: 0 })

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
        }
        
      } catch (error) {
        console.error('❌ Ошибка инициализации Telegram:', error)
      }
    } else {
      console.log('🌐 Запущено в браузере')
    }
  }, [])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab user={user} />
      case 'cases':
        return <CasesTab />
      case 'topup':
        return <TopUpTab />
      case 'upgrade':
        return <UpgradeTab />
      case 'profile':
        return <ProfileTab user={user} />
      default:
        return <HomeTab user={user} />
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <button className="close-btn">✕</button>
        </div>
        <div className="header-center">
          <h1>Nimble Roulette</h1>
        </div>
        <div className="header-right">
          <button className="menu-btn">⋮</button>
        </div>
      </div>

      {/* Balance Bar */}
      <div className="balance-bar">
        <div className="balance-item">
          <span className="balance-icon">💎</span>
          <span className="balance-amount">{balance.ton.toFixed(2)}</span>
        </div>
        <div className="balance-item">
          <span className="balance-icon">⭐</span>
          <span className="balance-amount">{balance.stars}</span>
        </div>
        <button className="connect-btn">
          <span className="btn-icon">🔌</span>
          <span>Подключить</span>
        </button>
        <div className="user-avatar">
          {user?.photo_url ? (
            <img src={user.photo_url} alt="Avatar" />
          ) : (
            <div className="default-avatar">👤</div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button 
          className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <span className="nav-icon">🏠</span>
          <span>Главная</span>
        </button>
        
        <button 
          className={`nav-btn ${activeTab === 'cases' ? 'active' : ''}`}
          onClick={() => setActiveTab('cases')}
        >
          <span className="nav-icon">📦</span>
          <span>Кейсы</span>
        </button>
        
        <button 
          className={`nav-btn primary ${activeTab === 'topup' ? 'active' : ''}`}
          onClick={() => setActiveTab('topup')}
        >
          <span className="nav-icon">➕</span>
          <span>Пополнить</span>
        </button>
        
        <button 
          className={`nav-btn ${activeTab === 'upgrade' ? 'active' : ''}`}
          onClick={() => setActiveTab('upgrade')}
        >
          <span className="nav-icon">📈</span>
          <span>Улучшить</span>
        </button>
        
        <button 
          className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="nav-icon">👤</span>
          <span>Профиль</span>
        </button>
      </div>
    </div>
  )
}

export default App 