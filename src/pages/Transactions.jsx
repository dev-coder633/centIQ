import Navbar from "../components/Navbar";
import TransactionList from "../components/TransactionList";

function Transactions({ transactions, setTransactions }) {
  return (
    <div>
      <Navbar />
      <h1>All Transactions</h1>

      <TransactionList
        transactions={transactions}
        setTransactions={setTransactions}
      />
    </div>
  );
}

export default Transactions;