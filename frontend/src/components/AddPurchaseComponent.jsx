import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import PurchaseForm from "../components/PurchaseForm";

const AddPurchaseComponent = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
     
    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    }

    return (
        <>
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm flex items-center justify-between transition-all duration-300 hover:border-indigo-500 hover:bg-slate-800">
                <div>
                    <h2 className="text-2xl font-bold text-white">Adicionar Nova Compra</h2>
                    <p className="text-slate-400">Clique no botão para registrar uma nova despesa.</p>
                </div>
                <button 
                    onClick={toggleFormVisibility} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
                >
                    <FaPlus size={20} />
                </button>
            </div>

            {isFormVisible && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="bg-white p-8 rounded-xl shadow-2xl relative w-full max-w-lg">
                        <button 
                            onClick={toggleFormVisibility} 
                            className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                        <PurchaseForm />
                    </div>
                </div>
            )}
        </>
    )
}

export default AddPurchaseComponent;