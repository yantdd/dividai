import { Router } from 'express';
import {
    createExpense,
    getExpensesByGroup,
    getExpenseById,
    updateExpense,
    deleteExpense,
    recalculateSplits
} from '../controllers/expenseController.js';

const router = Router();

router.post('/', createExpense);
router.get('/group/:groupId', getExpensesByGroup);
router.put('/group/:groupId/recalculate', recalculateSplits);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
