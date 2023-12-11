import React from 'react';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';

// Sravya Dandibhatta
// Personal Finance Tracker

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Personal Finance Tracker</h1>
      </header>
      <main>
        <AddExpense />
        <ExpenseList />
      </main>
    </div>
  );
}

export default App;
