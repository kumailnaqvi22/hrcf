const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Donation = sequelize.define('Donation', {
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    donationType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    zip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isAnonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    tools: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    materials: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    upiId: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
}, {
    timestamps: true, // Enable createdAt and updatedAt
});

module.exports = Donation;
