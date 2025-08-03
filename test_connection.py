import asyncio
import asyncpg
from config import DB_CONFIG

async def test_postgres_connection():
    """Тестирование подключения к базе данных postgres"""
    try:
        print("🔗 Тестирование подключения к PostgreSQL...")
        
        # Подключаемся к базе данных postgres
        conn = await asyncpg.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database='postgres'  # Подключаемся к базе postgres
        )
        
        print("✅ Подключение к postgres успешно!")
        
        # Проверяем список баз данных
        databases = await conn.fetch("SELECT datname FROM pg_database WHERE datistemplate = false;")
        print("📋 Доступные базы данных:")
        for db in databases:
            print(f"  - {db['datname']}")
        
        # Проверяем права пользователя
        user_privileges = await conn.fetch("""
            SELECT 
                usename,
                usecreatedb,
                usesuper
            FROM pg_user 
            WHERE usename = $1
        """, DB_CONFIG['user'])
        
        print(f"👤 Права пользователя {DB_CONFIG['user']}:")
        for priv in user_privileges:
            print(f"  - Создание БД: {priv['usecreatedb']}")
            print(f"  - Суперпользователь: {priv['usesuper']}")
        
        await conn.close()
        
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")

if __name__ == "__main__":
    asyncio.run(test_postgres_connection()) 