import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Expense from './Expense.js';
import GroupMember from './GroupMember.js';

const ExpenseSplit = sequelize.define('ExpenseSplit', {
  expenseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Expense,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: GroupMember,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default ExpenseSplit;
