import asyncio
import logging
import json
import websockets
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder
import os
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Получаем токен бота
BOT_TOKEN = os.getenv('BOT_TOKEN', '8312865169:AAHmI2FODLlt4Qcf2rr6MtRbUcB8fGtlLoU')
WEBAPP_URL = os.getenv('WEBAPP_URL', 'https://your-vite-app.onrender.com')

if not BOT_TOKEN:
    logger.error("❌ BOT_TOKEN не найден!")
    exit(1)

# Инициализация бота и диспетчера
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# WebSocket сервер для связи с фронтендом
class WebSocketServer:
    def __init__(self):
        self.clients = set()
        self.user_sessions = {}  # user_id -> websocket
    
    async def register(self, websocket, user_id):
        """Регистрация клиента"""
        self.clients.add(websocket)
        self.user_sessions[user_id] = websocket
        logger.info(f"🔗 WebSocket подключен для пользователя {user_id}")
    
    async def unregister(self, websocket, user_id):
        """Отключение клиента"""
        self.clients.discard(websocket)
        if user_id in self.user_sessions:
            del self.user_sessions[user_id]
        logger.info(f"🔌 WebSocket отключен для пользователя {user_id}")
    
    async def send_to_user(self, user_id, data):
        """Отправка данных конкретному пользователю"""
        if user_id in self.user_sessions:
            try:
                await self.user_sessions[user_id].send(json.dumps(data))
                logger.info(f"📤 Данные отправлены пользователю {user_id}")
            except Exception as e:
                logger.error(f"❌ Ошибка отправки пользователю {user_id}: {e}")
                await self.unregister(self.user_sessions[user_id], user_id)

# Создаем WebSocket сервер
ws_server = WebSocketServer()

# Обработчик команды /start
@dp.message(Command("start"))
async def start_command(message: types.Message):
    """Обработчик команды /start"""
    user = message.from_user
    logger.info(f"🎯 Команда /start от пользователя: {user.first_name} (ID: {user.id})")
    
    welcome_text = f"""🎰 Добро пожаловать в *Nimble Roulette*, {user.first_name}! 🎰

🎲 Готов испытать удачу? Нажми на кнопку ниже, чтобы открыть игру!

🎮 *Nimble Roulette* - это захватывающая игра с Telegram Stars!
💎 Покупайте Stars, делайте ставки и выигрывайте!
⚡ Реальное время через WebSocket соединение!"""

    # Создаем кнопку Web App
    builder = InlineKeyboardBuilder()
    builder.add(InlineKeyboardButton(
        text="🎮 Открыть Nimble Roulette",
        web_app=WebAppInfo(url=WEBAPP_URL)
    ))
    
    await message.answer(
        welcome_text,
        parse_mode="Markdown",
        reply_markup=builder.as_markup()
    )
    logger.info(f"✅ Приветственное сообщение отправлено пользователю {user.first_name}")

# Обработчик данных от Web App
@dp.message(lambda message: message.web_app_data is not None)
async def web_app_data_handler(message: types.Message):
    """Обработчик данных от Web App"""
    user = message.from_user
    logger.info(f"📱 Получены данные от Web App от пользователя {user.first_name}")
    
    try:
        # Парсим данные от Mini App
        web_app_data = message.web_app_data.data
        data = json.loads(web_app_data)
        
        logger.info(f"📊 Данные от Web App: {data}")
        
        # Обрабатываем различные действия
        action = data.get('action')
        
        if action == 'connect_websocket':
            # Пользователь подключается к WebSocket
            await message.answer("🔗 Подключение к игре установлено! Теперь вы можете играть в реальном времени.")
            
        elif action == 'place_bet':
            # Обработка ставки
            bet_amount = data.get('amount', 0)
            await message.answer(f"💰 Ставка {bet_amount} Stars принята! Крутим рулетку...")
            
            # Отправляем данные в WebSocket для обработки
            await ws_server.send_to_user(user.id, {
                'action': 'process_bet',
                'user_id': user.id,
                'amount': bet_amount
            })
            
        elif action == 'buy_stars':
            # Покупка Stars
            amount = data.get('amount', 0)
            await message.answer(f"💎 Запрос на покупку {amount} Stars отправлен!")
            
        elif action == 'withdraw_stars':
            # Вывод Stars
            amount = data.get('amount', 0)
            await message.answer(f"💸 Запрос на вывод {amount} Stars отправлен!")
            
        else:
            await message.answer("🎉 Данные получены! Обрабатываем...")
            
    except json.JSONDecodeError:
        await message.answer("❌ Ошибка обработки данных от Web App")
        logger.error(f"❌ Ошибка парсинга JSON от пользователя {user.id}")
    except Exception as e:
        await message.answer("❌ Произошла ошибка при обработке данных")
        logger.error(f"❌ Ошибка обработки Web App данных: {e}")

