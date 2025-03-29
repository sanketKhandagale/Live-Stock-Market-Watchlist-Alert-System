import { useState, useEffect } from "react";
import axios from "axios";

const Watchlist = ({ token, userId }) => {
  const [stocks, setStocks] = useState({});
  const [wsError, setWsError] = useState(null);

  useEffect(() => {
    let ws;
    const connectWebSocket = () => {
      console.log("Attempting to connect WebSocket for userId:", userId);
      ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

      ws.onopen = () => {
        console.log("WebSocket Connected");
        setWsError(null);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setStocks((prev) => ({ ...prev, [data.symbol]: data.price }));
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        setWsError("Failed to connect to real-time updates. Retrying...");
      };

      ws.onclose = (event) => {
        console.log("WebSocket Disconnected:", event);
        setWsError("WebSocket disconnected. Retrying...");
        setTimeout(connectWebSocket, 5000); // Retry after 5 seconds
      };
    };

    if (userId) {
      connectWebSocket();
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [userId]);

  const removeStock = async (symbol) => {
    try {
      await axios.delete(`http://localhost:8000/watchlist/${symbol}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStocks((prev) => {
        const newStocks = { ...prev };
        delete newStocks[symbol];
        return newStocks;
      });
    } catch (error) {
      console.error("Remove Stock Error:", error.response ? error.response.data : error.message);
      alert("Failed to remove stock: " + (error.response ? JSON.stringify(error.response.data) : error.message));
    }
  };

  return (
    <div className="watchlist-container">
      <h2>Your Watchlist</h2>
      {wsError && <p style={{ color: "red" }}>{wsError}</p>}
      <ul>
        {Object.entries(stocks).map(([symbol, price]) => (
          <li key={symbol}>
            {symbol}: ${price} <button onClick={() => removeStock(symbol)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;