const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite:db/express.db');

module.exports = sequelize