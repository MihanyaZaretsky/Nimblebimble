import os
import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Получаем токен бота (хардкодим для Railway)
BOT_TOKEN = "7771822556:AAHWZD6D_AMH0bT51ygacsoEEwQmPzJn4xI"

# URL вашего Web App на Render
WEBAPP_URL = "https://nimblebimble.onrender.com"

# Создаем бота и диспетчер
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# Функция создания инвойса для Telegram Stars
async def create_invoice_link(user_id: int, amount: int, currency: str = "Stars", description: str = "Пополнение баланса"):
    """Создание инвойса для Telegram Stars через Telegram API"""
    try:
        import aiohttp
        
        # Генерируем уникальный order_id
        order_id = f"{user_id}_{int(asyncio.get_event_loop().time())}"
        
        # Создаем payload как в примере Django
        payload = f"{order_id}&&&{amount}"
        
        # Данные для создания инвойса
        data = {
            "title": "Пополнение баланса",
            "description": f"Пополнение на {amount} {currency}",
            "payload": payload,
            "provider_token": "",  # Для Stars не нужен provider token
            "currency": "XTR",  # Telegram Stars используют XTR
            "prices": [{"label": f"{amount} {currency}", "amount": int(amount)}]
        }
        
        print(f"🔵 Создаем инвойс: {data}")
        
        # Вызываем Telegram API напрямую
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/createInvoiceLink"
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=data) as resp:
                result = await resp.json()
                
                if result.get("ok"):
                    invoice_link = result["result"]
                    print(f"✅ Инвойс создан: {invoice_link}")
                    return invoice_link
                else:
                    error_msg = result.get("description", "Unknown error")
                    print(f"❌ Ошибка Telegram API: {error_msg}")
                    raise Exception(f"Telegram API error: {error_msg}")
        
    except Exception as e:
        print(f"❌ Ошибка создания инвойса: {e}")
        raise e

# Создаем клавиатуру с кнопкой Web App
def get_main_keyboard():
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="🎮 Открыть игру",
                web_app=types.WebAppInfo(url=WEBAPP_URL)
            )
        ]
    ])
    return keyboard

# Обработчик команды /start
@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    user_name = message.from_user.first_name
    user_id = message.from_user.id
    
    print(f"🎯 Команда /start от пользователя: {user_name} (ID: {user_id})")
    
    welcome_text = f"""
🎉 Привет, {user_name}!

Добро пожаловать в Nimble Roulette! 🎰

🎮 Нажмите кнопку ниже, чтобы открыть игру:
    """
    
    try:
        await message.answer(
            welcome_text,
            reply_markup=get_main_keyboard()
        )
        print(f"✅ Приветственное сообщение отправлено пользователю {user_name}")
    except Exception as e:
        print(f"❌ Ошибка отправки сообщения: {e}")

# Обработчик pre_checkout_query (подтверждение платежа)
@dp.pre_checkout_query()
async def process_pre_checkout_query(pre_checkout_query: types.PreCheckoutQuery):
    """Обработка pre_checkout_query для подтверждения платежа"""
    try:
        print(f"🔵 Pre-checkout query: {pre_checkout_query.id}")
        
        # Подтверждаем платеж
        await bot.answer_pre_checkout_query(pre_checkout_query.id, ok=True)
        print(f"✅ Pre-checkout query подтвержден")
        
    except Exception as e:
        print(f"❌ Ошибка pre-checkout query: {e}")
        await bot.answer_pre_checkout_query(pre_checkout_query.id, ok=False, error_message="Ошибка обработки платежа")

# Обработчик успешных платежей
@dp.message(lambda message: message.successful_payment is not None)
async def process_successful_payment(message: types.Message):
    """Обработка успешных платежей"""
    try:
        user_name = message.from_user.first_name
        user_id = message.from_user.id
        payment = message.successful_payment
        
        print(f"💰 Успешный платеж от {user_name} (ID: {user_id})")
        print(f"📦 Платеж: {payment.invoice_payload}")
        print(f"💳 Сумма: {payment.total_amount} {payment.currency}")
        
        # Парсим payload как в примере Django
        try:
            order_id = payment.invoice_payload.split("&&&")[0]
            amount = payment.invoice_payload.split("&&&")[1]
            
            print(f"🆔 Order ID: {order_id}")
            print(f"💰 Amount: {amount}")
            
            # Здесь можно добавить логику обновления баланса пользователя
            await message.answer(
                f"✅ Платеж успешно обработан!\n"
                f"💰 Сумма: {amount} Stars\n"
                f"🎮 Ваш баланс пополнен!"
            )
            
        except Exception as e:
            print(f"❌ Ошибка парсинга payload: {e}")
            
    except Exception as e:
        print(f"❌ Ошибка обработки платежа: {e}")

# Обработчик всех остальных сообщений
@dp.message()
async def echo_message(message: types.Message):
    user_name = message.from_user.first_name
    user_id = message.from_user.id
    
    print(f"📨 Получено сообщение от {user_name} (ID: {user_id}): {message.text}")
    
    # Отправляем приветствие с кнопкой Web App
    await cmd_start(message)

# Функция запуска бота
async def main():
    print("🚀 Запуск Python бота...")
    print(f"🔑 Токен: {BOT_TOKEN[:10]}...")
    print(f"🌐 Web App URL: {WEBAPP_URL}")
    
    try:
        # Проверяем подключение к боту
        bot_info = await bot.get_me()
        print(f"✅ Бот подключен: @{bot_info.username}")
        
        # Запускаем HTTP сервер для Render
        import uvicorn
        from fastapi import FastAPI
        
        app = FastAPI()
        
        # Добавляем CORS для Web App
        from fastapi.middleware.cors import CORSMiddleware
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["https://nimblebimble.onrender.com", "http://localhost:3000"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        @app.get("/")
        async def root():
            return {"status": "Bot is running", "bot": bot_info.username}
        
        @app.get("/health")
        async def health():
            return {"status": "healthy"}
        
        # API эндпоинт для создания инвойсов
        from pydantic import BaseModel
        
        class InvoiceRequest(BaseModel):
            user_id: int
            amount: int
            currency: str = "TON"
            description: str = "Пополнение баланса"
        
        @app.post("/api/createInvoiceLink")
        async def create_invoice(request: InvoiceRequest):
            """Создание ссылки на оплату через Telegram Stars"""
            try:
                print(f"🔵 Запрос на создание инвойса: {request}")
                
                # Создаем инвойс через бота
                invoice_link = await create_invoice_link(
                    user_id=request.user_id,
                    amount=request.amount,
                    currency="Stars",
                    description=request.description
                )
                
                return {
                    "success": True,
                    "invoice_url": invoice_link,
                    "user_id": request.user_id
                }
                
            except Exception as e:
                print(f"❌ Ошибка создания инвойса: {e}")
                return {
                    "success": False,
                    "error": str(e)
                }
        
        # Запускаем бота и сервер одновременно
        import asyncio
        
        async def run_bot():
            await dp.start_polling(bot)
        
        async def run_server():
            config = uvicorn.Config(app, host="0.0.0.0", port=8000)
            server = uvicorn.Server(config)
            await server.serve()
        
        # Запускаем оба процесса
        await asyncio.gather(
            run_bot(),
            run_server()
        )
        
    except Exception as e:
        print(f"❌ Ошибка запуска бота: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Бот остановлен пользователем")
    except Exception as e:
        print(f"❌ Критическая ошибка: {e}") 