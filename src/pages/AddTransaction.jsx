import Navbar from "../components/Navbar";
import AddTransactionForm from "../components/AddTransactionForm";

function AddTransaction({ setTransactions }) {
  return (
    <div>
      <Navbar />
      <h1>Add Transaction</h1>
      <AddTransactionForm setTransactions={setTransactions} />
    </div>
  );
}

export default AddTransaction;