import asyncio
import asyncpg
from config import DB_CONFIG

async def check_transactions():
    """Проверка транзакций в базе данных"""
    try:
        print("🔍 Проверяем транзакции в базе данных...")
        
        conn = await asyncpg.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['database']
        )
        
        # Проверяем пользователей
        users = await conn.fetch("SELECT * FROM users ORDER BY created_at DESC LIMIT 10")
        print(f"👥 Пользователи в базе данных ({len(users)}):")
        for user in users:
            print(f"  - ID: {user['user_id']}, Имя: {user['first_name']}, Создан: {user['created_at']}")
        
        # Проверяем балансы
        balances = await conn.fetch("SELECT * FROM balances ORDER BY updated_at DESC LIMIT 10")
        print(f"\n💰 Балансы в базе данных ({len(balances)}):")
        for balance in balances:
            print(f"  - Пользователь: {balance['user_id']}, Stars: {balance['stars']}, TON: {balance['ton']}, Обновлен: {balance['updated_at']}")
        
        # Проверяем транзакции
        transactions = await conn.fetch("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10")
        print(f"\n📊 Транзакции в базе данных ({len(transactions)}):")
        for tx in transactions:
            print(f"  - ID: {tx['id']}, Пользователь: {tx['user_id']}, Тип: {tx['type']}, Валюта: {tx['currency']}, Сумма: {tx['amount']}, Статус: {tx['status']}, Создана: {tx['created_at']}")
        
        # Проверяем конкретного пользователя
        user_id = 2029065770
        user_balance = await conn.fetchrow("SELECT * FROM balances WHERE user_id = $1", user_id)
        if user_balance:
            print(f"\n🎯 Баланс пользователя {user_id}:")
            print(f"  - Stars: {user_balance['stars']}")
            print(f"  - TON: {user_balance['ton']}")
            print(f"  - Обновлен: {user_balance['updated_at']}")
        else:
            print(f"\n❌ Пользователь {user_id} не найден в базе данных")
        
        user_transactions = await conn.fetch("SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC", user_id)
        print(f"\n📈 Транзакции пользователя {user_id} ({len(user_transactions)}):")
        for tx in user_transactions:
            print(f"  - {tx['created_at']}: {tx['type']} {tx['amount']} {tx['currency']} (статус: {tx['status']})")
        
        await conn.close()
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")

if __name__ == "__main__":
    asyncio.run(check_transactions()) 