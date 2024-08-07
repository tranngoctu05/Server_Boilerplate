const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'John',
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Joe',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'Employees',
      timestamps: true,
      paranoid: true,
      createdAt: false,
      updatedAt: 'updated_atttt',
    },
  );  
  const ContractInfo = sequelize.define(
    'ContractInfo',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      contractNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'ContractInfos',
      timestamps: true,
      paranoid: true,
    },
  );

  const Tweet = sequelize.define(
    'Tweet',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'Tweets',
      timestamps: true,
      paranoid: true,
    },
  );

  sequelize.sync({ alter: true }); // Xem xét dùng { force: true } trong trường hợp thay đổi cấu trúc lớn
};
