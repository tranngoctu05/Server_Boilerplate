const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pwdHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        rankPoints: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        distance: {
            type: DataTypes.NUMERIC,
            defaultValue: 0,
        },
        totalTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        totalLocations: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        invitedFriends: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        tableName: 'users',
        timestamps: false, // vì bạn sẽ quản lý timestamps riêng
        hooks: {
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.pwdHash = await bcrypt.hash(user.pwdHash, salt);
                user.createdAt = new Date();
                user.updatedAt = new Date();
            },
            beforeUpdate: (user) => {
                user.updatedAt = new Date();
            },
        },
    });

    sequelize.sync({ force: false });
}
