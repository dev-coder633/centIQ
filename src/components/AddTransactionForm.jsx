import { useState } from "react";

function AddTransactionForm({ setTransactions }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [mood, setMood] = useState("Happy");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      id: Date.now(),
      title,
      amount: Number(amount),
      category,
      mood,
      date: new Date().toISOString(),
    };

    setTransactions((prev) => [...prev, newTransaction]);

    setTitle("");
    setAmount("");
    setCategory("Food");
    setMood("Happy");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title"/>
      <input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount"/>

      <select value={category} onChange={(e)=>setCategory(e.target.value)}>
        <option>Food</option>
        <option>Travel</option>
        <option>Shopping</option>
        <option>Salary</option>
      </select>

      <select value={mood} onChange={(e)=>setMood(e.target.value)}>
        <option>Happy 😊</option>
        <option>Stressed 😓</option>
        <option>Bored 😐</option>
      </select>

      <button>Add</button>
    </form>
  );
}

export default AddTransactionForm;