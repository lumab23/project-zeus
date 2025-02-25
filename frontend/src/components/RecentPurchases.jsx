import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/RecentPurchases.css";

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
    <div className="recent-purchases-container">
      <h3>Últimas Compras</h3>
      <div className="recent-purchases-table">
        <div className="recent-purchases-header">
          <span>Produto</span>
          <span>Preço</span>
          <span>Quant.</span>
          <span>Loja</span>
          <span>Data</span>
        </div>

        {purchases.length === 0 ? (
          <p className="empty-message">Nenhuma compra na lista.</p>
        ) : (
          purchases.map((purchase, index) => (
            <div key={index} className="recent-purchases-row">
              <span>{purchase.product}</span>
              <span>R$ {purchase.price.toFixed(2)}</span>
              <span>{purchase.quantity} un.</span>
              <span>{purchase.store}</span>
              <span>
                {new Date(purchase.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentPurchases;