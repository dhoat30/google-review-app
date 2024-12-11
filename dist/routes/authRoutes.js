"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
// user routes 
router.post("/register-or-login", [
    (0, express_validator_1.body)('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    (0, express_validator_1.body)('lastName').trim().isLength({ min: 2 }).optional().withMessage('Last name must be at least 2 characters'),
    (0, express_validator_1.body)('email').trim().isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password').trim().custom(() => (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('provider').trim().isIn(['credentials', 'facebook', 'google']).optional().withMessage('Invalid provider'),
], auth_1.registerOrLoginUser);
router.post("/register", [
    (0, express_validator_1.body)('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    (0, express_validator_1.body)('lastName').trim().isLength({ min: 2 }).optional().withMessage('Last name must be at least 2 characters'),
    (0, express_validator_1.body)('email').trim().isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password').trim().custom(() => (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('provider').trim().isIn(['credentials', 'facebook', 'google']).optional().withMessage('Invalid provider'),
], auth_1.postRegisterUser);
router.post("/sign-out", auth_1.postSignOut);
exports.default = router;
