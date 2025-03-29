from fastapi import FastAPI, Depends, HTTPException, WebSocket, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db, Base, engine
from models import User, Watchlist, Alert
from auth import create_access_token, get_password_hash, get_current_user, verify_password  
import yfinance as yf
import asyncio
import aiosmtplib
from email.message import EmailMessage


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

Base.metadata.create_all(bind=engine)

class WatchlistRequest(BaseModel):
    symbol: str

# Request Models
class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class StockRequest(BaseModel):
    symbol: str

class AlertRequest(BaseModel):
    symbol: str
    target_price: float

# Authentication Endpoints
@app.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == request.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = get_password_hash(request.password)
    user = User(username=request.username, email=request.email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"msg": "User created", "user_id": user.id}

@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request.username).first()
    if not user or not verify_password(request.password, user.hashed_password):  
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "user_id": user.id}

# Watchlist Endpoints
@app.post("/watchlist")
async def add_stock(request: Request, watchlist: WatchlistRequest, user=Depends(get_current_user), db: Session = Depends(get_db)):
    raw_body = await request.body()
    print(f"Raw request body: {raw_body}")
    print(f"Parsed symbol: {watchlist.symbol}")
    print(f"User from token: {user.username}")
    stock = Watchlist(user_id=user.id, stock_symbol=watchlist.symbol.upper())
    db.add(stock)
    db.commit()
    return {"msg": "Stock added"}

@app.delete("/watchlist/{symbol}")
def remove_stock(symbol: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    stock = db.query(Watchlist).filter(Watchlist.user_id == user.id, Watchlist.stock_symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    db.delete(stock)
    db.commit()
    return {"msg": "Stock removed"}

# Alerts Endpoint
@app.post("/alerts")
def set_alert(request: AlertRequest, user=Depends(get_current_user), db: Session = Depends(get_db)):
    alert = Alert(user_id=user.id, stock_symbol=request.symbol.upper(), target_price=request.target_price)
    db.add(alert)
    db.commit()
    return {"msg": "Alert set"}

# Email Notification
async def send_email(user_id: int, symbol: str, price: float, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return
    msg = EmailMessage()
    msg["Subject"] = f"Price Alert: {symbol}"
    msg["From"] = "noreply@example.com"  
    msg["To"] = user.email
    msg.set_content(f"{symbol} has reached your target price of ${price}")
    await aiosmtplib.send(
        msg,
        hostname="smtp.gmail.com",
        port=587,
        username="your-email@example.com",  
        password="your-email-password",       
        use_tls=True
    )

# WebSocket for Real-Time Updates
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, db: Session = Depends(get_db)):
    await websocket.accept()
    while True:
        watchlist = db.query(Watchlist).filter(Watchlist.user_id == user_id).all()
        for stock in watchlist:
            data = yf.Ticker(stock.stock_symbol).info
            price = data.get("regularMarketPrice")
            if price:
                await websocket.send_json({"symbol": stock.stock_symbol, "price": price})
                alerts = db.query(Alert).filter(Alert.user_id == user_id, Alert.stock_symbol == stock.stock_symbol, Alert.triggered == False).all()
                for alert in alerts:
                    if price >= alert.target_price:
                        await send_email(user_id, stock.stock_symbol, price, db)
                        alert.triggered = True
                        db.commit()
        await asyncio.sleep(5)  # Update every 5 seconds
