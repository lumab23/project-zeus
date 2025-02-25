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
        <form onSubmit={handleSubmit}>
            <div>
                <label>Produto</label>
                <input 
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    required
                 />
            </div>

            <div>
                <label>Valor</label>
                <input 
                    type="text"
                    value={price}   
                    onChange={handlePriceSubmition}
                    required
                 />
                 {priceError && (
                    <p style={{ color: "red", margin: "5px 0 0 0", fontSize: "0.8rem" }}>
                        {priceError}
                    </p>
                )}
            </div>

            <div>
                <label>Quantidade</label>
                <input
                    type="text"
                    value={quantity}
                    onChange={handleQuantitySubmition}
                    required
                />
                { quantityError && (
                    <p style={{ color: "red", margin: "5px 0 0 0", fontSize: "0.8rem" }}>
                        {quantityError}
                    </p>
                )}
            </div>

            <div>
                <label>Loja</label>
                <input 
                    type="text"
                    value={store}
                    onChange={(e) => setStore(e.target.value)}
                 />
            </div>

            <div>
                <label>Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Acessórios">Acessórios</option>
                    <option value="Higiene">Higiene</option>
                    <option value="Brinquedos">Brinquedos</option>
                    <option value="Outros">Outros</option>
                </select>
            </div>

            <div>
                <label>Descrição (opcional)</label>
                <textarea 
                    value={description}
                    onChange={handleDescriptionChange}
                    maxLength={200}
                />
            </div>


            <button type="submit">Registrar</button>

            {message && <p>{message}</p>}

        </form>
    )

};


export default PurchaseForm;