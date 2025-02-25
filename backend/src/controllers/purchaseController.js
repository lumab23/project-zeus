import Purchase from "../models/Purchase.js";

// 4xx (erro do cliente)
// 5xx (erro do servidor)

// adicionar uma nova compra (CREATE)
const addPurchase = async (req, res) => {
  const { product, quantity, price, type, store, description } = req.body;
  const date = new Date(); // data atual
  const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // formação mês (AAAA-MM)

  try {
    
    if (price == null || quantity == null) {
      throw new Error("A quantidade/preço fornecido está vazio.");
    }

    if (!product || !type) {
      throw new Error("Produto e tipo são obrigatórios.");
    }

    if (typeof price !== 'number' || price <= 0) {
      throw new Error(`O preço deve ser um número positivo. Você forneceu: ${price}`);
    }
    
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`A quantidade deve ser um número inteiro e positivo. Você forneceu: ${quantity}`);
    }

    // instância de compra
    const purchase = new Purchase({ product, price, quantity, type, month, store, description, date });
    await purchase.save();
    
    res.status(201).json({
      success: true,
      data: purchase,
      message: "Compra adicionada com sucesso"
    });
  } catch (err) {
    console.error(`Erro ao adicionar compra (${product || 'unknown'}):`, err);

    // erros de valid. do mongodb
    if (err.name === "ValidationError" || err.name === "CastError") {
      res.status(400).json({ 
        success: false,
        error: {
          message: err.message,
          details: err.errors ? Object.values(err.errors).map(e => e.message) : []
        }
      });
    } else if (err.name === "MongoError") {
      res.status(500).json({
        success: false,
        error: { message: "Erro no banco de dados.", detail: err.message }
      });
    } else {
      res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor", detail: err.message }
      });
    }
  }
};

// atualizar uma compra (UPDATE)
const updatePurchase = async (req, res) => {
  const { id } = req.params; // extrai o id dos param. da URL 
  const { product, quantity, price, type, store, description } = req.body; // extrai dados do corpo da req.
  
  const purchase = await Purchase.findById(id); // buscando a compra pelo id
  if (!purchase) {
    return res.status(404).json({ error: "Compra não encontrada" });
  }

  try {
    // validações
    if (price == null || quantity == null) {
      throw new Error("A quantidade/preço fornecido está vazio.")
    }
    
    if (price !== undefined && isNaN(price)) {
      throw new Error("Forneça um preço válido!");
    }
    
    if (quantity !== undefined && isNaN(quantity)) {
      throw new Error("Forneça uma quantidade válida!");
    }
    
    if (price < 0) {
      throw new Error("O preço deve ser positivo.")
    }
    
    if (quantity < 1 || !Number.isInteger(quantity)) {
      throw new Error("A quantidade deve ser um número inteiro e positivo.")
    }
    
    // atualiza a compra no banco
    const purchase = await Purchase.findByIdAndUpdate(
      id,
      { product, quantity, price, type, store, description },
      { new: true } // o documento atualizado é retornado
    );

    // se n encontrar a compra, retorna um err
    if (!purchase) throw new Error('Compra não encontrada');
    res.status(200).json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// deletar uma compra (DELETE)
const deletePurchase = async (req, res) => {
  const { id } = req.params; // extrai o id da compra dos param.
  
  try {
    // deleta a compra quando encontra o id
    const purchase = await Purchase.findByIdAndDelete(id); 

    if (!purchase) throw new Error('Compra não encontrada');
    res.status(200).json({ message: 'Compra excluída com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// compras por tipo
const getPurchasesByType = async (req, res) => {
  try {

    // agrega as compras por tipo e soma o total
    const purchases = await Purchase.aggregate([
      {
        $group: {
          _id: "$type", 
          totalSpent: { $sum: "$price" }, 
        },
      },
      { $sort: { _id: 1 } }, // ordem crescente 
    ]);
    
    
    if (purchases.length === 0) {
      return res.status(404).json({ error: "Nenhuma compra encontrada." });
    }

    res.status(200).json(purchases);
  } catch (err) {
    console.log("Erro ao buscar compras por tipo: ", err);
    res.status(500).json({ error: "Erro no banco de dados. Tente novamente mais tarde." });
  }
};

// compras de cada tipo
const getPurchasesByTypeDetailed = async (req, res) => {
  const { type } = req.params; // pega os tipos de compra dos param. da url
  
  try {
    const purchases = await Purchase.find({ type }).sort({ date: -1 }); // busca todas as compras do tipo
    if (purchases.length === 0) {
      return res.status(404).json({ error: "Nenhuma compra encontrada para este tipo." });
    }
    res.status(200).json(purchases);
  } catch (err) {
    console.log("Erro ao buscar compras por tipo (detalhado): ", err);
    res.status(500).json({ error: "Erro no banco de dados. Tente novamente mais tarde." });
  }
};

// busca todas as compras
const getAllPurchases = async (req, res) => {
  try {
    // busca as compras e ordena pela data (recentes primeiro)
    const purchases = await Purchase.find().sort({ date: -1 }); 
    
    if (purchases.length === 0) {
      return res.status(404).json({ error: "Nenhuma compra encontrada." });
    }

    // retorna a lista de compras encontradas
    res.status(200).json(purchases);
  } catch (err) {
    console.log("Erro ao buscar todas as compras: ", err);
    res.status(500).json({ error: "Erro no banco de dados. Tente novamente mais tarde." });
  }
};


// visualizar compras agrupadas por mês (READ)
const getMonthlyPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.aggregate([
            {
                $group: {
                    _id: "$month",
                    totalQuantity: { $sum: "$quantity" }, // soma todos as rações compradas no mês
                    totalSpent: { $sum: "$price" }, // soma o dinheiro gastado no mês
                    purchases: { $push: "$$ROOT" }, // coloca todas as compras do mês em um arr
                    types: { $addToSet: "$type" }
                }
            },
            { $sort: { _id: -1 } }, // resul. em ordem descrescente por mês (os recentes primeiro)
        ]);

        if (purchases.length === 0) {
          return res.status(404).json({ error: "Nenhuma compra encontrada."});
        }
        res.status(200).json(purchases); // 200 (OK)
    } catch(err) {
      console.log("Erro ao buscar compras mensais: ", err);

      if (err.name == "MongoError" || err.name === "CastError") {
        return res.status(500).json({ error: "Erro no banco de dados. Tente novamente mais tarde."})
      }
      res.status(400).json({ error: err.message });
    }
};


export {
  addPurchase,
  updatePurchase,
  deletePurchase,
  getPurchasesByType,
  getPurchasesByTypeDetailed,
  getAllPurchases,
  getMonthlyPurchases
};

