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
const express_1 = __importDefault(require("express"));
const tokenService_1 = require("./util/tokenService");
const database_1 = __importDefault(require("./util/database"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const multer_1 = __importDefault(require("multer"));
// routes
const googleReviewsRoute_1 = __importDefault(require("./routes/googleReviewsRoute"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const businessRoutes_1 = __importDefault(require("./routes/businessRoutes"));
// models
const User_1 = __importDefault(require("./models/authModel/User"));
const googleReviewModel_1 = __importDefault(require("./models/googleReviewsModel/googleReviewModel"));
const businessModel_1 = __importDefault(require("./models/businessModel/businessModel"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    req.setTimeout(0); // No timeout
    next();
});
// app.use(bodyParser.json());
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
// middlewares
app.use((0, multer_1.default)({
    storage: fileStorage,
    fileFilter: fileFilter
}).single("image"));
// google review routes
// const csrf = require('csurf')
// const csrfProtection = csrf()
// add cors headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
// all routes -------------------------------------------------------------------------
// auth routes
app.use(authRoutes_1.default);
// google review routes
app.use("/reviews", googleReviewsRoute_1.default);
// business routes
app.use("/business", businessRoutes_1.default);
// all routes finsih  -------------------------------------------------------------------------
// csurf middleware
// app.use(csrfProtection);
// default route
app.use("/", (req, res) => {
    res.send("<h1>helldfsdfo</h1>");
});
// Schedule Cleanup Job
node_schedule_1.default.scheduleJob("0 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    // Run every hour
    yield (0, tokenService_1.cleanExpiredTokens)();
    console.log("Expired tokens cleaned up.");
}));
//  relationships
// google review relation ship
googleReviewModel_1.default.belongsTo(User_1.default, { constraints: true, onDelete: "CASCADE" });
User_1.default.hasMany(googleReviewModel_1.default);
// business relationship
businessModel_1.default.belongsTo(User_1.default, { constraints: true, onDelete: "CASCADE" });
User_1.default.hasMany(businessModel_1.default);
// sync with the database
database_1.default
    .sync()
    .then(() => {
    app.listen(8080);
})
    .catch((err) => {
    console.log(err);
});
