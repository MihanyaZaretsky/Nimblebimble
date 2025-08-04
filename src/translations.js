// Переводы для приложения
export const translations = {
  ru: {
    // Balance Bar
    connectWallet: 'Подключить',
    
    // Home Tab
    welcome: 'Добро пожаловать!',
    welcomeSubtitle: 'Выберите действие для начала игры',
    openCase: 'Открыть кейс',
    topUp: 'Пополнить',
    subscribeChannel: 'Подпишитесь на наш канал',
    
    // Cases Tab
    cases: 'Кейсы',
    commonCase: 'Обычный кейс',
    rareCase: 'Редкий кейс',
    epicCase: 'Эпический кейс',
    legendaryCase: 'Легендарный кейс',
    price: 'Цена',
    open: 'Открыть',
    
    // TopUp Tab
    topUpBalance: 'Пополнить баланс',
    fastAndSecure: 'Быстро и безопасно',
    starsPayment: 'Пополнение через Звёзды',
    amount: 'Сумма',
    
    // Upgrade Tab
    upgrades: 'Улучшения',
    comingSoon: 'Скоро здесь будут доступны улучшения',
    
    // Profile Tab
    balance: 'Баланс',
    stars: 'Звезды',
    casesOpened: 'Открыто кейсов',
    language: 'Язык',
    walletAddress: 'Адрес кошелька:',
    disconnectWallet: 'Отключить кошелек',
    
    // Navigation
    home: 'Главная',
    cases: 'Кейсы',
    topUp: 'Пополнить',
    upgrade: 'Улучшить',
    profile: 'Профиль',
    
    // User info
    user: 'Пользователь',
    username: 'username'
  },
  
  en: {
    // Balance Bar
    connectWallet: 'Connect',
    
    // Home Tab
    welcome: 'Welcome!',
    welcomeSubtitle: 'Choose an action to start the game',
    openCase: 'Open Case',
    topUp: 'Deposit',
    subscribeChannel: 'Subscribe to our channel',
    
    // Cases Tab
    cases: 'Cases',
    commonCase: 'Common Case',
    rareCase: 'Rare Case',
    epicCase: 'Epic Case',
    legendaryCase: 'Legendary Case',
    price: 'Price',
    open: 'Open',
    
    // TopUp Tab
    topUpBalance: 'Deposit Balance',
    fastAndSecure: 'Fast and Secure',
    starsPayment: 'Payment via Stars',
    amount: 'Amount',
    
    // Upgrade Tab
    upgrades: 'Upgrades',
    comingSoon: 'Upgrades will be available here soon',
    
    // Profile Tab
    balance: 'Balance',
    stars: 'Stars',
    casesOpened: 'Cases Opened',
    language: 'Language',
    walletAddress: 'Wallet Address:',
    disconnectWallet: 'Disconnect Wallet',
    
    // Navigation
    home: 'Home',
    cases: 'Cases',
    topUp: 'Deposit',
    upgrade: 'Upgrade',
    profile: 'Profile',
    
    // User info
    user: 'User',
    username: 'username'
  }
};

// Функция для получения перевода
export function getTranslation(lang, key) {
  return translations[lang]?.[key] || key;
}

// Функция для получения всех переводов для языка
export function getTranslations(lang) {
  return translations[lang] || translations.ru;
} 