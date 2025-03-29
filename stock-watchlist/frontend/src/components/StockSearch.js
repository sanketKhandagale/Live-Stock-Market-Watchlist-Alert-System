
import { useState } from "react";
import axios from "axios";

const StockSearch = ({ token, userId }) => {
  const [symbol, setSymbol] = useState("");

  const addStock = async () => {
    const trimmedSymbol = symbol.trim();
    const payload = { symbol: String(trimmedSymbol) };
    console.log("Sending watchlist payload:", JSON.stringify(payload));
    console.log("Symbol type:", typeof trimmedSymbol);
    if (!trimmedSymbol) {
      alert("Please enter a stock symbol.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/watchlist",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Watchlist response:", response.data);
      setSymbol("");
    } catch (error) {
      console.error("Watchlist Error Full:", JSON.stringify(error.response ? error.response.data : error.message, null, 2));
      alert("Failed to add stock: " + (error.response ? JSON.stringify(error.response.data, null, 2) : error.message));
    }
  };

  return (
    <div className="search-container">
      <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Enter stock symbol (e.g., AAPL)" />
      <button onClick={addStock}>Add to Watchlist</button>
    </div>
  );
};

export default StockSearch;