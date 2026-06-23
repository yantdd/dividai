import * as userService from '../services/userService.js';

export async function cadastrarUsuario(req, res) {
    try {
        const { name, email, password } = req.body;

        const newUser = await userService.createUserService(name, email, password);

        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            }
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userService.loginService(email, password);

        return res.status(200).json({
            message: 'Usuário logado com sucesso!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}