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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenService_1 = require("../util/tokenService");
// maek sure the enviornment variable is defined 
const getEnvVar = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
};
const secret = getEnvVar("JSON_WEB_TOKEN_SECRET");
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header is missing" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token is missing in Authorization header" });
        }
        let decodedToken;
        try {
            // check if the token is blacklisted 
            const blacklisted = yield (0, tokenService_1.isTokenBlacklisted)(token);
            if (blacklisted) {
                return res.status(401).json({ message: "Token is invalid or blacklisted" });
            }
            decodedToken = jsonwebtoken_1.default.verify(token, secret);
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return res.status(401).json({ message: "Token has expired" });
            }
            if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return res.status(401).json({ message: "Invalid token" });
            }
            return res.status(500).json({ message: "Failed to verify token" });
        }
        if (typeof decodedToken !== 'object' || !('userId' in decodedToken)) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        // Attach the userId to the request object
        req.userId = decodedToken.userId;
        next();
    }
    catch (error) {
        console.error("Error in authentication middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.isAuth = isAuth;
