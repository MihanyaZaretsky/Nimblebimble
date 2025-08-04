import React from 'react';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseType: string;
  starsPrice: number;
  tonPrice: number;
}

const CaseModal: React.FC<CaseModalProps> = ({ isOpen, onClose, caseType, starsPrice, tonPrice }) => {
  if (!isOpen) return null;

  return (
    <div className="case-modal-overlay" onClick={onClose}>
      <div className="case-modal" onClick={(e) => e.stopPropagation()}>
        <div className="case-modal-header">
          <h2>Открытие кейса</h2>
          <button className="case-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="case-modal-content">
          <div className="case-info">
            <h3>{caseType}</h3>
            <div className="case-prices">
              <div className="price-item">
                <span className="price-icon">💎</span>
                <span>{starsPrice} Stars</span>
              </div>
              <div className="price-item">
                <span className="price-icon">⚡</span>
                <span>{tonPrice} TON</span>
              </div>
            </div>
          </div>
          
          <div className="case-actions">
            <button className="case-action-btn stars-btn">
              Открыть за {starsPrice} Stars
            </button>
            <button className="case-action-btn ton-btn">
              Открыть за {tonPrice} TON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseModal; 