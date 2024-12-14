"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const is_auth_1 = require("../middleware/is-auth");
const business_1 = require("../controllers/business");
// user routes 
router.post("/add-business", is_auth_1.isAuth, business_1.postAddBusiness);
router.post("/get-businesses", business_1.getBusiness);
exports.default = router;
