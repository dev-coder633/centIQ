function TransactionItem({ transaction, deleteTransaction }) {
  const { id, title, amount, category } = transaction;
  const isIncome = amount > 0;

  return (
    <div className="card transaction">
      <div>
        <strong>{title}</strong>
        <p>{category}</p>
      </div>

      <div>
        <p style={{ color: isIncome ? "green" : "red" }}>
          ₹{amount}
        </p>
        <button onClick={() => deleteTransaction(id)}>Delete</button>
      </div>
    </div>
  );
}

export default TransactionItem;