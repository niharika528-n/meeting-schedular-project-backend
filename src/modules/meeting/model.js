const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { v4: uuidv4 } = require('uuid');
const User = require('../user/model');

const Meeting = sequelize.define(
  'Meeting',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [3, 255]
      }
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: 'meetings',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'startTime']
      },
      {
        fields: ['startTime']
      },
      {
        fields: ['endTime']
      }
    ]
  }
);

// Set up relationship
Meeting.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Meeting, { foreignKey: 'userId' });

module.exports = Meeting;
