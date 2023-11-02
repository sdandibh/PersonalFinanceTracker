import React, { useState, useEffect } from 'react';

// Sravya Dandibhatta
// Personal Finance Tracker

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch expenses from your Flask backend
    fetch('http://localhost:5000/get_expenses')
      .then((response) => response.json())
      .then((data) => {
        setExpenses(data);
      })
      .catch((error) => console.error('Error fetching expenses:', error));
  }, []);

  return (
    <div>
      <h2>Expense List</h2>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            <div>Description: {expense.description}</div>
            <div>Amount: {expense.amount}</div>
            <div>Category: {expense.category}</div>
            <div>Date: {expense.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;