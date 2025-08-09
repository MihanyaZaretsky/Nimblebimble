const BALANCE_API_URL = 'https://mihanyazaretsky-nimblebimble-d0c5.twc1.net'

export interface UserBalance {
  stars: number
  ton: number
}

export interface BalanceResponse {
  success: boolean
  balance?: UserBalance
  error?: string
  user_id?: number
}

export interface UpdateBalanceRequest {
  user_id: number
  currency: 'TON' | 'Stars'
  amount: number
}

export class BalanceService {
  static async getUserBalance(userId: number): Promise<BalanceResponse> {
    try {
      console.log(`💰 Запрашиваем баланс для пользователя ${userId} с ${BALANCE_API_URL}`)
      const response = await fetch(`${BALANCE_API_URL}/api/balance/${userId}`)
      
      if (!response.ok) {
        console.error(`❌ HTTP ошибка: ${response.status} ${response.statusText}`)
        return {
          success: false,
          error: `HTTP ошибка: ${response.status}`
        }
      }
      
      const data = await response.json()
      console.log(`✅ Получен ответ баланса:`, data)
      return data
    } catch (error) {
      console.error('❌ Ошибка получения баланса:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка сети'
      }
    }
  }

  static async updateBalance(request: UpdateBalanceRequest): Promise<BalanceResponse> {
    try {
      const response = await fetch(`${BALANCE_API_URL}/api/updateBalance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Ошибка обновления баланса:', error)
      return {
        success: false,
        error: 'Ошибка сети'
      }
    }
  }

  static async verifyTonPayment(txHash: string, userId: number, amount: number, memo: string): Promise<BalanceResponse> {
    try {
      const response = await fetch(`${BALANCE_API_URL}/api/verifyTonPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_hash: txHash,
          user_id: userId,
          amount: amount,
          memo: memo
        })
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Ошибка проверки TON платежа:', error)
      return {
        success: false,
        error: 'Ошибка сети'
      }
    }
  }
} 