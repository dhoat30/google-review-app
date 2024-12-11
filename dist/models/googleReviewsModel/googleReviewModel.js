"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../util/database"));
const sequelize_1 = require("sequelize");
// define the sequelize google review model
class GoogleReview extends sequelize_1.Model {
}
GoogleReview.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize: database_1.default, // Pass the Sequelize instance
    modelName: "google-reviews", // Table name
});
exports.default = GoogleReview;
