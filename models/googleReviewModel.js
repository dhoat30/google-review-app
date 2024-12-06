const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const GoogleReview = sequelize.define('google-review', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }, 
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    lastName: {
        type: Sequelize.STRING,
        allowNull: true
    }, 
  
})

module.exports = GoogleReview; 
