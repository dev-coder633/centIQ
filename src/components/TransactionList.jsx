import TransactionItem from "./TransactionItem";

function TransactionList({ transactions = [], setTransactions }) {

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  if (transactions.length === 0) {
    return <p>No transactions yet</p>;
  }

  return (
    <div>
      {transactions.map((t) => (
        <TransactionItem
          key={t.id}
          transaction={t}
          deleteTransaction={deleteTransaction}
        />
      ))}
    </div>
  );
}

export default TransactionList;