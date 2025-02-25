import mongoose from 'mongoose';

// schema da coleçõo purchases 
const PurchaseSchema = mongoose.Schema(
    {
        product: {
            type: String,
            required: [true, "Forneça o nome do produto"]
        },
        date: {
            type: Date,
            default: Date.now
        },
        quantity: {
            type: Number,
            required: [true, "Forneça a quantidade de ração"]
        },
        price: {
            type: Number,
            required: [true, "Forneça o preço da ração"]
        },
        type: {
            type: String,
            required: [true, "Forneça o tipo de produto"],
            enum: {
                values: ["Alimentação", "Saúde", "Acessórios", "Higiene", "Brinquedos", "Outros"],
                message: "Tipo de produto inválido. Os valores permitidos são: Alimentação, Saúde, Acessórios, Higiene, Brinquedos, Outros",
            },
        },
        month: {
            type: String,
            required: [true, "Forneça o mês da compra de ração"]
        },
        store: {
            type: String,
            required: [true, "Forneça o nome da loja"]
        },
        description: {
            type: String,
            default: ""
        }
    }
);

export default mongoose.model('Purchase', PurchaseSchema);