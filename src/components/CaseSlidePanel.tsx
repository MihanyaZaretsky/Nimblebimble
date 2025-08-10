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
  const isTouchDevice = typeof window !== 'undefined' && (('ontouchstart' in window) || (navigator as any)?.maxTouchPoints > 0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinMode, setSpinMode] = useState<'stars' | 'ton' | null>(null);
  const [showWinBurst, setShowWinBurst] = useState(false);

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
    <div
      ref={overlayRef}
      className="case-slide-overlay"
    >
      <div ref={panelRef} className="case-slide-panel" onClick={(e) => e.stopPropagation()}>
        <div className="case-slide-header">
          <h2>Открытие кейса</h2>
          <button className="case-slide-close" onClick={onClose}>×</button>
        </div>
        
        <div className="case-slide-content">
          {/* Рулетка */}
          <div className="roulette-strip">
            <div className={`strip-inner ${spinMode ?? ''}`}>
              {/* Оптимизированный набор элементов для мобильных устройств */}
              {Array.from({ length: 30 }).map((_, i) => {
                let itemClass = 'common';
                if (i % 5 === 0) itemClass = 'rare';
                if (i % 10 === 0) itemClass = 'epic';
                if (i % 15 === 0) itemClass = 'legendary';
                return (
                  <div key={`first-${i}`} className={`strip-item ${itemClass}`}></div>
                );
              })}
              {/* Дублируем элементы для бесконечного эффекта (уменьшено количество) */}
              {Array.from({ length: 30 }).map((_, i) => {
                let itemClass = 'common';
                if (i % 5 === 0) itemClass = 'rare';
                if (i % 10 === 0) itemClass = 'epic';
                if (i % 15 === 0) itemClass = 'legendary';
                return (
                  <div key={`second-${i}`} className={`strip-item ${itemClass}`}></div>
                );
              })}
            </div>
            
            {/* Голографическая линия-указатель */}
            <div className={`holographic-line ${spinMode ? 'spinning' : ''}`}>
              <div className="line-core"></div>
              <div className="line-glow"></div>
              <div className="line-scan"></div>
            </div>
          </div>

          <div className="case-slide-info">
            <h3>{caseType}</h3>
            <p className="case-slide-description">Выберите способ оплаты для открытия кейса</p>

            {/* Баланс пользователя внутри панели */}
            <div className="case-balance">
              <div className="case-balance-item">
                <span className="case-balance-icon"><img src="/icons/ton.svg" alt="TON" width={16} height={16} /></span>
                <span className="case-balance-amount">{balance.ton.toFixed(2)} TON</span>
              </div>
              <div className="case-balance-item">
                <span className="case-balance-icon"><img src="/icons/star.svg" alt="Stars" width={16} height={16} /></span>
                <span className="case-balance-amount">{balance.stars} Stars</span>
              </div>
            </div>
          </div>
          
          <div className="case-slide-actions">
            <button 
              className="case-slide-btn stars-slide-btn"
              onClick={() => {
                if (isSpinning) return;
                setSpinMode('stars');
                setIsSpinning(true);
                setShowWinBurst(false);
                setTimeout(() => {
                  onOpenWithStars();
                  setIsSpinning(false);
                  setShowWinBurst(true);
                  setTimeout(() => setShowWinBurst(false), 1000);
                }, 10000);
              }}
            >
              <div className="btn-content">
                <span className="btn-icon"><img src="/icons/star.svg" alt="Stars" width={20} height={20} /></span>
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
                setShowWinBurst(false);
                setTimeout(() => {
                  onOpenWithTon();
                  setIsSpinning(false);
                  setShowWinBurst(true);
                  setTimeout(() => setShowWinBurst(false), 1000);
                }, 10000);
              }}
            >
              <div className="btn-content">
                <span className="btn-icon"><img src="/icons/ton.svg" alt="TON" width={20} height={20} /></span>
                <div className="btn-text">
                  <span className="btn-title">Открыть за TON</span>
                  <span className="btn-price">{tonPrice} TON</span>
                </div>
              </div>
            </button>
          </div>

          {/* Содержимое кейса: сетка с предметами (оптимизировано для мобильных) */}
          <div className="case-items-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="case-item">
                <img src="/common-case-image.png" alt={`item-${i}`} />
                <div className="case-item-price">
                  <img src="/icons/star.svg" width="14" height="14" alt="Stars" />
                  <span> {Math.max(1, Math.round(starsPrice / 10))}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseSlidePanel; 