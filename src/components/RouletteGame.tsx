import React, { useState, useEffect } from 'react'
import './RouletteGame.css'

interface User {
  id: number
  first_name: string
  username?: string
}

interface RouletteGameProps {
  user: User | null
}

const RouletteGame: React.FC<RouletteGameProps> = ({ user }) => {
  const [balance, setBalance] = useState(1000)
  const [currentBet, setCurrentBet] = useState(10)
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastResult, setLastResult] = useState<number | null>(null)
  const [lastWin, setLastWin] = useState<number | null>(null)
  const [wheelRotation, setWheelRotation] = useState(0)

  const betAmounts = [10, 25, 50, 100, 250, 500]

  useEffect(() => {
    // Подключение к WebSocket серверу бота
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket('ws://localhost:8765')
        
        ws.onopen = () => {
          console.log('WebSocket подключен')
          // Отправляем данные пользователя
          ws.send(JSON.stringify({
            user_id: user?.id,
            action: 'connect_websocket'
          }))
        }
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data)
          console.log('Получено от WebSocket:', data)
          
          if (data.action === 'roulette_result') {
            handleRouletteResult(data)
          }
        }
        
        ws.onerror = (error) => {
          console.error('WebSocket ошибка:', error)
        }
        
        ws.onclose = () => {
          console.log('WebSocket отключен')
        }
        
        return ws
      } catch (error) {
        console.error('Ошибка подключения к WebSocket:', error)
        return null
      }
    }

    const ws = connectWebSocket()
    
    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [user])

  const handleRouletteResult = (data: any) => {
    setIsSpinning(false)
    setLastResult(data.result)
    
    if (data.win) {
      setLastWin(data.win_amount)
      setBalance(prev => prev + data.win_amount)
      
      // Показываем уведомление о выигрыше
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(`🎉 Выигрыш! +${data.win_amount} Stars`)
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
      }
    } else {
      setLastWin(null)
      setBalance(prev => prev - currentBet)
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('😔 Попробуйте еще раз!')
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error')
      }
    }
  }

  const spinRoulette = () => {
    if (isSpinning || balance < currentBet) return
    
    setIsSpinning(true)
    setLastResult(null)
    setLastWin(null)
    
    // Анимация вращения колеса
    const spins = 5 + Math.random() * 5 // 5-10 оборотов
    const finalRotation = wheelRotation + (spins * 360) + Math.random() * 360
    setWheelRotation(finalRotation)
    
    // Отправляем данные в бота через Telegram Web App
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify({
        action: 'place_bet',
        amount: currentBet,
        user_id: user?.id
      }))
      
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
    }
    
    // Симуляция результата (в реальном приложении это придет от бота)
    setTimeout(() => {
      const result = Math.floor(Math.random() * 37)
      const win = Math.random() > 0.6
      const winAmount = win ? Math.floor(currentBet * (1.5 + Math.random() * 1.5)) : 0
      
      handleRouletteResult({
        action: 'roulette_result',
        result,
        win,
        win_amount: winAmount
      })
    }, 3000)
  }

  const buyStars = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showPopup({
        title: '💎 Купить Stars',
        message: 'Выберите количество Stars для покупки',
        buttons: [
          { text: '100 Stars - $1', type: 'default' },
          { text: '500 Stars - $5', type: 'default' },
          { text: '1000 Stars - $10', type: 'default' },
          { text: 'Отмена', type: 'cancel' }
        ]
      }, (buttonId) => {
        if (buttonId !== 'Отмена') {
          window.Telegram.WebApp.showAlert('💎 Покупка Stars будет доступна в ближайшее время!')
        }
      })
    }
  }

  const withdrawStars = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showPopup({
        title: '💸 Вывести Stars',
        message: `Доступно для вывода: ${balance} Stars`,
        buttons: [
          { text: 'Вывести все', type: 'default' },
          { text: 'Отмена', type: 'cancel' }
        ]
      }, (buttonId) => {
        if (buttonId !== 'Отмена') {
          window.Telegram.WebApp.showAlert('💸 Вывод Stars будет доступен в ближайшее время!')
        }
      })
    }
  }

  return (
    <div className="roulette-game">
      {/* Заголовок */}
      <div className="game-header">
        <h1>🎰 Nimble Roulette</h1>
        {user && (
          <p className="welcome-text">
            Добро пожаловать, {user.first_name}! 👋
          </p>
        )}
      </div>

      {/* Баланс */}
      <div className="balance-section">
        <div className="balance-card">
          <span className="balance-label">💰 Баланс</span>
          <span className="balance-amount">{balance} Stars</span>
        </div>
      </div>

      {/* Колесо рулетки */}
      <div className="roulette-wheel-container">
        <div 
          className={`roulette-wheel ${isSpinning ? 'spinning' : ''}`}
          style={{ transform: `rotate(${wheelRotation}deg)` }}
        >
          <div className="wheel-center"></div>
          <div className="wheel-numbers">
            {Array.from({ length: 37 }, (_, i) => (
              <div 
                key={i} 
                className={`wheel-number ${i === lastResult ? 'highlight' : ''}`}
                style={{ 
                  transform: `rotate(${(i * 360) / 37}deg)`,
                  backgroundColor: i === 0 ? '#00ff00' : i % 2 === 0 ? '#ff0000' : '#000000'
                }}
              >
                {i}
              </div>
            ))}
          </div>
        </div>
        
        {lastResult !== null && (
          <div className="result-display">
            <span className="result-number">{lastResult}</span>
            {lastWin && <span className="win-amount">+{lastWin}</span>}
          </div>
        )}
      </div>

      {/* Ставки */}
      <div className="betting-section">
        <h3>💰 Размер ставки</h3>
        <div className="bet-amounts">
          {betAmounts.map(amount => (
            <button
              key={amount}
              className={`bet-button ${currentBet === amount ? 'active' : ''}`}
              onClick={() => setCurrentBet(amount)}
              disabled={isSpinning}
            >
              {amount}
            </button>
          ))}
        </div>
        
        <button 
          className={`spin-button ${isSpinning ? 'spinning' : ''}`}
          onClick={spinRoulette}
          disabled={isSpinning || balance < currentBet}
        >
          {isSpinning ? '🎰 Крутим...' : '🎰 Крутить рулетку'}
        </button>
      </div>

      {/* Действия */}
      <div className="actions-section">
        <button className="action-button buy" onClick={buyStars}>
          💎 Купить Stars
        </button>
        <button className="action-button withdraw" onClick={withdrawStars}>
          💸 Вывести Stars
        </button>
      </div>

      {/* Информация */}
      <div className="info-section">
        <p className="info-text">
          🎲 Классическая рулетка 0-36 • Шанс выигрыша ~40%
        </p>
      </div>
    </div>
  )
}

export default RouletteGame 