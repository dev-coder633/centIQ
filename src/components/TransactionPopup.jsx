import { useState, useEffect, useCallback } from "react";

const CATEGORY_MAP = {
  Zomato:    "Food",
  Swiggy:    "Food",
  Uber:      "Transport",
  Ola:       "Transport",
  Amazon:    "Shopping",
  Flipkart:  "Shopping",
  Netflix:   "Entertainment",
  Spotify:   "Entertainment",
  BigBasket: "Food",
  Myntra:    "Shopping",
  Apollo:    "Health",
  PharmEasy: "Health",
};

const ALL_CATEGORIES = [
  "Food", "Transport", "Shopping", "Bills",
  "Entertainment", "Health", "Investment", "Other",
];

const TIMER_SECONDS = 30 * 60; // 30 minutes

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  padding: "1rem",
  animation: "fadeInOverlay 0.2s ease",
};

export default function TransactionPopup({ transaction, onConfirm, onDismiss, budgetWarning }) {
  const suggestedCategory = CATEGORY_MAP[transaction?.merchant] || "Other";
  const [category, setCategory] = useState(suggestedCategory);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [expired, setExpired] = useState(false);

  // Reset category when a new transaction comes in
  useEffect(() => {
    setCategory(CATEGORY_MAP[transaction?.merchant] || "Other");
    setTimeLeft(TIMER_SECONDS);
    setExpired(false);
  }, [transaction?.merchant, transaction?.id]);

  // Countdown timer
  useEffect(() => {
    if (!transaction) return;
    if (timeLeft <= 0) { setExpired(true); return; }
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

  const isCredit   = transaction.rawType === "credit";
  const timerPct   = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft < 120 ? "#f87171" : timeLeft < 300 ? "#fbbf24" : "#c8f135";

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onDismiss()}>
      <div style={{
        background: "#111118",
        border: "1px solid #2a2a35",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "420px",
        overflow: "hidden",
        animation: "slideUpPopup 0.25s ease",
      }}>

        {/* Timer bar */}
        <div style={{ height: "3px", background: "#18181f" }}>
          <div style={{
            height: "100%",
            width: `${timerPct}%`,
            background: timerColor,
            transition: "width 1s linear, background 0.3s",
          }} />
        </div>

        <div style={{ padding: "1.5rem" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: isCredit ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
                border: `1px solid ${isCredit ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
              }}>
                {isCredit ? "⬆" : "⬇"}
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "#6b6b80", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {isCredit ? "Credit detected" : "Debit detected"}
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: isCredit ? "#34d399" : "#f87171", fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}>
                  {isCredit ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "#6b6b80", fontFamily: "var(--font-mono)" }}>auto-close in</div>
              <div style={{ fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-mono)", color: timerColor }}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Merchant */}
          <div style={{
            background: "#18181f", border: "1px solid #2a2a35",
            borderRadius: "10px", padding: "12px 14px", marginBottom: "1.25rem",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: "13px", color: "#6b6b80", fontFamily: "var(--font-mono)" }}>Merchant</span>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#e8e8f0" }}>{transaction.merchant}</span>
          </div>

          {/* Category selector */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "11px", color: "#6b6b80", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              Category
              {CATEGORY_MAP[transaction.merchant] && (
                <span style={{ marginLeft: "8px", color: "#c8f135", fontSize: "10px" }}>● auto-detected</span>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {ALL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "6px 12px", borderRadius: "20px", fontSize: "12px",
                    fontFamily: "var(--font-display)", fontWeight: 600, cursor: "pointer",
                    border: `1px solid ${category === cat ? "#c8f135" : "#2a2a35"}`,
                    background: category === cat ? "rgba(200,241,53,0.1)" : "#18181f",
                    color: category === cat ? "#c8f135" : "#6b6b80",
                    transition: "all 0.15s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Budget warning */}
          {budgetWarning && (
            <div style={{
              background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)",
              borderRadius: "8px", padding: "10px 12px", marginBottom: "1.25rem",
              display: "flex", gap: "8px", alignItems: "flex-start",
            }}>
              <span style={{ fontSize: "14px" }}>⚠️</span>
              <span style={{ fontSize: "12px", color: "#fbbf24", fontFamily: "var(--font-mono)", lineHeight: 1.5 }}>
                {budgetWarning}
              </span>
            </div>
          )}

          {/* Expired notice */}
          {expired && (
            <div style={{
              background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: "8px", padding: "10px 12px", marginBottom: "1.25rem",
              fontSize: "12px", color: "#f87171", fontFamily: "var(--font-mono)", textAlign: "center",
            }}>
              Timer expired — transaction not yet logged
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleConfirm}
              style={{
                flex: 1, padding: "11px", borderRadius: "10px", border: "none",
                background: "#c8f135", color: "#0a0a0f",
                fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-display)",
                cursor: "pointer", transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.target.style.opacity = "0.85"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >
              ✓ Confirm & Log
            </button>
            <button
              onClick={onDismiss}
              style={{
                padding: "11px 16px", borderRadius: "10px",
                border: "1px solid #2a2a35", background: "#18181f",
                color: "#6b6b80", fontSize: "14px", fontWeight: 600,
                fontFamily: "var(--font-display)", cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.target.style.borderColor = "#3a3a48"; e.target.style.color = "#e8e8f0"; }}
              onMouseLeave={e => { e.target.style.borderColor = "#2a2a35"; e.target.style.color = "#6b6b80"; }}
            >
              Dismiss
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpPopup  { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}