import { useState, useEffect, useCallback } from "react";

const CATEGORY_MAP = {
  Zomato: "Food",
  Swiggy: "Food",
  Uber: "Transport",
  Ola: "Transport",
  Amazon: "Shopping",
  Flipkart: "Shopping",
  Netflix: "Entertainment",
  Spotify: "Entertainment",
  BigBasket: "Food",
  Myntra: "Shopping",
  Apollo: "Health",
  PharmEasy: "Health",
};

const ALL_CATEGORIES = [
  "Food", "Transport", "Shopping", "Bills",
  "Entertainment", "Health", "Investment", "Other",
];

const TIMER_SECONDS = 30 * 60;

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function TransactionPopup({
  transaction,
  onConfirm,
  onDismiss,
  budgetWarning
}) {
  const suggestedCategory = CATEGORY_MAP[transaction?.merchant] || "Other";
  const [category, setCategory] = useState(suggestedCategory);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setCategory(CATEGORY_MAP[transaction?.merchant] || "Other");
    setTimeLeft(TIMER_SECONDS);
    setExpired(false);
  }, [transaction]);

  useEffect(() => {
    if (!transaction) return;
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, transaction]);

  const handleConfirm = useCallback(() => {
    if (!transaction) return;
    onConfirm({
      id: transaction.id,
      amount: transaction.amount,
      category,
      type: transaction.rawType === "credit" ? "income" : "expense",
      date: new Date().toISOString(),
    });
  }, [transaction, category, onConfirm]);

  if (!transaction) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#111",
        padding: "20px",
        borderRadius: "10px",
        width: "300px"
      }}>
        <h3>{transaction.merchant}</h3>
        <p>₹{transaction.amount}</p>

        <select value={category} onChange={e => setCategory(e.target.value)}>
          {ALL_CATEGORIES.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <p>Time left: {formatTime(timeLeft)}</p>

        {expired && <p style={{ color: "red" }}>Time expired</p>}

        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={onDismiss}>Dismiss</button>
      </div>
    </div>
  );
}