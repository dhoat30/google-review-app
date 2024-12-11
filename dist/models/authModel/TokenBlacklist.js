"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBlacklist = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../../util/database"));
exports.TokenBlacklist = database_1.default.define('token-blacklist', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    token: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    expiresAt: {
        type: sequelize_1.default.DATE,
        allowNull: false
    }
});
