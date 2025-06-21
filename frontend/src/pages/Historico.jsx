import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEdit, FaTrash, FaTimes, FaFilter, FaCalendarAlt, FaCalendarDay, FaUndo } from "react-icons/fa";

// Custom dark theme for DatePicker
const DarkDatePickerInput = React.forwardRef(({ value, onClick }, ref) => (
  <div className="relative">
    <FaCalendarDay className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
    <input 
      onClick={onClick} 
      ref={ref} 
      value={value} 
      readOnly
      placeholder="Selecione um dia"
      className="w-full pl-10 p-2.5 bg-slate-800/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-white cursor-pointer"
    />
  </div>
));

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

  const handlePriceChange = (value) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, price: value }));
        setPriceError("");
    } else {
        setPriceError("Forneça um valor numérico válido!");
    }
  };

  const handleQuantityChange = (value) => {
    if (value === "" || /^[0-9]+$/.test(value)) {
        setFormData(prev => ({ ...prev, quantity: value }));
        setQuantityError("");
    } else {
        setQuantityError("Forneça um valor inteiro!");
    }
  };

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 30);
  };

  const handleDeletePurchase = async (purchaseId) => {
    if (window.confirm("Tem certeza que deseja deletar esta compra?")) {
      try {
        await axios.delete(`http://localhost:3001/api/purchases/${purchaseId}`);
        fetchAllPurchases();
      } catch (err) {
        console.error("Erro ao deletar compra:", err);
      }
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

  const submitEditForm = async (e) => {
    e.preventDefault();
    // Validations and submission logic...
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesType = filterType ? purchase.type === filterType : true;
    const purchaseDate = new Date(purchase.date);
    const matchesMonth = filterMonth
      ? purchaseDate.getFullYear() === new Date(filterMonth).getFullYear() &&
        purchaseDate.getMonth() === new Date(filterMonth).getMonth()
      : true;
    const matchesDate = filterDate
      ? purchaseDate.toDateString() === filterDate.toDateString()
      : true;
    return matchesType && matchesMonth && matchesDate;
  });

  const getEmptyMessage = () => {
    if (filteredPurchases.length === 0) {
      return "Nenhuma compra encontrada para os filtros selecionados.";
    }
    return null;
  };

  const getMonthName = (monthString) => {
    if (!monthString) return ""; 

    const [year, month] = monthString.split("-");

    const date = new Date(year, month - 1, 1);

    return date.toLocaleString("pt-BR", { month: "long" });
  };

  const clearFilters = () => {
    setFilterType("");
    setFilterMonth("");
    setFilterDate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-slate-100">
      <Navbar />
      <main className="container mx-auto p-8">
        <h1 className="text-5xl font-extrabold text-white mb-10">Histórico de Compras</h1>
        
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 items-end">
            
            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
              <div className="relative">
                <FaFilter className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full pl-10 p-2.5 bg-slate-800/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-white">
                  <option value="">Todos</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Acessórios">Acessórios</option>
                  <option value="Brinquedos">Brinquedos</option>
                  <option value="Higiene">Higiene</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            {/* Filtro por Mês */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Mês</label>
              <div className="relative">
                <FaCalendarAlt className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-full pl-10 p-2.5 bg-slate-800/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-white" />
              </div>
            </div>

            {/* Filtro por Dia */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Dia</label>
              <DatePicker 
                selected={filterDate} 
                onChange={(date) => setFilterDate(date)} 
                dateFormat="dd/MM/yyyy" 
                customInput={<DarkDatePickerInput />}
                calendarClassName="bg-slate-800 border-slate-700"
                dayClassName={() => "text-slate-300 hover:bg-slate-700"}
                monthClassName={() => "text-slate-300"}
                popperPlacement="top-start"
              />
            </div>

            {/* Botão de Limpar */}
            <button onClick={clearFilters} className="flex items-center justify-center gap-2 bg-transparent text-slate-400 hover:text-indigo-400 font-semibold py-2 px-4 rounded-md transition-colors w-full lg:w-auto">
              <FaUndo />
              Limpar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Loja</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredPurchases.length > 0 ? (
                  filteredPurchases.slice(0, visibleCount).map((purchase) => (
                    <tr key={purchase._id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{purchase.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">R$ {purchase.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{purchase.quantity} un.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{purchase.store}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{new Date(purchase.date).toLocaleDateString("pt-BR")}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-4">
                        <button onClick={() => handleEditPurchase(purchase)} className="text-indigo-400 hover:text-indigo-300 transition-colors"><FaEdit /></button>
                        <button onClick={() => handleDeletePurchase(purchase._id)} className="text-red-500 hover:text-red-400 transition-colors"><FaTrash /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400">{getEmptyMessage()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {visibleCount < filteredPurchases.length && (
            <div className="text-center mt-6">
              <button onClick={loadMore} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">Carregar Mais</button>
            </div>
          )}
        </div>
      </main>

      {modalVisible && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-xl shadow-2xl relative w-full max-w-lg">
            <button onClick={() => setModalVisible(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><FaTimes size={24} /></button>
            <h2 className="text-3xl font-bold text-center text-white mb-6">Editar Compra</h2>
            <form onSubmit={submitEditForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Produto</label>
                  <input type="text" value={formData.product} onChange={(e) => handleInputChange("product", e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Quantidade</label>
                    <input type="text" value={formData.quantity} onChange={(e) => handleQuantityChange(e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                    {quantityError && <p className="mt-2 text-sm text-red-500">{quantityError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Preço</label>
                    <input type="text" value={formData.price} onChange={(e) => handlePriceChange(e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                    {priceError && <p className="mt-2 text-sm text-red-500">{priceError}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Loja</label>
                        <input type="text" value={formData.store} onChange={(e) => handleInputChange("store", e.target.value)} className="mt-1 block w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
                        <select value={formData.type} onChange={(e) => handleInputChange("type", e.target.value)} className="mt-1 block w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white">
                            <option value="Alimentação">Alimentação</option>
                            <option value="Saúde">Saúde</option>
                            <option value="Acessórios">Acessórios</option>
                            <option value="Higiene">Higiene</option>
                            <option value="Brinquedos">Brinquedos</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Descrição</label>
                  <textarea value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} maxLength={200} rows="3" className="mt-1 block w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white" />
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-all duration-300">Salvar Alterações</button>
                </div>
                {message && <p className={`mt-4 text-sm text-center font-semibold ${message.includes('sucesso') ? 'text-green-400' : 'text-red-500'}`}>{message}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historico;