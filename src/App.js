import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [selectedCryptos, setSelectedCryptos] = useState(() => {
    const savedCryptos = localStorage.getItem("selectedCryptos");
    return savedCryptos ? JSON.parse(savedCryptos) : [
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
    ];
  });

  const [prices, setPrices] = useState({});
  const [error, setError] = useState("");

  // Сохранение списка криптовалют в localStorage
  useEffect(() => {
    localStorage.setItem("selectedCryptos", JSON.stringify(selectedCryptos));
  }, [selectedCryptos]);

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
  }, []);

  // Обновление цен каждые 5 секунд
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
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
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#121212",
        color: "#e0e0e0",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "#f3ba2f" }}>Binance Price Tracker</h1>

      {error && <p style={{ color: "#ff4d4f" }}>{error}</p>}

      <h2 style={{ borderBottom: "1px solid #333", paddingBottom: "10px" }}>
        Selected Cryptocurrencies
      </h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {selectedCryptos.map((symbol) => (
          <li
            key={symbol}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #333",
              borderRadius: "5px",
              backgroundColor: "#1e1e1e",
            }}
          >
            <span>
              {symbol}: {prices[symbol] || "Loading..."} USDT
            </span>
            <button
              style={{
                marginLeft: "10px",
                color: "#ff4d4f",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => removeCrypto(symbol)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <h2 style={{ borderBottom: "1px solid #333", paddingBottom: "10px" }}>
        Add Cryptocurrency
      </h2>
      <input
        type="text"
        placeholder="Enter symbol (e.g., LTCUSDT)"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addCrypto(e.target.value.toUpperCase());
            e.target.value = "";
          }
        }}
        style={{
          padding: "10px",
          border: "1px solid #333",
          borderRadius: "5px",
          backgroundColor: "#1e1e1e",
          color: "#e0e0e0",
          width: "100%",
        }}
      />
    </div>
  );
};

export default App;