import { Router } from "express";
import * as userController from "../controllers/userController.js";

const router = Router();

router.post('/cadastrar', userController.cadastrarUsuario);
router.post('/login', userController.login);

export default router;