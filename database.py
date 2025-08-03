import asyncpg
from typing import Optional, Dict, Any
import json
from config import DATABASE_URL

class Database:
    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None
    
    async def connect(self):
        """Подключение к базе данных"""
        try:
            self.pool = await asyncpg.create_pool(DATABASE_URL)
            print("✅ Подключение к базе данных установлено")
            
            # Создаем таблицы если их нет
            await self.create_tables()
            
        except Exception as e:
            print(f"❌ Ошибка подключения к базе данных: {e}")
            raise
    
    async def create_tables(self):
        """Создание таблиц"""
        async with self.pool.acquire() as conn:
            # Таблица пользователей
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    user_id BIGINT PRIMARY KEY,
                    username VARCHAR(255),
                    first_name VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Таблица балансов
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS balances (
                    user_id BIGINT PRIMARY KEY REFERENCES users(user_id),
                    stars INTEGER DEFAULT 0,
                    ton DECIMAL(20, 8) DEFAULT 0.0,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Таблица транзакций
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS transactions (
                    id SERIAL PRIMARY KEY,
                    user_id BIGINT REFERENCES users(user_id),
                    type VARCHAR(50) NOT NULL,
                    currency VARCHAR(10) NOT NULL,
                    amount DECIMAL(20, 8) NOT NULL,
                    status VARCHAR(50) DEFAULT 'pending',
                    tx_hash VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            print("✅ Таблицы созданы/проверены")
    
    async def get_user_balance(self, user_id: int) -> Dict[str, Any]:
        """Получить баланс пользователя"""
        async with self.pool.acquire() as conn:
            # Создаем пользователя если его нет
            await conn.execute('''
                INSERT INTO users (user_id) 
                VALUES ($1) 
                ON CONFLICT (user_id) DO NOTHING
            ''', user_id)
            
            # Создаем запись баланса если её нет
            await conn.execute('''
                INSERT INTO balances (user_id) 
                VALUES ($1) 
                ON CONFLICT (user_id) DO NOTHING
            ''', user_id)
            
            # Получаем баланс
            row = await conn.fetchrow('''
                SELECT stars, ton FROM balances WHERE user_id = $1
            ''', user_id)
            
            if row:
                return {
                    "stars": row['stars'],
                    "ton": float(row['ton'])
                }
            return {"stars": 0, "ton": 0.0}
    
    async def update_user_balance(self, user_id: int, currency: str, amount: float) -> Dict[str, Any]:
        """Обновить баланс пользователя"""
        async with self.pool.acquire() as conn:
            # Создаем пользователя если его нет
            await conn.execute('''
                INSERT INTO users (user_id) 
                VALUES ($1) 
                ON CONFLICT (user_id) DO NOTHING
            ''', user_id)
            
            # Создаем запись баланса если её нет
            await conn.execute('''
                INSERT INTO balances (user_id) 
                VALUES ($1) 
                ON CONFLICT (user_id) DO NOTHING
            ''', user_id)
            
            # Обновляем баланс
            if currency.lower() == 'stars':
                await conn.execute('''
                    UPDATE balances 
                    SET stars = stars + $2, updated_at = CURRENT_TIMESTAMP 
                    WHERE user_id = $1
                ''', user_id, int(amount))
            elif currency.lower() == 'ton':
                await conn.execute('''
                    UPDATE balances 
                    SET ton = ton + $2, updated_at = CURRENT_TIMESTAMP 
                    WHERE user_id = $1
                ''', user_id, amount)
            
            # Получаем обновленный баланс
            return await self.get_user_balance(user_id)
    
    async def create_transaction(self, user_id: int, type: str, currency: str, amount: float, tx_hash: str = None) -> int:
        """Создать запись о транзакции"""
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow('''
                INSERT INTO transactions (user_id, type, currency, amount, tx_hash)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            ''', user_id, type, currency, amount, tx_hash)
            
            return row['id'] if row else None
    
    async def update_transaction_status(self, transaction_id: int, status: str):
        """Обновить статус транзакции"""
        async with self.pool.acquire() as conn:
            await conn.execute('''
                UPDATE transactions 
                SET status = $2 
                WHERE id = $1
            ''', transaction_id, status)
    
    async def get_transaction_by_hash(self, tx_hash: str):
        """Получить транзакцию по хешу"""
        async with self.pool.acquire() as conn:
            return await conn.fetchrow('''
                SELECT * FROM transactions WHERE tx_hash = $1
            ''', tx_hash)

# Глобальный экземпляр базы данных
db = Database() 