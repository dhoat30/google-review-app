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
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    reviewId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    reviewerPhotoUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    review: {
        type: sequelize_1.DataTypes.TEXT('long'),
        allowNull: false
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    reviewOrigin: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    reviewerUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    publishAt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    publishedAtDate: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    UserId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.default, // Pass the Sequelize instance
    modelName: "google-reviews", // Table name
});
exports.default = GoogleReview;
