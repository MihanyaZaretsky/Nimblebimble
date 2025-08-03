import urllib.parse

# Тестируем кодировку пароля
password = r'g%OTS{<QY:V5K!'
encoded_password = urllib.parse.quote_plus(password)

print(f"Оригинальный пароль: {password}")
print(f"Закодированный пароль: {encoded_password}")

# Попробуем разные варианты кодировки
print("\nРазные варианты кодировки:")
print(f"quote_plus: {urllib.parse.quote_plus(password)}")
print(f"quote: {urllib.parse.quote(password)}")
print(f"raw string: {password}")

# Проверим, есть ли специальные символы
print(f"\nСпециальные символы в пароле:")
for char in password:
    if not char.isalnum():
        print(f"'{char}' - не буква/цифра") 