import Sequelize from 'sequelize';
import sequelize from '../../util/database';

export const TokenBlacklist = sequelize.define('token-blacklist', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }, 
    token: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
   
    expiresAt: { 
        type: Sequelize.DATE,
        allowNull: false
    }
})


