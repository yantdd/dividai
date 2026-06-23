import {
    createExpenseService,
    getExpensesByGroupService,
    getExpenseByIdService,
    updateExpenseService,
    deleteExpenseService,
    recalculateSplitsForGroup
} from '../services/expenseService.js';

export async function createExpense(req, res) {
    try {
        const { groupId, title, amount, payerId, date, split } = req.body;
        const expense = await createExpenseService(groupId, title, amount, payerId, date, split);
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function getExpensesByGroup(req, res) {
    try {
        const { groupId } = req.params;
        const expenses = await getExpensesByGroupService(groupId);
        res.status(200).json(expenses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function getExpenseById(req, res) {
    try {
        const { id } = req.params;
        const expense = await getExpenseByIdService(id);
        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function updateExpense(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        const expense = await updateExpenseService(id, data);
        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteExpense(req, res) {
    try {
        const { id } = req.params;
        await deleteExpenseService(id);
        res.status(200).json({ message: "Despesa deletada com sucesso!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function recalculateSplits(req, res) {
    try {
        const { groupId } = req.params;
        const { members } = req.body;
        await recalculateSplitsForGroup(groupId, members);
        res.status(200).json({ message: "Splits recalculados com sucesso!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
