import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/ExpenseSection.css";

const ExpenseSection = ({ expenses }) => {

  // nav entre pág.
  const navigate = useNavigate();

  // despesas em ordem decrescente
  const sortedExpenses = expenses.sort((a, b) => b.totalSpent - a.totalSpent);

  const handleExpenseClick = (type) => {
    navigate(`/historico/${type}`);
  };

  return (
    <div className="expense-section">
      <div className="expense-header">
        <h3>Gastos</h3>
      </div>
      {sortedExpenses.length === 0 ? (
        <p className="empty-message">Nenhuma despesa registrada.</p>
      ) : (
        sortedExpenses.map((expense, index) => (
          <div
            key={index}
            className="expense-item"
            onClick={() => handleExpenseClick(expense._id)}
            style={{ cursor: "pointer" }}
          >
            <span>{expense._id}</span>
            <span>R$ {expense.totalSpent.toFixed(2)}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseSection;