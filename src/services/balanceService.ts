const BALANCE_API_URL = 'https://nimblebimble-production.up.railway.app'

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
      const response = await fetch(`${BALANCE_API_URL}/api/balance/${userId}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Ошибка получения баланса:', error)
      return {
        success: false,
        error: 'Ошибка сети'
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
} 