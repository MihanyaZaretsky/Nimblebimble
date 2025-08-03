#!/usr/bin/python
import psycopg2

def test_password_variants():
    """Тестирование разных вариантов пароля"""
    
    # Варианты пароля
    passwords = [
        "+\4??w:vDiWSMm",  # Оригинальный
        r"+\4??w:vDiWSMm",  # Raw string
    ]
    
    for i, password in enumerate(passwords, 1):
        try:
            print(f"🔑 Тестируем пароль {i}: {password}")
            
            conn = psycopg2.connect(
                host="5.129.222.183",
                database="default_db",
                user="gen_user",
                password=password
            )
            
            print(f"✅ Пароль {i} работает!")
            
            # Тестируем запрос
            cur = conn.cursor()
            cur.execute("SELECT version();")
            version = cur.fetchone()
            print(f"📊 Версия PostgreSQL: {version[0]}")
            
            cur.close()
            conn.close()
            
            print(f"🎉 Пароль {i} прошел все тесты!")
            return password
            
        except Exception as e:
            print(f"❌ Пароль {i} не работает: {e}")
            print()
    
    print("❌ Ни один пароль не работает")
    return None

if __name__ == "__main__":
    working_password = test_password_variants()
    if working_password:
        print(f"\n✅ Рабочий пароль: {working_password}")
    else:
        print("\n❌ Нужно проверить пароль в панели управления") 