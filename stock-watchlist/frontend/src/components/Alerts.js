import { useState } from "react";
import axios from "axios";

const Alerts = ({ token, userId }) => {
  const [symbol, setSymbol] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  const setAlert = async () => {
    await axios.post(
      "http://localhost:8000/alerts",
      { symbol, target_price: parseFloat(targetPrice) },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSymbol("");
    setTargetPrice("");
  };

  return (
    <div className="alerts-container">
      <h2>Set Price Alert</h2>
      <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Stock symbol" />
      <input value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} placeholder="Target price" type="number" />
      <button onClick={setAlert}>Set Alert</button>
    </div>
  );
};

export default Alerts;