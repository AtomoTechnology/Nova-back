const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nova', 'root', 'jhm.ok', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