# Обработчик callback_query
@dp.callback_query()
async def callback_handler(callback: types.CallbackQuery):
    """Обработчик нажатий на кнопки"""
    await callback.answer()
    logger.info(f"🔘 Callback от пользователя {callback.from_user.first_name}")

# WebSocket обработчик
async def websocket_handler(websocket, path):
    """Обработчик WebSocket соединений"""
    user_id = None
    
    try:
        # Получаем user_id из первого сообщения
        async for message in websocket:
            try:
                data = json.loads(message)
                user_id = data.get('user_id')
                
                if user_id:
                    await ws_server.register(websocket, user_id)
                    logger.info(f"🔗 WebSocket зарегистрирован для пользователя {user_id}")
                    
                    # Отправляем подтверждение подключения
                    await websocket.send(json.dumps({
                        'action': 'connected',
                        'user_id': user_id,
                        'status': 'success'
                    }))
                    
                    # Обрабатываем входящие сообщения
                    async for msg in websocket:
                        try:
                            msg_data = json.loads(msg)
                            logger.info(f"📨 Получено WebSocket сообщение: {msg_data}")
                            
                            # Здесь можно добавить логику обработки игровых действий
                            action = msg_data.get('action')
                            
                            if action == 'spin_roulette':
                                # Симуляция рулетки
                                result = await simulate_roulette(msg_data)
                                await websocket.send(json.dumps(result))
                                
                            elif action == 'get_balance':
                                # Получение баланса
                                balance = await get_user_balance(user_id)
                                await websocket.send(json.dumps({
                                    'action': 'balance_response',
                                    'balance': balance
                                }))
                                
                        except json.JSONDecodeError:
                            logger.error(f"❌ Ошибка парсинга WebSocket сообщения")
                        except Exception as e:
                            logger.error(f"❌ Ошибка обработки WebSocket сообщения: {e}")
                            
                else:
                    logger.error("❌ Не получен user_id в WebSocket сообщении")
                    break
                    
            except json.JSONDecodeError:
                logger.error("❌ Ошибка парсинга первого WebSocket сообщения")
                break
                
    except websockets.exceptions.ConnectionClosed:
        logger.info(f"🔌 WebSocket соединение закрыто для пользователя {user_id}")
    except Exception as e:
        logger.error(f"❌ Ошибка WebSocket: {e}")
    finally:
        if user_id:
            await ws_server.unregister(websocket, user_id)

# Функции для игровой логики
async def simulate_roulette(data):
    """Симуляция рулетки"""
    import random
    
    bet_amount = data.get('amount', 10)
    result = random.randint(0, 36)
    win = random.random() > 0.6  # 40% шанс выигрыша
    
    if win:
        win_amount = int(bet_amount * random.uniform(1.5, 3.0))
        return {
            'action': 'roulette_result',
            'result': result,
            'win': True,
            'win_amount': win_amount,
            'message': f"🎉 Выигрыш! +{win_amount} Stars"
        }
    else:
        return {
            'action': 'roulette_result',
            'result': result,
            'win': False,
            'lost_amount': bet_amount,
            'message': "😔 Попробуйте еще раз!"
        }

async def get_user_balance(user_id):
    """Получение баланса пользователя (заглушка)"""
    # Здесь должна быть логика работы с базой данных
    return 100

# Запуск WebSocket сервера
async def start_websocket_server():
    """Запуск WebSocket сервера"""
    try:
        server = await websockets.serve(websocket_handler, "localhost", 8765)
        logger.info("🔌 WebSocket сервер запущен на ws://localhost:8765")
        await server.wait_closed()
    except Exception as e:
        logger.error(f"❌ Ошибка запуска WebSocket сервера: {e}")

# Главная функция
async def main():
    """Главная функция"""
    logger.info("🤖 Запуск Nimble Roulette Bot на aiogram 3...")
    
    # Запускаем WebSocket сервер в отдельной задаче
    websocket_task = asyncio.create_task(start_websocket_server())
    
    # Запускаем бота
    try:
        logger.info("🚀 Бот запущен! Нажмите Ctrl+C для остановки")
        await dp.start_polling(bot)
    except KeyboardInterrupt:
        logger.info("⏹️ Остановка бота...")
    finally:
        await bot.session.close()

if __name__ == "__main__":
    asyncio.run(main())
