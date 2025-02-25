import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import "../css/Historico.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const Historico = () => {
  const [purchases, setPurchases] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [filterType, setFilterType] = useState("");
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

  const calculateTotalForMonth = () => {
    if (!filterMonth) return 0;

    const filtered = purchases.filter((purchase) => {
      const purchaseMonth = new Date(purchase.date).toISOString().slice(0, 7); 
      return purchaseMonth === filterMonth;
    });

    return filtered.reduce((total, purchase) => total + purchase.price, 0);
  };

  const calculateTotalForTypeInMonth = () => {
    if (!filterMonth || !filterType) return 0;

    const filtered = purchases.filter((purchase) => {
      const purchaseMonth = new Date(purchase.date).toISOString().slice(0, 7); 
      return purchaseMonth === filterMonth && purchase.type === filterType;
    });

    return filtered.reduce((total, purchase) => total + purchase.price, 0);
  };


  // validações 
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

  const fetchAllPurchases = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/purchases/all");
      setPurchases(response.data);
    } catch (err) {
      console.error("Erro ao buscar o histórico completo:", err);
    }
  };

  useEffect(() => {
    fetchAllPurchases();
  }, []);

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 30);
  };

  const handleDeletePurchase = async (purchaseId) => {
    try {
      await axios.delete(`http://localhost:3001/api/purchases/${purchaseId}`);
      fetchAllPurchases(); 
    } catch (err) {
      console.error("Erro ao deletar compra:", err);
    }
  };

  const handleEditPurchase = (purchase) => {
    console.log("modal de edição abrindo: ", purchase)
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
    console.log("visibilidade de modal: ", modalVisible);
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
        await fetchAllPurchases(); 
        setModalVisible(false); // Fecha o modal
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
    const matchesType = filterType ? purchase.type === filterType : true;
    const matchesMonth = filterMonth ? purchase.month === filterMonth : true;
    const matchesDate = filterDate ? new Date(purchase.date).toDateString() === filterDate.toDateString() : true;
    return matchesType && matchesMonth && matchesDate;
  });

  const getEmptyMessage = () => {
    if (filterType && filteredPurchases.length === 0) {
      return `Nenhum gasto em ${filterType}.`;
    } else if (filterMonth && filteredPurchases.length === 0) {
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

  const getMonthName = (monthString) => {
    if (!monthString) return ""; 

    const [year, month] = monthString.split("-");

    const date = new Date(year, month - 1, 1);

    return date.toLocaleString("pt-BR", { month: "long" });
  };


  return (
    <div className="historico-container">
      <Navbar />
      <div className="historico-content">
        <div className="historico-box">
          <div className="historico-header">
            <h3>Histórico Completo de Compras</h3>
          </div>
          <div className="filters">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">Todos os Tipos</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Saúde">Saúde</option>
              <option value="Acessórios">Acessórios</option>
              <option value="Brinquedos">Brinquedos</option>
              <option value="Higiene">Higiene</option>
              <option value="Outros">Outros</option>
            </select>
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

          {/* Exibir totais */}
          {filterMonth && (
            <div className="totals">
              <p>
                Total gasto em <strong>{getMonthName(filterMonth)}</strong>: R${" "}
                {calculateTotalForMonth().toFixed(2)}
              </p>
              {filterType && (
                <p>
                  Total gasto em <strong>{filterType}</strong> em{" "}
                  <strong>{getMonthName(filterMonth)}</strong>: R${" "}
                  {calculateTotalForTypeInMonth().toFixed(2)}
                </p>
              )}
            </div>
          )}

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
                  <button className="ver-mais" onClick={loadMore}>
                    Ver mais
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de edição */}
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

export default Historico;