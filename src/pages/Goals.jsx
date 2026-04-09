import { useState } from "react";
import Navbar from "../components/Navbar";
import "./Goals.css";

function Goals({ transactions }) {
  const [budget, setBudget] = useState(5000);

  const spent = transactions
    .filter(t => t.amount < 0)
    .reduce((a,t)=>a+Math.abs(t.amount),0);

  const percent = Math.min((spent / budget) * 100, 100);

  return (
    <div>
      <Navbar />

      <div className="goals">
        <h2>Budget Tracker</h2>

        <input
          type="number"
          onChange={(e)=>setBudget(Number(e.target.value))}
          placeholder="Set Budget"
        />

        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        <p>₹ {spent} / ₹ {budget}</p>
      </div>
    </div>
  );
}

export default Goals;