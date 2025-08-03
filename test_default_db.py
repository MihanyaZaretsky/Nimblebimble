import asyncio
import asyncpg
from config import DB_CONFIG

async def test_default_db():
    """Тестирование подключения к default_db"""
    try:
        print("🔗 Тестирование подключения к default_db...")
        
        # Подключаемся к базе данных default_db
        conn = await asyncpg.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database='default_db'
        )
        
        print("✅ Подключение к default_db успешно!")
        
        # Проверяем существующие таблицы
        tables = await conn.fetch("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        
        print("📋 Существующие таблицы:")
        for table in tables:
            print(f"  - {table['table_name']}")
        
        # Создаем наши таблицы
        print("📝 Создаем таблицы для бота...")
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id BIGINT PRIMARY KEY,
                username VARCHAR(255),
                first_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS balances (
                user_id BIGINT PRIMARY KEY REFERENCES users(user_id),
                stars INTEGER DEFAULT 0,
                ton DECIMAL(20, 8) DEFAULT 0.0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
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
        
        print("✅ Таблицы созданы!")
        
        # Тестируем работу с данными
        test_user_id = 12345
        await conn.execute('''
            INSERT INTO users (user_id) 
            VALUES ($1) 
            ON CONFLICT (user_id) DO NOTHING
        ''', test_user_id)
        
        await conn.execute('''
            INSERT INTO balances (user_id) 
            VALUES ($1) 
            ON CONFLICT (user_id) DO NOTHING
        ''', test_user_id)
        
        balance = await conn.fetchrow('''
            SELECT stars, ton FROM balances WHERE user_id = $1
        ''', test_user_id)
        
        print(f"💰 Тестовый баланс: {balance}")
        
        await conn.close()
        print("🎉 Все тесты прошли успешно!")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")

if __name__ == "__main__":
    asyncio.run(test_default_db()) 