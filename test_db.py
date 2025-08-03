import asyncio
from database import db

async def test_connection():
    """Тестирование подключения к базе данных"""
    try:
        print("🔗 Тестирование подключения к PostgreSQL...")
        
        # Подключаемся к базе данных
        await db.connect()
        print("✅ Подключение успешно!")
        
        # Тестируем создание пользователя и получение баланса
        test_user_id = 12345
        balance = await db.get_user_balance(test_user_id)
        print(f"💰 Тестовый баланс пользователя {test_user_id}: {balance}")
        
        # Тестируем обновление баланса
        new_balance = await db.update_user_balance(test_user_id, "stars", 100)
        print(f"✅ Баланс обновлен: {new_balance}")
        
        # Тестируем обновление TON баланса
        new_balance = await db.update_user_balance(test_user_id, "ton", 1.5)
        print(f"✅ TON баланс обновлен: {new_balance}")
        
        print("🎉 Все тесты прошли успешно!")
        
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
        raise
    finally:
        # Закрываем подключение
        if db.pool:
            await db.pool.close()

if __name__ == "__main__":
    asyncio.run(test_connection()) 