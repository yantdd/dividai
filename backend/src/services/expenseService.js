import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Expense from '../models/Expense.js';
import ExpenseSplit from '../models/ExpenseSplit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createExpenseService(groupId, title, amount, payerId, date, split, receipt) {
    if (!groupId || !title || !amount || !payerId || !date) {
        throw new Error("Todos os campos são obrigatórios!");
    }

    const newExpense = await Expense.create({ groupId, title, amount, payerId, date, receipt });

    if (split && split.length > 0) {
        for (const item of split) {
            await ExpenseSplit.create({
                expenseId: newExpense.id,
                memberId: item.memberId,
                amount: item.amount
            });
        }
    }

    const expenseComSplit = await Expense.findByPk(newExpense.id, {
        include: [ExpenseSplit]
    });

    return expenseComSplit;
}

export async function getExpensesByGroupService(groupId) {
    const expenses = await Expense.findAll({
        where: { groupId },
        include: [ExpenseSplit],
        order: [['createdAt', 'DESC']]
    });
    return expenses;
}

export async function getExpenseByIdService(expenseId) {
    const expense = await Expense.findByPk(expenseId, {
        include: [ExpenseSplit]
    });
    if (!expense) throw new Error("Despesa não encontrada!");
    return expense;
}

export async function updateExpenseService(expenseId, data) {
    const expense = await Expense.findByPk(expenseId);
    if (!expense) throw new Error("Despesa não encontrada!");

    if (data.payerId) {
        expense.payerId = data.payerId;
        await expense.save();
    }

    if (data.split) {
        await ExpenseSplit.destroy({ where: { expenseId } });

        for (const item of data.split) {
            await ExpenseSplit.create({
                expenseId,
                memberId: item.memberId,
                amount: item.amount
            });
        }
    }

    const expenseAtualizada = await Expense.findByPk(expenseId, {
        include: [ExpenseSplit]
    });

    return expenseAtualizada;
}

export async function deleteExpenseService(expenseId) {
    const expense = await Expense.findByPk(expenseId);
    if (!expense) throw new Error("Despesa não encontrada!");

    if (expense.receipt) {
        const filePath = path.join(__dirname, '../../uploads', expense.receipt);
        await fs.unlink(filePath).catch(() => {});
    }

    await expense.destroy();
    return true;
}

export async function recalculateSplitsForGroup(groupId, members) {
    const expenses = await Expense.findAll({ where: { groupId } });

    const memberIds = members.map(m => m.id);

    for (const expense of expenses) {
        const novaPorcao = expense.amount / members.length;

        await ExpenseSplit.destroy({ where: { expenseId: expense.id } });

        for (const member of members) {
            await ExpenseSplit.create({
                expenseId: expense.id,
                memberId: member.id,
                amount: novaPorcao
            });
        }

        if (!memberIds.includes(expense.payerId)) {
            expense.payerId = members[0].id;
            await expense.save();
        }
    }

    return true;
}
