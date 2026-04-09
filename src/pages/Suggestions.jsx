import Navbar from "../components/Navbar";
import "./Suggestions.css";

function Suggestions({ transactions }) {

  const total = transactions.reduce((a,t)=>a+t.amount,0);

  return (
    <div>
      <Navbar />

      <div className="suggestions">
        <h2>Smart Suggestions</h2>

        <div className="suggestion-card">
          {total < 0
            ? "⚠ Reduce unnecessary expenses"
            : "✅ You are managing money well"}
        </div>

        <div className="suggestion-card">
          "Track daily spending for better insights"
        </div>

      </div>
    </div>
  );
}

export default Suggestions;