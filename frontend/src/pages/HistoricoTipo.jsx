import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import "../css/Historico.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const HistoricoTipo = () => {
  const { type } = useParams();
  const [purchases, setPurchases] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantityError, setQuantityError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    price: "",
    type: "",
    store: "",
    description: "",
  });


  const handlePriceChange = (value) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      handleInputChange("price", value);
      setPriceError("");
    } else {
      setPriceError("Forneça um valor númerico válido!");
    }
  };
  
  const handleQuantityChange = (value) => {
    if (value === "" || /^[0-9]+$/.test(value)) {
      handleInputChange("quantity", value);
      setQuantityError("");
    } else if (/[a-zA-Z]/.test(value)) {
      setQuantityError("Forneça um valor númerico!");
    } else {
      setQuantityError("Forneça um valor inteiro!");
    }
  };


  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/purchases/by-type/${type}`);
      setPurchases(response.data);
    } catch (err) {
      console.error("Erro ao buscar histórico de compras:", err);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [type]);

  const handleDeletePurchase = async (purchaseId) => {
    try {
      await axios.delete(`http://localhost:3001/api/purchases/${purchaseId}`);
      fetchPurchases(); // Recarrega a lista de compras após a deleção
    } catch (err) {
      console.error("Erro ao deletar compra:", err);
    }
  };

  const handleEditPurchase = (purchase) => {
    setEditingPurchase(purchase);
    setFormData({
      product: purchase.product,
      quantity: purchase.quantity.toString(),
      price: purchase.price.toString(),
      type: purchase.type || "",
      store: purchase.store || "",
      description: purchase.description || "",
    });
    setModalVisible(true);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitEditForm = async () => {
    try {
      setQuantityError("");
      setPriceError("");

      // validação
      if (!formData.product.trim()) {
        setMessage("O nome do produto é obrigatório");
        return;
      }
  
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        setQuantityError("A quantidade deve ser um número inteiro positivo");
        return;
      }
  
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        setPriceError("O preço deve ser um número positivo");
        return;
      }
  
      if (!formData.type.trim()) {
        setMessage("O tipo é obrigatório");
        return;
      }
  
      const updatedPurchase = {
        product: formData.product.trim(),
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        type: formData.type.trim(),
        store: formData.store.trim(),
        description: formData.description.trim(),
      };
  
      const response = await axios.put(
        `http://localhost:3001/api/purchases/${editingPurchase._id}`,
        updatedPurchase
      );
  
      if (response.status === 200) {
        await fetchPurchases(); 
        setModalVisible(false);
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error("Erro detalhado:", err);
      
      if (err.response) {
        setMessage(`Erro ao atualizar a compra: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setMessage("Erro de conexão com o servidor. Verifique sua conexão de internet.");
      } else {
        setMessage(`Erro ao atualizar a compra: ${err.message}`);
      }
    }
  };
  const filteredPurchases = purchases.filter((purchase) => {
    const matchesMonth = filterMonth ? purchase.month === filterMonth : true;
    const matchesDate = filterDate ? new Date(purchase.date).toDateString() === filterDate.toDateString() : true;
    return matchesMonth && matchesDate;
  });


  const getEmptyMessage = () => {
    if (filterMonth && filteredPurchases.length === 0) {
      return `Nenhum gasto no mês ${filterMonth}`;
    } else if (filterDate && filteredPurchases.length === 0) {
      const formatoData = filterDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      return `Nenhum gasto no dia ${formatoData}`;
    } else if (filteredPurchases.length === 0) {
      return "Nenhuma compra na lista.";
    }

    return null;
  }

  return (
    <div className="historico-container">
      <Navbar />
      <div className="historico-content">
        <div className="historico-box">
          <div className="historico-header">
            <h3>Histórico de {type}</h3>
          </div>
          <div className="filters">
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            />
            <DatePicker
              selected={filterDate}
              onChange={(date) => setFilterDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione uma data"
            />
          </div>
          <div className="historico-list">
            <div className="historico-rotulos">
              <span>Produto</span>
              <span>Preço</span>
              <span>Quant.</span>
              <span>Loja</span>
              <span>Data</span>
            </div>
            {filteredPurchases.length === 0 ? (
              <div className="empty-message">
                {getEmptyMessage()}
              </div>
            ) : (
              <>
              {filteredPurchases.slice(0, visibleCount).map((purchase, index) => (
                <div key={index} className="historico-item">
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
                  <span>
                    <FaEdit 
                      className="icon-button edit-icon" 
                      onClick={() => handleEditPurchase(purchase)} 
                    />
                    <FaTrash 
                      className="icon-button delete-icon" 
                      onClick={() => handleDeletePurchase(purchase._id)} 
                    />
                  </span>
                </div>
              ))}
              {filteredPurchases.length > visibleCount && (
                <button className="ver-mais" onClick={() => setVisibleCount(visibleCount + 20)}>
                  Ver mais
                </button>
              )}
            </>
            )}
          </div>
        </div>
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Compra</h3>
            <div>
              <label>Produto</label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => handleInputChange("product", e.target.value)}
                placeholder="Produto"
              />
            </div>

            <div>
              <label>Quantidade</label>
              <input
                type="text"
                value={formData.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="Quantidade"
              />
              {quantityError && <p style={{ color: "red", fontSize: "0.9rem" }}>{quantityError}</p>}
            </div>

            <div>
              <label>Preço</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="Preço"
              />
              {priceError && <p style={{ color: "red", fontSize: "0.9rem" }}>{priceError}</p>}
            </div>

            <div>
              <label>Tipo</label>
              <select 
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
              >
                <option value="Alimentação">Alimentação</option>
                <option value="Saúde">Saúde</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Higiene">Higiene</option>
                <option value="Brinquedos">Brinquedos</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div>
              <label>Loja</label>
              <input
                type="text"
                value={formData.store}
                onChange={(e) => handleInputChange("store", e.target.value)}
                placeholder="Loja"
              />
            </div>

            <div>
              <label>Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descrição"
                maxLength={200}
              />
            </div>

            <button onClick={submitEditForm}>Salvar</button>
            <button onClick={() => setModalVisible(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricoTipo;