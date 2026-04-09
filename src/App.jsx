import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Dashboard from "./pages/Dashboard";
import Activity from "./pages/Activity";
import Suggestions from "./pages/Suggestions";
import AddTransaction from "./pages/AddTransaction";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";

function App() {
  // 🔥 Load from localStorage initially
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // 🔥 Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard transactions={transactions} />} />
        <Route path="/activity" element={<Activity transactions={transactions} />} />
        <Route path="/suggestions" element={<Suggestions transactions={transactions} />} />
        <Route path="/add" element={<AddTransaction setTransactions={setTransactions} />} />
        <Route
          path="/transactions"
          element={
            <Transactions
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />
        <Route path="/goals" element={<Goals transactions={transactions} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;