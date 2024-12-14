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
exports.getBusiness = exports.postAddBusiness = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const businessModel_1 = __importDefault(require("../models/businessModel/businessModel"));
const postAddBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessName, businessMapUrl } = req.body;
    const image = req.file;
    if (!image) {
        res.status(422).json({ message: "Attached file is not an image" });
        return;
    }
    if (businessName === undefined || businessMapUrl === undefined) {
        res.status(400).json({ message: "mapURL & business is required" });
        return;
    }
    const userId = req.userId; // Get userId from middleware
    if (!userId) {
        res.status(401).json({ message: "Unauthorized: userId is missing" });
        return;
    }
    try {
        const imageUrl = image.path;
        const business = yield businessModel_1.default.create({
            businessName,
            businessMapUrl,
            UserId: +userId,
            logoUrl: imageUrl,
        });
        res.status(201).json({
            message: "Business added successfully",
            business: business.id,
            logoUrl: imageUrl,
        });
        return;
    }
    catch (error) {
        console.error("Error adding business:", error);
        res.status(500).json({ message: "Internal server errors" });
        return;
    }
});
exports.postAddBusiness = postAddBusiness;
const getBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const businesses = yield businessModel_1.default.findAll();
        console.log("businesses", businesses);
        res.status(200).json({ businesses });
    }
    catch (error) {
        console.error("Error fetching businesses:", error);
        res.status(500).json({ message: "Internal server errors" });
    }
});
exports.getBusiness = getBusiness;
