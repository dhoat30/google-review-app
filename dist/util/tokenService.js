"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanExpiredTokens = exports.isTokenBlacklisted = exports.addTokenToBlacklist = void 0;
const TokenBlacklist_1 = require("../models/authModel/TokenBlacklist");
const sequelize_1 = require("sequelize");
// add token to blacklist 
const addTokenToBlacklist = (token, expiresInSeconds) => __awaiter(void 0, void 0, void 0, function* () {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    try {
        yield TokenBlacklist_1.TokenBlacklist.create({ token, expiresAt });
        console.log("Token blacklisted successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error blacklisting token:", error.message);
        }
        else {
            console.error("Error blacklisting token:", error);
        }
    }
});
exports.addTokenToBlacklist = addTokenToBlacklist;
// check if token is blacklisted
const isTokenBlacklisted = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blacklistedToken = yield TokenBlacklist_1.TokenBlacklist.findOne({
            where: {
                token,
                expiresAt: { [sequelize_1.Op.gt]: new Date() }, // Use Op directly
            },
        });
        return !!blacklistedToken; // Return true if token is found and valid
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error checking token blacklist:", error.message);
        }
        else {
            console.error("Error checking token blacklist:", error);
        }
        return false; // Treat as not blacklisted if an error occurs
    }
});
exports.isTokenBlacklisted = isTokenBlacklisted;
//   clean expired tokens from blacklist 
const cleanExpiredTokens = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield TokenBlacklist_1.TokenBlacklist.destroy({
            where: {
                expiresAt: { [sequelize_1.Op.gt]: new Date() }, // Use Op directly
            },
        });
        console.log(`${result} expired tokens cleaned up`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error cleaning up tokens:", error.message);
        }
        else {
            console.error("Error cleaning up tokens:", error);
        }
    }
});
exports.cleanExpiredTokens = cleanExpiredTokens;
