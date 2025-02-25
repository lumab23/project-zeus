import express from "express"; // o express cria e config. a app. do server
import {
    addPurchase,
    updatePurchase,
    deletePurchase,
    getPurchasesByType,
    getPurchasesByTypeDetailed,
    getAllPurchases,
    getMonthlyPurchases
} from "../controllers/purchaseController.js";

const router = express.Router(); // organiza as rotas de req HTTP

// crud routes
router.post('/', addPurchase); // adicionar nova compra
router.put('/:id', updatePurchase); // atualiza uma compra
router.delete('/:id', deletePurchase); // deleta uma compra

router.get('/grouped-by-type', getPurchasesByType); // compras agrupadas por tipo
router.get('/monthly', getMonthlyPurchases); // compras mensais


router.get('/by-type/:type', getPurchasesByTypeDetailed); // compras detalhadas de um tipo específico (:type na url)
router.get('/all', getAllPurchases); // todas a compras

export default router;