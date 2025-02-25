import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbPassword = process.env.DB_PASSWORD;

mongoose.connect(`mongodb+srv://admin:${dbPassword}@backenddb.pxzxy.mongodb.net/ZEUS?retryWrites=true&w=majority&appName=BackendDB`)
.then(() => {
    console.log("Conectado ao banco de dados!");
})
.catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
})