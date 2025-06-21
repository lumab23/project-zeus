import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaHeartbeat, FaBoxOpen, FaCut, FaPaw, FaQuestionCircle } from 'react-icons/fa';

const categoryIcons = {
  'Alimentação': <FaUtensils className="text-pink-400" />,
  'Saúde': <FaHeartbeat className="text-red-400" />,
  'Acessórios': <FaBoxOpen className="text-yellow-400" />,
  'Higiene': <FaCut className="text-sky-400" />,
  'Brinquedos': <FaPaw className="text-green-400" />,
  'Outros': <FaQuestionCircle className="text-slate-400" />,
};

const ExpenseSection = ({ expenses }) => {
  const navigate = useNavigate();
  const sortedExpenses = [...expenses].sort((a, b) => b.totalSpent - a.totalSpent);
  const totalOfAllExpenses = expenses.reduce((acc, expense) => acc + expense.totalSpent, 0);

  const handleExpenseClick = (type) => {
    navigate(`/historico/${type}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Gastos por Categoria</h2>
      <div className="space-y-4">
        {sortedExpenses.length === 0 ? (
          <p className="text-slate-400 text-center pt-8">Nenhuma despesa registrada.</p>
        ) : (
          sortedExpenses.map((expense) => {
            const percentage = totalOfAllExpenses > 0 ? (expense.totalSpent / totalOfAllExpenses) * 100 : 0;
            return (
              <div
                key={expense._id}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700/70 cursor-pointer transition-all duration-300 hover:border-indigo-500"
                onClick={() => handleExpenseClick(expense._id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{categoryIcons[expense._id] || <FaQuestionCircle className="text-slate-400" />}</span>
                    <span className="font-semibold text-slate-100">{expense._id}</span>
                  </div>
                  <span className="font-bold text-white ml-auto">R$ {expense.totalSpent.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ExpenseSection;