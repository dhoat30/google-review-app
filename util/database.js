const Sequelize = require('sequelize');

const sequelize = new Sequelize('google-review-app', "root", "Observer13$", {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;