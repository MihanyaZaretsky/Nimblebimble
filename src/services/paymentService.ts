interface PaymentRequest {
  payload: string;
  currency: string;
  prices: Array<{ amount: number; label: string }>;
}

interface PaymentResponse {
  success: boolean;
  invoiceLink?: string;
  error?: string;
}

interface PaymentStatus {
  success: boolean;
  hasPaid: boolean;
  userId: number;
}

interface BalanceResponse {
  success: boolean;
  balance: number;
  userId: number;
}

// API бота (теперь встроен в bot.py на Railway)
const PAYMENT_API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:8000'
  : 'https://nimble-bot-mirg.onrender.com'; // Бот с API на Railway

export class PaymentService {
  static async createInvoiceLink(request: PaymentRequest): Promise<PaymentResponse> {
    console.log('🔵 PaymentService.createInvoiceLink:', { PAYMENT_API_URL, request })
    
    try {
      const response = await fetch(`${PAYMENT_API_URL}/api/createInvoiceLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('🔵 Response status:', response.status)
      const data = await response.json();
      console.log('🔵 Response data:', data)
      return data;
    } catch (error) {
      console.error('🔴 Ошибка создания ссылки на инвойс:', error);
      return {
        success: false,
        error: 'Ошибка сети'
      };
    }
  }

  static async checkPaymentStatus(userId: number): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${PAYMENT_API_URL}/api/paymentStatus/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка проверки статуса платежа:', error);
      return {
        success: false,
        hasPaid: false,
        userId
      };
    }
  }

  static async getBalance(userId: number): Promise<BalanceResponse> {
    try {
      const response = await fetch(`${PAYMENT_API_URL}/api/balance/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка получения баланса:', error);
      return {
        success: false,
        balance: 0,
        userId
      };
    }
  }

  static async processStarsPayment(amount: number, userId: number): Promise<PaymentResponse> {
    console.log('🔵 PaymentService.processStarsPayment:', { amount, userId })
    
    // Новый формат для FastAPI
    const request = {
      user_id: userId,
      amount: amount,
      currency: 'Stars',
      description: `Пополнение на ${amount} Stars`
    };

    console.log('🔵 Созданный request:', request)
    
    try {
      const response = await fetch(`${PAYMENT_API_URL}/api/createInvoiceLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('🔵 Response status:', response.status)
      const data = await response.json();
      console.log('🔵 Response data:', data)
      return data;
    } catch (error) {
      console.error('🔴 Ошибка создания ссылки на инвойс:', error);
      return {
        success: false,
        error: 'Ошибка сети'
      };
    }
  }
} 