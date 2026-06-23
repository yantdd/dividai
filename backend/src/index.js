import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize, { connectDB } from "./db.js";
import User from "./models/User.js";
import Group from "./models/Group.js";
import GroupMember from "./models/GroupMember.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

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

    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Modelos sincronizados com o banco de dados.');
    } catch (error) {
        console.error('❌ Erro ao sincronizar modelos:', error);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();