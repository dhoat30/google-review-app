"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../util/database"));
const sequelize_1 = require("sequelize");
// define the sequelize google review model
class Business extends sequelize_1.Model {
}
Business.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    businessName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    businessMapUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    logoUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    UserId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.default, // Pass the Sequelize instance
    modelName: "business", // Table name
});
exports.default = Business;
