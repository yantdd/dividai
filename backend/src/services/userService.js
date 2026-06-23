import User from '../models/User.js';

export async function createUserService(name, email, password) {
    if (!name || !email || !password) throw new Error("Todos os campos são obrigatórios!");

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error("Email já cadastrado!");
    }

    const user = await User.create({ name, email, password });
    return user;
}

export async function loginService(email, password) {
    if (!email || !password) throw new Error("Todos os campos são obrigatórios!");

    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Email ou senha inválidos!");

    if (user.password !== password) throw new Error("Email ou senha inválidos!");

    return user;
}

export async function updateUserService(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("Usuário não encontrado!");

    const { name, email, password, photo } = data;

    if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) throw new Error("Este email já está em uso!");
    }

    // Apenas os campos enviados serão atualizados
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (photo !== undefined) updateData.photo = photo; // permite foto null (remover) ou base64

    await user.update(updateData);
    
    return user;
}