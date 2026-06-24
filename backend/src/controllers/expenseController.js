import fs from 'fs/promises';
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
        const groupId = Number(req.body.groupId);
        const title = req.body.title;
        const amount = Number(req.body.amount);
        const payerId = Number(req.body.payerId);
        const date = req.body.date;
        const split = typeof req.body.split === 'string' ? JSON.parse(req.body.split) : req.body.split;
        const receipt = req.file ? `receipts/${req.file.filename}` : null;

        const expense = await createExpenseService(groupId, title, amount, payerId, date, split, receipt);
        res.status(201).json(expense);
    } catch (error) {
        if (req.file) await fs.unlink(req.file.path).catch(() => {});
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
