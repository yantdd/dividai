import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
    createExpense,
    getExpensesByGroup,
    getExpenseById,
    updateExpense,
    deleteExpense,
    recalculateSplits
} from '../controllers/expenseController.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createExpense);
router.get('/group/:groupId', getExpensesByGroup);
router.put('/group/:groupId/recalculate', recalculateSplits);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
