import Navbar from "../components/Navbar";
import "./Dashboard.css";

function Dashboard({ transactions }) {
  const total = transactions.reduce((a, t) => a + t.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((a,t)=>a+t.amount,0);
  const expense = transactions.filter(t => t.amount < 0).reduce((a,t)=>a+t.amount,0);

  const recent = transactions.slice(-4);

  return (
    <div>
      <Navbar />

      <div className="dashboard">

        <div className="cards">
          <div className="card balance">
            <h3>Total Balance</h3>
            <h1>₹ {total}</h1>
          </div>

          <div className="card income">
            <h3>Income</h3>
            <h2>₹ {income}</h2>
          </div>

          <div className="card expense">
            <h3>Expense</h3>
            <h2>₹ {Math.abs(expense)}</h2>
          </div>
        </div>

        <div className="recent">
          <h3>Recent Transactions</h3>
          {recent.map(t => (
            <div key={t.id} className="recent-item">
              <span>{t.title}</span>
              <span className={t.amount > 0 ? "green" : "red"}>
                ₹{t.amount}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;