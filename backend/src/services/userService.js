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