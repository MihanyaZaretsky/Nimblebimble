#!/usr/bin/python
import psycopg2

def test_connection():
    """Тестирование подключения к PostgreSQL с psycopg2"""
    try:
        print("🔗 Тестирование подключения к PostgreSQL с psycopg2...")
        
        # Подключаемся к базе данных
        conn = psycopg2.connect(
            host="5.129.222.183",
            database="default_db",
            user="gen_user",
            password="+\4??w:vDiWSMm"
        )
        
        print("✅ Подключение успешно!")
        
        # Создаем курсор
        cur = conn.cursor()
        
        # Тестируем простой запрос
        cur.execute("SELECT version();")
        version = cur.fetchone()
        print(f"📊 Версия PostgreSQL: {version[0]}")
        
        # Закрываем соединение
        cur.close()
        conn.close()
        
        print("🎉 Тест прошел успешно!")
        
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
        raise

if __name__ == "__main__":
    test_connection() 