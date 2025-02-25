import React, { createContext, useContext, useState } from 'react';

const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const updateExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    const total = newExpenses.reduce((acc, item) => acc + item.totalSpent, 0);
    setTotalExpenses(total);
  };

  return (
    <ExpensesContext.Provider value={{ expenses, totalExpenses, updateExpenses }}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
};