"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googleReviews_1 = require("../controllers/googleReviews");
const is_auth_1 = require("../middleware/is-auth");
const router = express_1.default.Router();
// user routes 
router.get("/get-google-reviews", googleReviews_1.getGoogleReviews);
router.post('/sync-google-reviews', is_auth_1.isAuth, googleReviews_1.postSyncGoogleReviews);
exports.default = router;
