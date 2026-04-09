import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>💰 Finance Tracker</h2>

      <div>
        <Link to="/">Dashboard</Link>
        <Link to="/activity">Activity</Link>
        <Link to="/suggestions">Suggestions</Link>
        <Link to="/add">Add</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/goals">Goals</Link>
      </div>
    </nav>
  );
}

export default Navbar;