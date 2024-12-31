const { Sequelize } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize('foundation11', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

// Test the connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to MySQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to MySQL:', error);
    }
})();

module.exports = sequelize;
