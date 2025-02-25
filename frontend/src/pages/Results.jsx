import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseSection from "../components/ExpenseSection";
import Charts from "../components/Charts";
import "../css/Results.css";
import Navbar from "../components/NavBar";

const Results = () => {
  const [expenses, setExpenses] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [activeChart, setActiveChart] = useState("pie");

  const fetchDataByType = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/purchases/grouped-by-type");
      setExpenses(response.data);
    } catch (err) {
      console.error("Erro ao buscar dados por tipo:", err);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/purchases/monthly");
      setMonthlyData(response.data);
    } catch (err) {
      console.error("Erro ao buscar dados mensais:", err);
    }
  };

  useEffect(() => {
    fetchDataByType();
    fetchMonthlyData();
  }, []);

  const totalSpent = expenses.reduce((acc, expense) => acc + expense.totalSpent, 0);
  const currentMonthTotal = monthlyData[0]?.totalSpent || 0;

  return (
    <div className="results-container">
      <Navbar />
      <div className="totals-container">
        <div className="total-box">
          <h3>Gasto Total</h3>
          <p>{`R$ ${totalSpent.toFixed(2)}`}</p>
        </div>
        <div className="total-box">
          <h3>Gasto do Mês</h3>
          <p>{`R$ ${currentMonthTotal.toFixed(2)}`}</p>
        </div>
      </div>
      <div className="results-content">
        <div className="charts-box">
          <div className="chart-header">
            <h3>Gráficos</h3>
          </div>
          <div className="chart-toggle">
            <button
              className={activeChart === "pie" ? "active" : ""}
              onClick={() => setActiveChart("pie")}
            >
              Pie
            </button>
            <button
              className={activeChart === "bar" ? "active" : ""}
              onClick={() => setActiveChart("bar")}
            >
              Barras
            </button>
            <button
              className={activeChart === "line" ? "active" : ""}
              onClick={() => setActiveChart("line")}
            >
              Linhas
            </button>
          </div>

          <div className="chart-display">
            {expenses.length === 0 ? (
                <p className="empty-message">Adicione compras para visualizar seus gráficos.</p>
              ) : (
                <>
              {activeChart === "pie" && <Charts type="pie" data={expenses} />}
              {activeChart === "bar" && <Charts type="bar" data={expenses} />}
              {activeChart === "line" && <Charts type="line" data={expenses} />}
              </>
            )}
          </div>
        </div>
        <div className="expenses-box">
          <ExpenseSection expenses={expenses} />
        </div>
      </div>
    </div>
  );
};

export default Results;