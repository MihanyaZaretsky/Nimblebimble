import React, { useEffect, useRef, useState } from 'react';

interface CaseSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  caseType: string;
  starsPrice: number;
  tonPrice: number;
  onOpenWithStars: () => void;
  onOpenWithTon: () => void;
  currentTab: string;
  balance: { stars: number; ton: number };
}

const CaseSlidePanel: React.FC<CaseSlidePanelProps> = ({ 
  isOpen, 
  onClose, 
  caseType, 
  starsPrice, 
  tonPrice,
  onOpenWithStars,
  onOpenWithTon,
  currentTab,
  balance
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinMode, setSpinMode] = useState<'stars' | 'ton' | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      
      // Telegram Mini App специфичное исправление
      const forceTelegramFix = () => {
        if (overlayRef.current && panelRef.current) {
          // Принудительно устанавливаем позиционирование для Telegram WebView
          overlayRef.current.style.position = 'fixed';
          overlayRef.current.style.top = '0';
          overlayRef.current.style.left = '0';
          overlayRef.current.style.right = '0';
          overlayRef.current.style.bottom = '0';
          overlayRef.current.style.width = '100vw';
          overlayRef.current.style.height = '100vh';
          overlayRef.current.style.margin = '0';
          overlayRef.current.style.padding = '0';
          overlayRef.current.style.transform = 'none';
          overlayRef.current.style.zIndex = '99999';
          overlayRef.current.style.overflow = 'hidden';
          
          panelRef.current.style.position = 'fixed';
          panelRef.current.style.top = '0';
          panelRef.current.style.left = '0';
          panelRef.current.style.right = '0';
          panelRef.current.style.bottom = '0';
          panelRef.current.style.width = '100vw';
          panelRef.current.style.height = '100vh';
          panelRef.current.style.margin = '0';
          panelRef.current.style.padding = '0';
          panelRef.current.style.transform = 'none';
          panelRef.current.style.zIndex = '100000';
          panelRef.current.style.borderRadius = '0';
          panelRef.current.style.overflow = 'hidden';
        }
      };
      
      // Применяем исправление сразу и через небольшую задержку
      forceTelegramFix();
      setTimeout(forceTelegramFix, 100);
      setTimeout(forceTelegramFix, 500);
      
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} className="case-slide-overlay" onClick={onClose}>
      <div ref={panelRef} className="case-slide-panel" onClick={(e) => e.stopPropagation()}>
        <div className="case-slide-header">
          <h2>Открытие кейса</h2>
          <button className="case-slide-close" onClick={onClose}>×</button>
        </div>
        
        <div className="case-slide-content">
          <div className="case-slide-info">
            <div className="case-slide-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
                <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H14V17H7V15Z"/>
              </svg>
            </div>
            <h3>{caseType}</h3>
            <p className="case-slide-description">Выберите способ оплаты для открытия кейса</p>

            {/* Баланс пользователя внутри панели */}
            <div className="case-balance">
              <div className="case-balance-item">
                <span className="case-balance-icon">⚡</span>
                <span className="case-balance-amount">{balance.ton.toFixed(2)} TON</span>
              </div>
              <div className="case-balance-item">
                <span className="case-balance-icon">💎</span>
                <span className="case-balance-amount">{balance.stars} Stars</span>
              </div>
            </div>
          </div>
          
          {/* Рулетка */}
          <div className={`roulette-container ${isSpinning ? 'spinning' : ''}`}>
            <div className={`roulette-wheel ${spinMode ?? ''}`}></div>
          </div>

          <div className="case-slide-actions">
            <button 
              className="case-slide-btn stars-slide-btn"
              onClick={() => {
                if (isSpinning) return;
                setSpinMode('stars');
                setIsSpinning(true);
                setTimeout(() => {
                  onOpenWithStars();
                  setIsSpinning(false);
                  onClose();
                }, 1800);
              }}
            >
              <div className="btn-content">
                <span className="btn-icon">💎</span>
                <div className="btn-text">
                  <span className="btn-title">Открыть за Stars</span>
                  <span className="btn-price">{starsPrice} Stars</span>
                </div>
              </div>
            </button>
            
            <button 
              className="case-slide-btn ton-slide-btn"
              onClick={() => {
                if (isSpinning) return;
                setSpinMode('ton');
                setIsSpinning(true);
                setTimeout(() => {
                  onOpenWithTon();
                  setIsSpinning(false);
                  onClose();
                }, 1800);
              }}
            >
              <div className="btn-content">
                <span className="btn-icon">⚡</span>
                <div className="btn-text">
                  <span className="btn-title">Открыть за TON</span>
                  <span className="btn-price">{tonPrice} TON</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseSlidePanel; 