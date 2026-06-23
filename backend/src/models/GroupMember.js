import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Group from './Group.js';
import User from './User.js';

const GroupMember = sequelize.define('GroupMember', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Group,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true,
});

export default GroupMember;
