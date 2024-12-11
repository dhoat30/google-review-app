"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../util/database"));
const sequelize_1 = __importDefault(require("sequelize"));
const GoogleReview = database_1.default.define('google-review', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    lastName: {
        type: sequelize_1.default.STRING,
        allowNull: true
    },
});
exports.default = GoogleReview;
