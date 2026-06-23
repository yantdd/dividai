import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize, { connectDB } from "./db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Backend running!!!');
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDB();

    try {
        await sequelize.sync();
        console.log('✅ Modelos sincronizados com o banco de dados.');
    } catch (error) {
        console.error('❌ Erro ao sincronizar modelos:', error);
    }
});