import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import path from 'path';

import { cleanExpiredTokens } from "./util/tokenService";
import sequelize from "./util/database";
import schedule from "node-schedule";
import multer, { FileFilterCallback } from "multer";
// routes
import googleReviewsRoute from "./routes/googleReviewsRoute";
import authRoutes from "./routes/authRoutes";
import businessRoutes from "./routes/businessRoutes";

// models
import User from "./models/authModel/User";
import GoogleReview from "./models/googleReviewsModel/googleReviewModel";
import Business from "./models/businessModel/businessModel";

const app = express();

// Serve static files from the "images" directory
app.use('/images', express.static(path.join(__dirname, '../images')));

app.use((req, res, next) => {
  req.setTimeout(0); // No timeout
  next();
});
app.use(bodyParser.json());
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-"); // Replace colons and dots

    cb(null, timestamp + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" || 
       file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// middlewares
app.use(
  multer({
   storage: fileStorage, 
    fileFilter: fileFilter
  }).single("image")
);

// google review routes

// const csrf = require('csurf')

// const csrfProtection = csrf()



// add cors headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// all routes -------------------------------------------------------------------------
// auth routes
app.use(authRoutes);
// google review routes
app.use("/reviews", googleReviewsRoute);
// business routes
app.use("/business", businessRoutes);
// all routes finsih  -------------------------------------------------------------------------

// csurf middleware
// app.use(csrfProtection);

// default route
app.use("/", (req, res) => {
  res.send("<h1>helldfsdfo</h1>");
});


// Schedule Cleanup Job
schedule.scheduleJob("0 * * * *", async () => {
  // Run every hour
  await cleanExpiredTokens();
  console.log("Expired tokens cleaned up.");
});

//  relationships
// google review relation ship
GoogleReview.belongsTo(Business, {
  foreignKey: 'BusinessID', // Use BusinessID consistently
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  constraints: true
});
Business.hasMany(GoogleReview,  {
  foreignKey: 'BusinessID', // Ensure consistency in foreign key naming
});

// business relationship
Business.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Business);

// sync with the database
sequelize
  .sync()
  .then(() => {
    app.listen(8080);
  })
  .catch((err: Error) => {
    console.log(err);
  });
