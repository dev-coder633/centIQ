import Navbar from "../components/Navbar";
import "./Activity.css";

function Activity({ transactions }) {

  let categoryMap = {};

  transactions.forEach(t => {
    if (t.amount < 0) {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + Math.abs(t.amount);
    }
  });

  const entries = Object.entries(categoryMap);

  return (
    <div>
      <Navbar />

      <div className="activity">
        <h2>Spending Insights</h2>

        {entries.map(([cat, value]) => (
          <div key={cat} className="activity-card">
            <span>{cat}</span>
            <span>₹ {value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activity;