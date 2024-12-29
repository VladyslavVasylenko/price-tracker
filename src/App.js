import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [selectedCryptos, setSelectedCryptos] = useState([
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "ADAUSDT",
    "XRPUSDT",
    "DOGEUSDT",
    "SOLUSDT",
    "DOTUSDT",
    "MATICUSDT",
    "SHIBUSDT",
  ]);
  const [prices, setPrices] = useState({});
  const [error, setError] = useState("");

  // Функция для получения цен
  const fetchPrices = async () => {
    try {
      const promises = selectedCryptos.map((symbol) =>
        axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
      );
      const responses = await Promise.all(promises);

      const newPrices = {};
      responses.forEach((response) => {
        const { symbol, price } = response.data;
        newPrices[symbol] = price;
      });

      setPrices(newPrices);
    } catch (error) {
      console.error("Error fetching prices:", error);
      setError("Failed to fetch prices. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);
  

  // Обновление цен каждые 5 секунд
  useEffect(() => {
    fetchPrices(); // Получение цен при загрузке
    const interval = setInterval(fetchPrices, 5000); // Обновление каждые 5 секунд
    return () => clearInterval(interval);
  }, [selectedCryptos]);

  // Добавление криптовалюты
  const addCrypto = (symbol) => {
    if (selectedCryptos.includes(symbol)) {
      setError("This cryptocurrency is already in the list.");
      return;
    }
    if (selectedCryptos.length >= 10) {
      setError("You can only track up to 10 cryptocurrencies.");
      return;
    }
    setSelectedCryptos([...selectedCryptos, symbol]);
    setError(""); // Очистить сообщение об ошибке
  };

  // Удаление криптовалюты
  const removeCrypto = (symbol) => {
    setSelectedCryptos(selectedCryptos.filter((crypto) => crypto !== symbol));
    setError(""); // Очистить сообщение об ошибке
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Binance Price Tracker</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Selected Cryptocurrencies</h2>
      <ul>
        {selectedCryptos.map((symbol) => (
          <li key={symbol}>
            {symbol}: {prices[symbol] || "Loading..."} USDT
            <button
              style={{
                marginLeft: "10px",
                color: "red",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
              onClick={() => removeCrypto(symbol)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <h2>Add Cryptocurrency</h2>
      <input
        type="text"
        placeholder="Enter symbol (e.g., LTCUSDT)"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addCrypto(e.target.value.toUpperCase());
            e.target.value = "";
          }
        }}
      />
    </div>
  );
};

export default App;