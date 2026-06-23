import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Group from './Group.js';
import GroupMember from './GroupMember.js';

const Expense = sequelize.define('Expense', {
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Group,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: GroupMember,
      key: 'id'
    }
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Expense;
