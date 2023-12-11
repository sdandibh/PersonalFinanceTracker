import React, { useEffect, useState } from 'react';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_expenses');
      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses);
      } else {
        console.error('Failed to fetch expenses');
      }
    } catch (error) {
      console.error('An error occurred while fetching expenses:', error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_expense/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Expense deleted successfully');
        // Refresh expense list after deletion
        fetchExpenses();
      } else {
        console.error('Error deleting expense');
      }
    } catch (error) {
      console.error('An error occurred while deleting expense:', error);
    }
  };

  const handleEditExpense = async (expenseId) => {
    console.log(`Edit expense with ID: ${expenseId}`);
  };

  const handleGenerateReport = async () => {
    try {
      const response = await fetch('http://localhost:5000/generate_report');
      if (response.ok) {
        const data = await response.json();
        setTotalAmount(data.total_amount);
      } else {
        console.error('Error generating report');
      }
    } catch (error) {
      console.error('An error occurred while generating report:', error);
    }
  };

  return (
    <div>
      <h2>Expense List</h2>
      <button onClick={handleGenerateReport}>Generate Report</button>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description} - {expense.amount} - {expense.date}
            <button onClick={() => handleEditExpense(expense.id)}>Edit</button>
            <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <h3>Total Amount Spent: ${totalAmount}</h3>
      </div>
    </div>
  );
}

export default ExpenseList;