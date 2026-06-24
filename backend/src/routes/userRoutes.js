import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.post('/cadastrar', userController.cadastrarUsuario);
router.post('/login', userController.login);
router.put('/:id', authMiddleware, userController.updateUser);

export default router;
