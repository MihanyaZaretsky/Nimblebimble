// Плавные анимации градиентов для кнопок
class GradientAnimator {
  constructor() {
    this.animationId = null;
    this.startTime = null;
    this.isAnimating = false;
  }

  // Плавная анимация градиента для кнопки "Подключить кошелек"
  animateConnectButton(element) {
    if (!element) return;
    
    const colors = [
      { r: 102, g: 126, b: 234 }, // #667eea
      { r: 118, g: 75, b: 162 },  // #764ba2
      { r: 240, g: 147, b: 251 }, // #f093fb
      { r: 245, g: 87, b: 108 },  // #f5576c
      { r: 79, g: 172, b: 254 },  // #4facfe
      { r: 0, g: 242, b: 254 }    // #00f2fe
    ];

    this.animateGradient(element, colors, 3000); // 3 секунды
  }

  // Плавная анимация градиента для круглой кнопки "Пополнить"
  animatePrimaryButton(element) {
    if (!element) return;
    
    const colors = [
      { r: 255, g: 107, b: 107 }, // #ff6b6b
      { r: 238, g: 90, b: 36 },   // #ee5a24
      { r: 255, g: 159, b: 243 }, // #ff9ff3
      { r: 165, g: 94, b: 234 },  // #a55eea
      { r: 38, g: 222, b: 129 },  // #26de81
      { r: 32, g: 191, b: 107 }   // #20bf6b
    ];

    this.animateGradient(element, colors, 4000); // 4 секунды
  }

  // Основная функция анимации градиента
  animateGradient(element, colors, duration) {
    if (this.isAnimating) {
      cancelAnimationFrame(this.animationId);
    }

    this.isAnimating = true;
    this.startTime = performance.now();
    
    const animate = (currentTime) => {
      if (!this.startTime) this.startTime = currentTime;
      
      const elapsed = currentTime - this.startTime;
      const progress = (elapsed % duration) / duration;
      
      // Создаем плавный переход между цветами
      const colorIndex = (progress * (colors.length - 1)) % (colors.length - 1);
      const colorProgress = (progress * (colors.length - 1)) % 1;
      
      const currentColor = colors[Math.floor(colorIndex)];
      const nextColor = colors[Math.ceil(colorIndex) % colors.length];
      
      // Интерполяция цветов для плавного перехода
      const r = Math.round(this.lerp(currentColor.r, nextColor.r, colorProgress));
      const g = Math.round(this.lerp(currentColor.g, nextColor.g, colorProgress));
      const b = Math.round(this.lerp(currentColor.b, nextColor.b, colorProgress));
      
      // Применяем градиент с плавным переходом
      const gradient = `linear-gradient(135deg, rgb(${r}, ${g}, ${b}) 0%, rgb(${Math.round(r * 0.8)}, ${Math.round(g * 0.8)}, ${Math.round(b * 0.8)}) 100%)`;
      element.style.background = gradient;
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  // Линейная интерполяция для плавных переходов
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  // Остановка анимации
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.isAnimating = false;
    }
  }
}

// Создаем глобальный экземпляр аниматора
window.gradientAnimator = new GradientAnimator();

// Функция для инициализации анимаций
export function initGradientAnimations() {
  // Анимация для кнопки "Подключить кошелек"
  const connectBtn = document.querySelector('.connect-btn');
  if (connectBtn) {
    window.gradientAnimator.animateConnectButton(connectBtn);
  }

  // Анимация для круглой кнопки "Пополнить"
  const primaryBtn = document.querySelector('.nav-btn.primary');
  if (primaryBtn) {
    window.gradientAnimator.animatePrimaryButton(primaryBtn);
  }
}

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGradientAnimations);
} else {
  initGradientAnimations();
}

export default GradientAnimator; 