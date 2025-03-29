import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import StockSearch from "./components/StockSearch";
import Watchlist from "./components/Watchlist";
import Alerts from "./components/Alerts";

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <div className="app-container">
        <h1>Stock Market Watchlist</h1>
        <Routes>
          <Route
            path="/"
            element={
              !token ? (
                <Auth setToken={setToken} setUserId={setUserId} />
              ) : (
                <>
                  <StockSearch token={token} userId={userId} />
                  <Watchlist token={token} userId={userId} />
                  <Alerts token={token} userId={userId} />
                </>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;