# Live-Stock-Market-Watchlist-Alert-System

Project Overview
This is a full-stack web application for stock watchlists, built using React for the frontend and FastAPI for the backend. Users can add, view, and remove stocks from their watchlist, with real-time updates using WebSockets.

Features
User authentication
Add stocks to the watchlist
Remove stocks from the watchlist
Real-time stock price updates using WebSockets
Responsive UI

Tech Stack

Frontend
React
Axios
WebSockets

Backend
FastAPI
MYSQL

Installation & Setup
1. Clone the Repository
   git clone <your-repository-link>
   cd store-rating-app

2. Backend Setup (FastAPI)

Install dependencies:
pip install -r requirements.txt

Run the FastAPI server:
uvicorn main:app --reload
The backend will be available at http://localhost:8000.

3. Frontend Setup (React)

Navigate to the frontend directory:
cd frontend

Install dependencies:
npm install

Run the React app:
npm start
The frontend will be available at http://localhost:3000.

API Endpoints

User Authentication
POST /register - Register a new user
POST /login - Authenticate user

Watchlist
GET /watchlist/{user_id} - Get user's watchlist
POST /watchlist - Add stock to watchlist
DELETE /watchlist/{symbol} - Remove stock from watchlist

WebSockets
ws://localhost:8000/ws/{user_id} - Real-time stock updates

Deployment
Backend Deployment (FastAPI)
Use Docker or deploy on Heroku, AWS, or Vercel.
Example with Uvicorn & Gunicorn:
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app

Frontend Deployment (React)

Deploy on Vercel, Netlify, or GitHub Pages.
Build production-ready frontend:
npm run build
Serve the built files using a static file server

Contributing

Fork the repository.

Create a feature branch: git checkout -b feature-name

Commit changes: git commit -m "Added new feature"

Push branch: git push origin feature-name

Open a Pull Request.

Maintainer: Sanket Khandagale
For any issues, feel free to open an issue on GitHub!
