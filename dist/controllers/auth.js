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
exports.postSignOut = exports.postRegisterUser = exports.registerOrLoginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/authModel/User"));
const tokenService_1 = require("../util/tokenService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getEnvVar = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
};
const secret = getEnvVar("JSON_WEB_TOKEN_SECRET");
const registerOrLoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, provider } = req.body;
    try {
        // Check if the user already exists
        const existingUser = yield User_1.default.findOne({ where: { email } });
        if (provider === "credentials") {
            if (!existingUser) {
                res.status(401).json({ message: "User doesn't exist" });
                return;
            }
            // Authenticate with credentials
            const isPasswordValid = yield bcryptjs_1.default.compare(password, existingUser.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: "Invalid password" });
                return;
            }
            // Generate a JWT for existing user
            const token = jsonwebtoken_1.default.sign({ email: existingUser.email, userId: existingUser.id }, secret, { expiresIn: "48h" });
            res.status(200).json({
                message: "User signed in successfully",
                userId: existingUser.id,
                email: existingUser.email,
                token,
            });
            return;
        }
        else {
            // Social login
            let user;
            if (existingUser) {
                user = existingUser;
            }
            else {
                // Hash the password (only if not using an OAuth provider)
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                // Create a new user for social login
                user = yield User_1.default.create({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword, //random password for social login 
                    provider: provider,
                });
            }
            // Generate a JWT for the user (existing or new)
            const token = jsonwebtoken_1.default.sign({ email: user.email, userId: user.id }, secret, { expiresIn: "48h" });
            res.status(201).json({
                message: "User registered and signed in successfully",
                token,
            });
        }
    }
    catch (error) {
        console.error("Error in registerOrLoginUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.registerOrLoginUser = registerOrLoginUser;
// Create a new user (for POST requests)
const postRegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, provider } = req.body;
    try {
        // Check if the user already exists
        const existingUser = yield User_1.default.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        // Hash the password (only if not using an OAuth provider)
        const hashedPassword = provider === "credentials" ? yield bcryptjs_1.default.hash(password, 10) : yield bcryptjs_1.default.hash("temppassword", 10);
        // Create a new user
        const newUser = yield User_1.default.create({
            firstName,
            lastName,
            email,
            password: hashedPassword, // Save hashed password
            provider: provider,
        });
        res.status(201).json({ message: "User added successfully", user: newUser.id });
    }
    catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.postRegisterUser = postRegisterUser;
// sign out 
const postSignOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        res.status(400).json({ message: "Token is required" });
        return;
    }
    try {
        // Decode the token to get the expiration time
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || !decoded.exp) {
            res.status(400).json({ message: "Invalid token" });
            return;
        }
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const expiresIn = decoded.exp - currentTime; // Remaining time in seconds
        if (expiresIn <= 0) {
            res.status(400).json({ message: "Token already expired" });
            return;
        }
        // Add the token to the blacklist
        yield (0, tokenService_1.addTokenToBlacklist)(token, expiresIn);
        res.status(200).json({ message: "Token revoked successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error revoking token:", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
        else {
            console.error("Error revoking token:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});
exports.postSignOut = postSignOut;
