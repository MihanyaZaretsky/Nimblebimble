// Голографические анимации переливания цветов
class GradientAnimator {
  constructor() {
    this.animationId = null;
    this.startTime = null;
    this.isAnimating = false;
  }

  // Голографическая анимация для кнопки "Подключить кошелек"
  animateConnectButton(element) {
    if (!element) return;
    
    this.animateHolographicGradient(element, [
      '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
      '#26de81', '#20bf6b', '#a55eea', '#ff9ff3', '#ff6b6b', '#ee5a24'
    ], 4000);
  }

  // Голографическая анимация для круглой кнопки "Пополнить"
  animatePrimaryButton(element) {
    if (!element) return;
    
    this.animateHolographicGradient(element, [
      '#ff6b6b', '#ee5a24', '#ff9ff3', '#a55eea', '#26de81', '#20bf6b',
      '#4facfe', '#00f2fe', '#667eea', '#764ba2', '#f093fb', '#f5576c'
    ], 5000);
  }

  // Основная функция голографической анимации
  animateHolographicGradient(element, colors, duration) {
    if (this.isAnimating) {
      cancelAnimationFrame(this.animationId);
    }

    this.isAnimating = true;
    this.startTime = performance.now();
    
    const animate = (currentTime) => {
      if (!this.startTime) this.startTime = currentTime;
      
      const elapsed = currentTime - this.startTime;
      const progress = (elapsed % duration) / duration;
      
      // Создаем волнообразное движение
      const wave1 = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
      const wave2 = Math.sin(progress * Math.PI * 4 + Math.PI / 3) * 0.3 + 0.5;
      const wave3 = Math.cos(progress * Math.PI * 3 + Math.PI / 6) * 0.4 + 0.5;
      
      // Создаем плавные переходы между цветами с волновым эффектом
      const colorIndex1 = (progress * colors.length + wave1 * 0.5) % colors.length;
      const colorIndex2 = (progress * colors.length + wave2 * 0.3 + 2) % colors.length;
      const colorIndex3 = (progress * colors.length + wave3 * 0.4 + 4) % colors.length;
      
      const color1 = this.getColorAt(colors, colorIndex1);
      const color2 = this.getColorAt(colors, colorIndex2);
      const color3 = this.getColorAt(colors, colorIndex3);
      
      // Создаем сложный голографический градиент с завитками
      const gradient = `
        conic-gradient(
          from ${progress * 360}deg,
          ${color1} 0deg,
          ${color2} ${120 + wave1 * 60}deg,
          ${color3} ${240 + wave2 * 60}deg,
          ${color1} 360deg
        ),
        radial-gradient(
          circle at ${30 + wave1 * 40}% ${30 + wave2 * 40}%,
          ${color2} 0%,
          transparent 50%
        ),
        linear-gradient(
          ${135 + wave3 * 90}deg,
          ${color1} 0%,
          ${color3} 25%,
          ${color2} 50%,
          ${color1} 75%,
          ${color3} 100%
        )
      `;
      
      element.style.background = gradient;
      element.style.backgroundBlendMode = 'overlay, soft-light, normal';
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  // Получение цвета с плавной интерполяцией
  getColorAt(colors, index) {
    const i = Math.floor(index);
    const f = index - i;
    const color1 = colors[i % colors.length];
    const color2 = colors[(i + 1) % colors.length];
    
    return this.interpolateColor(color1, color2, f);
  }

  // Интерполяция цветов
  interpolateColor(color1, color2, factor) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Конвертация hex в RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
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
  console.log('🌈 Инициализация голографических анимаций...');
  
  // Анимация для кнопки "Подключить кошелек"
  const connectBtn = document.querySelector('.connect-btn');
  if (connectBtn) {
    console.log('✅ Найдена кнопка "Подключить кошелек"');
    window.gradientAnimator.animateConnectButton(connectBtn);
  } else {
    console.log('❌ Кнопка "Подключить кошелек" не найдена');
  }

  // Анимация для круглой кнопки "Пополнить"
  const primaryBtn = document.querySelector('.nav-btn.primary');
  if (primaryBtn) {
    console.log('✅ Найдена кнопка "Пополнить"');
    window.gradientAnimator.animatePrimaryButton(primaryBtn);
  } else {
    console.log('❌ Кнопка "Пополнить" не найдена');
  }
}

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGradientAnimations);
} else {
  initGradientAnimations();
}

export default GradientAnimator; 