import express from "express";
import cors from "cors";
import purchaseRoutes from "./routes/purchaseRoutes.js";

const app = express();

// middlewares
app.use(cors()); // para permitir req de diferents origens 
app.use(express.json()); // para permitir o use de json no corpo das req

// rotas
app.use('/api/purchases', purchaseRoutes);

export default app;