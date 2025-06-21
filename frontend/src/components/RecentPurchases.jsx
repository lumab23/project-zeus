import React, { useState, useEffect } from "react";
import axios from "axios";

const RecentPurchases = () => {
  const [purchases, setPurchases] = useState([]);

  const fetchRecentPurchases = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/purchases/all");
      setPurchases(response.data.slice(0, 10));
    } catch (err) {
      console.error("Erro ao buscar compras recentes:", err);
    }
  };

  useEffect(() => {
    fetchRecentPurchases();
  }, []);

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500 hover:bg-slate-800">
      <h2 className="text-2xl font-bold text-white mb-4">Últimas Compras</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Produto</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Preço</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Quantidade</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Loja</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {purchases.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">Nenhuma compra na lista.</td>
              </tr>
            ) : (
              purchases.map((purchase, index) => (
                <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{purchase.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">R$ {purchase.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{purchase.quantity} un.</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{purchase.store}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {new Date(purchase.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPurchases;