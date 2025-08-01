import React, { useEffect, useState } from 'react'
import './App.css'
import { initGradientAnimations } from './gradientAnimations'
import { getTranslations } from './translations'

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

// SVG иконки
const Icons = {
  diamond: () => (
    <svg width="16" height="16" viewBox="0 0 56 56" fill="none">
      <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0098EA"/>
      <path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z" fill="white"/>
    </svg>
  ),
  star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"/>
    </svg>
  ),
  connect: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 17C9.24 17 7 14.76 7 12S9.24 7 12 7 17 9.24 17 12 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15 15 13.66 15 12 13.66 9 12 9Z"/>
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

// Компоненты для разных вкладок
const HomeTab = ({ user, t }: { user: any, t: any }) => (
  <div className="tab-content">
    <div className="welcome-box">
      <h2>{t.welcome}</h2>
      <p>{t.welcomeSubtitle}</p>
    </div>
    
    <div className="action-buttons">
      <button className="action-btn">
        <span className="btn-icon">
          <Icons.box />
        </span>
        <span>{t.openCase}</span>
      </button>
      <button className="action-btn topup-home-btn">
        <span className="btn-icon">
          <Icons.wallet />
        </span>
        <span>{t.topUp}</span>
      </button>
    </div>
  </div>
)

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

const TopUpTab = ({ t }: { t: any }) => (
  <div className="tab-content">
    <div className="topup-header">
      <span className="header-icon">
        <Icons.wallet />
      </span>
      <span>{t.topUpBalance}</span>
    </div>
    
    <div className="payment-methods">
      <div className="payment-card">
        <div className="payment-icon">
          <Icons.diamond />
        </div>
        <h3>TON</h3>
        <p>{t.fastAndSecure}</p>
      </div>
      
      <div className="payment-card">
        <div className="payment-icon">
          <Icons.star />
        </div>
        <h3>Звёзды</h3>
        <p>{t.starsPayment}</p>
      </div>
    </div>
    
    <div className="amount-input">
      <input type="number" placeholder="1" defaultValue="1" />
    </div>
    
    <button className="topup-btn">
      <span className="btn-icon">
        <Icons.plus />
      </span>
      <span>{t.topUp}</span>
    </button>
  </div>
)

const UpgradeTab = ({ t }: { t: any }) => (
  <div className="tab-content">
    <h2 className="section-title">{t.upgrades}</h2>
    <p className="coming-soon">{t.comingSoon}</p>
  </div>
)

const ProfileTab = ({ user, t, language, setLanguage }: { user: any, t: any, language: string, setLanguage: (lang: string) => void }) => (
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
        <p>0.00 <Icons.diamond /></p>
      </div>
      <div className="stat-card">
        <h3>{t.casesOpened}</h3>
        <p>0 <Icons.box /></p>
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

function App() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('home')
  const [balance, setBalance] = useState({ ton: 0, stars: 0 })
  const [language, setLanguage] = useState('ru')
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  
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
        <button className="connect-btn">
          <span className="btn-icon">
            <Icons.connect />
          </span>
          <span>{t.connectWallet}</span>
        </button>
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
          <HomeTab user={user} t={t} />
          <CasesTab t={t} />
          <TopUpTab t={t} />
          <UpgradeTab t={t} />
          <ProfileTab user={user} t={t} language={language} setLanguage={setLanguage} />
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

export default App 