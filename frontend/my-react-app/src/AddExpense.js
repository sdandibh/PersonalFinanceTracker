import React, { useState } from 'react';

// Sravya Dandibhatta
// Personal Finance Tracker

function AddExpense() {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/add_expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 201) {
      // Successful response handling
      console.log('Expense added successfully');
    } else {
      // Error response handling
      console.log('Error adding expense');
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}

export default AddExpense;