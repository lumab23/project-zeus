import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseSection from "../components/ExpenseSection";
import Charts from "../components/Charts";
import Navbar from "../components/Navbar";

const Results = () => {
  const [expenses, setExpenses] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [activeChart, setActiveChart] = useState("pie");

  const fetchDataByType = async () => {
    try {
      console.log("Fazendo requisição para buscar dados por tipo...");
      const response = await axios.get("http://localhost:3001/api/purchases/grouped-by-type");
      console.log("Dados recebidos:", response.data);
      setExpenses(response.data);
    } catch (err) {
      console.error("Erro ao buscar dados por tipo:", err);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      console.log("Fazendo requisição para buscar dados mensais...");
      const response = await axios.get("http://localhost:3001/api/purchases/monthly");
      console.log("Dados mensais recebidos:", response.data);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-slate-100">
      <Navbar />
      <main className="container mx-auto p-8">
        <h1 className="text-5xl font-extrabold text-white mb-10">Análise de Gastos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm text-center transition-all duration-300 hover:border-indigo-500 hover:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-300">Gasto Total</h2>
            <p className="text-4xl font-extrabold text-indigo-400 mt-2">{`R$ ${totalSpent.toFixed(2)}`}</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm text-center transition-all duration-300 hover:border-indigo-500 hover:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-300">Gasto do Mês</h2>
            <p className="text-4xl font-extrabold text-indigo-400 mt-2">{`R$ ${currentMonthTotal.toFixed(2)}`}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500 hover:bg-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Visualização Gráfica</h2>
              <div className="flex space-x-1 p-1 bg-slate-900/70 rounded-lg">
                <button
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeChart === 'pie' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
                  onClick={() => setActiveChart("pie")}
                >
                  Pizza
                </button>
                <button
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeChart === 'bar' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
                  onClick={() => setActiveChart("bar")}
                >
                  Barras
                </button>
                <button
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeChart === 'line' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
                  onClick={() => setActiveChart("line")}
                >
                  Linhas
                </button>
              </div>
            </div>

            <div className="h-96">
              {expenses.length === 0 ? (
                  <p className="text-slate-400 text-center pt-16">Adicione compras para visualizar seus gráficos.</p>
                ) : (
                <>
                  {activeChart === "pie" && <Charts type="pie" data={expenses} />}
                  {activeChart === "bar" && <Charts type="bar" data={expenses} />}
                  {activeChart === "line" && <Charts type="line" data={expenses} />}
                </>
              )}
            </div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm">
            <ExpenseSection expenses={expenses} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;