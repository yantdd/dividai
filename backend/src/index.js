import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import sequelize, { connectDB } from "./db.js";
import User from "./models/User.js";
import Group from "./models/Group.js";
import GroupMember from "./models/GroupMember.js";
import Expense from "./models/Expense.js";
import ExpenseSplit from "./models/ExpenseSplit.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
    res.send('Backend running!!!');
});

const startServer = async () => {
    await connectDB();

    // Associações
    User.hasMany(Group, { foreignKey: 'ownerId' });
    Group.belongsTo(User, { foreignKey: 'ownerId' });

    Group.hasMany(GroupMember, { foreignKey: 'groupId', onDelete: 'CASCADE' });
    GroupMember.belongsTo(Group, { foreignKey: 'groupId' });

    User.hasMany(GroupMember, { foreignKey: 'userId' });
    GroupMember.belongsTo(User, { foreignKey: 'userId' });

    // Associações de Expense
    Group.hasMany(Expense, { foreignKey: 'groupId', onDelete: 'CASCADE' });
    Expense.belongsTo(Group, { foreignKey: 'groupId' });

    GroupMember.hasMany(Expense, { foreignKey: 'payerId' });
    Expense.belongsTo(GroupMember, { foreignKey: 'payerId' });

    Expense.hasMany(ExpenseSplit, { foreignKey: 'expenseId', onDelete: 'CASCADE' });
    ExpenseSplit.belongsTo(Expense, { foreignKey: 'expenseId' });

    GroupMember.hasMany(ExpenseSplit, { foreignKey: 'memberId' });
    ExpenseSplit.belongsTo(GroupMember, { foreignKey: 'memberId' });

    try {
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados com o banco de dados.');
    } catch (error) {
        console.error('Erro ao sincronizar modelos:', error);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();