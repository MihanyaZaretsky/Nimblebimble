from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import asyncio
from bot import bot, create_invoice_link

app = FastAPI(title="Nimble Bot API", version="1.0.0")

# Настройка CORS для Web App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://nimblebimble.onrender.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модели данных
class InvoiceRequest(BaseModel):
    user_id: int
    amount: int
    currency: str = "TON"  # TON или Stars
    description: str = "Пополнение баланса"

class PaymentStatusRequest(BaseModel):
    user_id: int

# API эндпоинты
@app.get("/")
async def root():
    return {"message": "Nimble Bot API работает!"}

@app.post("/api/createInvoiceLink")
async def create_invoice(request: InvoiceRequest):
    """Создание ссылки на оплату через Telegram Stars"""
    try:
        print(f"🔵 Запрос на создание инвойса: {request}")
        
        # Создаем инвойс через бота (используем Stars по умолчанию)
        invoice_link = await create_invoice_link(
            user_id=request.user_id,
            amount=request.amount,
            currency="Stars",  # Всегда используем Stars
            description=request.description
        )
        
        return {
            "success": True,
            "invoice_url": invoice_link,
            "user_id": request.user_id
        }
        
    except Exception as e:
        print(f"❌ Ошибка создания инвойса: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/paymentStatus/{user_id}")
async def get_payment_status(user_id: int):
    """Проверка статуса платежа"""
    try:
        # Здесь можно добавить логику проверки платежей
        return {
            "success": True,
            "hasPaid": False,  # Пока заглушка
            "user_id": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/balance/{user_id}")
async def get_balance(user_id: int):
    """Получение баланса пользователя"""
    try:
        # Здесь можно добавить логику получения баланса
        return {
            "success": True,
            "balance": 0,  # Пока заглушка
            "user_id": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Запуск FastAPI сервера...")
    uvicorn.run(app, host="0.0.0.0", port=8000) 