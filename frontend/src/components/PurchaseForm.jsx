import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PurchaseForm = () => {

    const [product, setProduct] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [type, setType] = useState("Alimentação");
    const [store, setStore] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [quantityError, setQuantityError] = useState("");
    const [priceError, setPriceError] = useState("");
    const navigate = useNavigate();

    const handlePriceSubmition = (e) => {
        const valor = e.target.value;

        if (valor === "" || /^\d*\.?\d*$/.test(valor)) {
            setPrice(valor);
            setPriceError("");
        } else {
            setPriceError("Forneça um valor númerico válido!")
        }
    }

    const handleQuantitySubmition = (e) => {
        const valor = e.target.value;

        if (valor === "" || /^[0-9]+$/.test(valor)) {
            setQuantity(valor);
            setQuantityError("");
        } else if (/[a-zA-Z]/.test(valor)) {
           
            setQuantityError("Forneça um valor númerico!");
        } else {
            setQuantityError("Forneça um valor inteiro!");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!product || !price || !quantity) {
            setMessage("Peencha todos os campos obrigatórios!");
            return;
        }


        const purchaseData = {
            product,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            type,
            store,
            description
        };

        try {
            const response = await axios.post("http://localhost:3001/api/purchases", purchaseData);
            if (response.status === 201 || response.status === 200) {
                setMessage("Compra registrada com sucesso!");
                console.log("Dados salvos:", response.data);
                navigate("/results");
            } else {
                setMessage("Erro ao registrar a compra.");
            };
        } catch (err) {
            setMessage("Erro ao registrar a compra. Tente novamente.")
        }
    };

    const handleDescriptionChange = (e) => {
        if (e.target.value.length <= 200) {
            setDescription(e.target.value);
        }
      }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white mb-6">Registrar Compra</h2>
            
            <div>
                <label className="block text-sm font-medium text-slate-300">Produto</label>
                <input 
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                 />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300">Valor</label>
                    <input 
                        type="text"
                        value={price}   
                        onChange={handlePriceSubmition}
                        required
                        className="mt-1 block w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    {priceError && <p className="mt-2 text-sm text-red-600">{priceError}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300">Quantidade</label>
                    <input
                        type="text"
                        value={quantity}
                        onChange={handleQuantitySubmition}
                        required
                        className="mt-1 block w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    {quantityError && <p className="mt-2 text-sm text-red-600">{quantityError}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300">Loja</label>
                    <input 
                        type="text"
                        value={store}
                        onChange={(e) => setStore(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300">Tipo</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white">
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
                <label className="block text-sm font-medium text-slate-300">Descrição (opcional)</label>
                <textarea 
                    value={description}
                    onChange={handleDescriptionChange}
                    maxLength={200}
                    rows="3"
                    className="mt-1 block w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                />
            </div>

            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">Registrar</button>

            {message && <p className={`mt-4 text-sm text-center font-semibold ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        </form>
    )
};

export default PurchaseForm;