import { useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import TransactionList from "../components/TransactionList";
import TransactionPopup from "../components/TransactionPopup";
import "./Dashboard.css";

const MOCK_MERCHANTS = [
  { name: "Zomato",    minAmt: 150,  maxAmt: 800,  type: "debit" },
  { name: "Uber",      minAmt: 80,   maxAmt: 500,  type: "debit" },
  { name: "Amazon",    minAmt: 299,  maxAmt: 3000, type: "debit" },
  { name: "Swiggy",    minAmt: 120,  maxAmt: 700,  type: "debit" },
  { name: "Netflix",   minAmt: 199,  maxAmt: 649,  type: "debit" },
  { name: "Flipkart",  minAmt: 499,  maxAmt: 5000, type: "debit" },
  { name: "BigBasket", minAmt: 300,  maxAmt: 1500, type: "debit" },
  { name: "Apollo",    minAmt: 200,  maxAmt: 2000, type: "debit" },
  { name: "Myntra",    minAmt: 599,  maxAmt: 4000, type: "debit" },
  { name: "Spotify",   minAmt: 119,  maxAmt: 119,  type: "debit" },
];

const SALARY_AMOUNT = 50000;

const SALARY_SPLIT = [
  { category: "Bills",         share: 0.30, label: "Needs (30%)"     },
  { category: "Shopping",      share: 0.20, label: "Wants (20%)"     },
  { category: "Investment",    share: 0.20, label: "Savings (20%)"   },
  { category: "Food",          share: 0.15, label: "Food (15%)"      },
  { category: "Transport",     share: 0.10, label: "Transport (10%)" },
  { category: "Entertainment", share: 0.05, label: "Fun (5%)"        },
];

const BUDGET_LIMITS = {
  Food: 5000, Transport: 3000, Shopping: 8000,
  Bills: 6000, Entertainment: 2000, Health: 3000,
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getBudgetWarning(category, amount, transactions) {
  const limit = BUDGET_LIMITS[category];
  if (!limit) return null;
  const spent = transactions
    .filter(t => t.type === "expense" && t.category === category)
    .reduce((s, t) => s + t.amount, 0);
  const newTotal = spent + amount;
  if (newTotal >= limit)
    return `Budget limit for ${category} reached! (₹${newTotal.toLocaleString("en-IN")} / ₹${limit.toLocaleString("en-IN")})`;
  if (newTotal >= limit * 0.8)
    return `You are at ${Math.round((newTotal / limit) * 100)}% of your ${category} budget.`;
  return null;
}

function SpendingMood({ ratio }) {
  if (ratio >= 0.8) return { emoji: "🚨", label: "Overspending", tone: "danger" };
  if (ratio >= 0.5) return { emoji: "😬", label: "High spending", tone: "warning" };
  if (ratio >= 0.2) return { emoji: "😃", label: "Balanced",      tone: "neutral" };
  return               { emoji: "🤑", label: "Saving well",   tone: "good"    };
}

function SalaryToast({ splits, onClose }) {
  if (!splits) return null;
  return (
    <div style={{
      position:"fixed", bottom:"2rem", right:"2rem", zIndex:900,
      background:"#111118", border:"1px solid #2a2a35", borderRadius:"14px",
      padding:"1.25rem", minWidth:"280px", maxWidth:"340px",
      animation:"slideUpPopup 0.25s ease", boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
        <span style={{fontSize:"14px",fontWeight:700,color:"#34d399"}}>
          💰 Salary Credited — ₹{SALARY_AMOUNT.toLocaleString("en-IN")}
        </span>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#6b6b80",cursor:"pointer",fontSize:"18px",lineHeight:1}}>×</button>
      </div>
      <div style={{fontSize:"11px",color:"#6b6b80",fontFamily:"var(--font-mono)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"10px"}}>
        50-30-20 Distribution
      </div>
      {splits.map(({ label, amount }) => (
        <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #18181f"}}>
          <span style={{fontSize:"13px",color:"#e8e8f0"}}>{label}</span>
          <span style={{fontSize:"13px",fontFamily:"var(--font-mono)",color:"#34d399"}}>₹{amount.toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ transactions = [], onDelete, onAdd }) {
  const [pendingTx,    setPendingTx]    = useState(null);
  const [salaryToast,  setSalaryToast]  = useState(null);
  const [lastConfirmed,setLastConfirmed]= useState(null);

  const stats = useMemo(() => {
    const income  = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const ratio = stats.income > 0 ? stats.expense / stats.income : 0;
  const mood  = SpendingMood({ ratio });

  const categoryTotals = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [transactions]);

  const maxCat       = categoryTotals[0]?.[1] || 1;
  const gradientClass = "dash__bg--" + mood.tone;

  const simulateTransaction = useCallback(() => {
    const m = MOCK_MERCHANTS[randInt(0, MOCK_MERCHANTS.length - 1)];
    setPendingTx({ id: Date.now(), merchant: m.name, amount: randInt(m.minAmt, m.maxAmt), rawType: m.type });
  }, []);

  const simulateSalary = useCallback(() => {
    const splits = SALARY_SPLIT.map(({ category, share, label }) => ({
      category, label, amount: Math.round(SALARY_AMOUNT * share),
    }));
    splits.forEach(({ category, amount }) =>
      onAdd?.({ id: Date.now() + Math.random(), amount, category, type: "income", date: new Date().toISOString() })
    );
    onAdd?.({ id: Date.now(), amount: SALARY_AMOUNT, category: "Salary", type: "income", date: new Date().toISOString() });
    setSalaryToast(splits);
    setTimeout(() => setSalaryToast(null), 8000);
  }, [onAdd]);

  const handleConfirm = useCallback((tx) => {
    onAdd?.(tx);
    setLastConfirmed(tx);
    setPendingTx(null);
    setTimeout(() => setLastConfirmed(null), 3000);
  }, [onAdd]);

  const budgetWarning = useMemo(() => {
    if (!pendingTx || pendingTx.rawType === "credit") return null;
    const CATEGORY_MAP = { Zomato:"Food", Swiggy:"Food", Uber:"Transport", Ola:"Transport", Amazon:"Shopping", Flipkart:"Shopping", Netflix:"Entertainment", Spotify:"Entertainment", BigBasket:"Food", Myntra:"Shopping", Apollo:"Health" };
    const cat = CATEGORY_MAP[pendingTx.merchant] || null;
    return cat ? getBudgetWarning(cat, pendingTx.amount, transactions) : null;
  }, [pendingTx, transactions]);

  return (
    <div className={"dash " + gradientClass}>

      {pendingTx && (
        <TransactionPopup
          transaction={pendingTx}
          onConfirm={handleConfirm}
          onDismiss={() => setPendingTx(null)}
          budgetWarning={budgetWarning}
        />
      )}

      <SalaryToast splits={salaryToast} onClose={() => setSalaryToast(null)} />

      {lastConfirmed && (
        <div style={{
          position:"fixed", bottom:"2rem", left:"50%", transform:"translateX(-50%)",
          background:"rgba(52,211,153,0.15)", border:"1px solid rgba(52,211,153,0.35)",
          borderRadius:"20px", padding:"8px 20px", zIndex:800,
          fontSize:"13px", color:"#34d399", fontFamily:"var(--font-mono)",
          animation:"fadeIn 0.2s ease", whiteSpace:"nowrap",
        }}>
          ✓ Logged — {lastConfirmed.category} ₹{lastConfirmed.amount.toLocaleString("en-IN")}
        </div>
      )}

      <header className="dash__header">
        <div>
          <h1 className="dash__title">Overview</h1>
          <p className="dash__subtitle">Your financial pulse</p>
        </div>
        <div className="dash__mood">
          <span className="dash__mood-emoji">{mood.emoji}</span>
          <span className="dash__mood-label">{mood.label}</span>
        </div>
      </header>

      <div className="dash__sim-row">
        <button className="dash__sim-btn dash__sim-btn--tx" onClick={simulateTransaction}>
          ⚡ Simulate Transaction
        </button>
        <button className="dash__sim-btn dash__sim-btn--salary" onClick={simulateSalary}>
          💰 Simulate Salary Credit
        </button>
      </div>

      <div className="dash__cards">
        <div className="dash__card dash__card--balance">
          <span className="dash__card-label">Net balance</span>
          <span className={"dash__card-value" + (stats.balance < 0 ? " dash__card-value--neg" : "")}>
            ₹{Math.abs(stats.balance).toLocaleString("en-IN")}
          </span>
          {stats.balance < 0 && <span className="dash__card-tag">deficit</span>}
        </div>
        <div className="dash__card dash__card--income">
          <span className="dash__card-label">Total income</span>
          <span className="dash__card-value dash__card-value--income">
            ₹{stats.income.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="dash__card dash__card--expense">
          <span className="dash__card-label">Total expenses</span>
          <span className="dash__card-value dash__card-value--expense">
            ₹{stats.expense.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {stats.income > 0 && (
        <div className="dash__progress-section">
          <div className="dash__progress-header">
            <span className="dash__progress-label">Expense ratio</span>
            <span className="dash__progress-pct">{Math.round(ratio * 100)}%</span>
          </div>
          <div className="dash__progress-track">
            <div className="dash__progress-bar" style={{ width: Math.min(ratio * 100, 100) + "%" }} />
          </div>
        </div>
      )}

      <div className="dash__bottom">
        {categoryTotals.length > 0 && (
          <div className="dash__section">
            <h2 className="dash__section-title">Top categories</h2>
            <div className="dash__cats">
              {categoryTotals.map(([cat, amt]) => (
                <div className="dash__cat-row" key={cat}>
                  <span className="dash__cat-name">{cat}</span>
                  <div className="dash__cat-bar-track">
                    <div className="dash__cat-bar" style={{ width: ((amt / maxCat) * 100) + "%" }} />
                  </div>
                  <span className="dash__cat-amt">₹{amt.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dash__section">
          <div className="dash__section-header">
            <h2 className="dash__section-title">Recent transactions</h2>
            <Link to="/transactions" className="dash__see-all">See all →</Link>
          </div>
          <TransactionList transactions={transactions} onDelete={onDelete} limit={5} />
        </div>
      </div>
    </div>
  );
}