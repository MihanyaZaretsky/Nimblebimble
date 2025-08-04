import React from 'react';

interface CaseSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  caseType: string;
  starsPrice: number;
  tonPrice: number;
  onOpenWithStars: () => void;
  onOpenWithTon: () => void;
}

const CaseSlidePanel: React.FC<CaseSlidePanelProps> = ({ 
  isOpen, 
  onClose, 
  caseType, 
  starsPrice, 
  tonPrice,
  onOpenWithStars,
  onOpenWithTon
}) => {
  if (!isOpen) return null;

  return (
    <div className="case-slide-overlay" onClick={onClose}>
      <div className="case-slide-panel" onClick={(e) => e.stopPropagation()}>
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
          </div>
          
          <div className="case-slide-actions">
            <button 
              className="case-slide-btn stars-slide-btn"
              onClick={onOpenWithStars}
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
              onClick={onOpenWithTon}
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