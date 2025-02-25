import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import "../css/AddPurchase.css";
import PurchaseForm from "../components/PurchaseForm";
import "../css/PurchaseForm.css";

const AddPurchaseComponent = () => {

    // estado pra controlar a visibilidade do user.
    const [isFormVisible, setIsFormVisible] = useState(false);
     
    const formVisibility = () => {
        setIsFormVisible(!isFormVisible);
    }

    return (
        
        <div className="addNewPurchase">
            <div className="plus-icon" onClick={formVisibility}>
                <FaPlus />
            </div>
            <div className="add-purchase-text">
                Adicionar nova <br/> 
                compra 
            </div>

            {/* se isFormVisible for verdadeiro o fomulário se renderiza */}    
            {isFormVisible && (
                <div className="form-popup">
                    <div className="form-popup-content">
                        <button className="close-button" onClick={formVisibility}>
                            <FaTimes/>
                        </button>

                        <PurchaseForm/>

                    </div>
                </div>
            )}
        </div>
    )
}

export default AddPurchaseComponent;