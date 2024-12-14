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
exports.getGoogleReviews = exports.postSyncGoogleReviews = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apify_client_1 = require("apify-client");
const googleReviewModel_1 = __importDefault(require("../models/googleReviewsModel/googleReviewModel"));
const postSyncGoogleReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { mapURL } = req.body;
    if (mapURL === undefined) {
        res.status(400).json({ message: "mapURL is required" });
        return;
    }
    const userId = req.userId; // Get userId from middleware
    if (!userId) {
        res.status(401).json({ message: "Unauthorized: userId is missing" });
        return;
    }
    // Initialize the ApifyClient with API token
    const client = new apify_client_1.ApifyClient({
        token: process.env.APPIFY_API_TOKEN,
    });
    // Prepare Actor input
    const input = {
        startUrls: [
            {
                url: mapURL,
            },
        ],
        maxReviews: 100,
        reviewsSort: "newest",
        language: "en",
        reviewsOrigin: "all",
        personalData: true,
    };
    try {
        // Run the Actor and wait for it to finish
        const run = yield client.actor("Xb8osYTtOjlsgI6k9").call(input);
        // Fetch and print Actor results from the run's dataset (if any)
        console.log("Results from dataset");
        const { items } = yield client.dataset(run.defaultDatasetId).listItems();
        if ((_a = items[0]) === null || _a === void 0 ? void 0 : _a.error) {
            res.status(400).json({ message: items[0].errorDescription });
            return;
        }
        // Process and store reviews in the database
        const reviews = items.map((item) => ({
            name: item.name || "Anonymous",
            reviewId: item.reviewId,
            reviewerPhotoUrl: item.reviewerPhotoUrl || "",
            review: item.text || "",
            rating: item.stars || 0,
            reviewOrigin: item.reviewOrigin || "unknown",
            reviewerUrl: item.reviewerUrl || "",
            publishAt: item.publishAt || "",
            publishedAtDate: item.publishedAtDate || "",
            UserId: userId, // Associate review with the logged-in user
        }));
        for (const review of reviews) {
            // Include userId in the uniqueness check
            const [existingReview, created] = yield googleReviewModel_1.default.findOrCreate({
                where: {
                    reviewId: review.reviewId,
                    UserId: +userId, // Ensure it's unique for the same user
                },
                defaults: Object.assign(Object.assign({}, review), { UserId: +userId }), // Set userId in defaults
            });
            if (!created) {
                console.log(`Review with ID ${review.reviewId} already exists for user ID ${req.userId}.`);
            }
        }
        // Send success response
        res.status(201).json({
            message: "Google Reviews fetched and stored successfully",
            data: reviews,
        });
        return;
    }
    catch (error) {
        console.error("Error fetching Google Reviews:", error);
        res.status(500).json({ message: "Internal server errors" });
        return;
    }
});
exports.postSyncGoogleReviews = postSyncGoogleReviews;
const getGoogleReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize the ApifyClient with API token
    const client = new apify_client_1.ApifyClient({
        token: process.env.APPIFY_API_TOKEN,
    });
    // Prepare Actor input
    const input = {
        startUrls: [
            {
                url: "https://maps.app.goo.gl/FTrssH3eMxC5Hn2X6",
            },
        ],
        maxReviews: 100,
        reviewsSort: "newest",
        language: "en",
        reviewsOrigin: "all",
        personalData: true,
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // Run the Actor and wait for it to finish
        const run = yield client.actor("Xb8osYTtOjlsgI6k9").call(input);
        // Fetch and print Actor results from the run's dataset (if any)
        console.log("Results from dataset");
        const { items } = yield client.dataset(run.defaultDatasetId).listItems();
        // send success repsonse
        res.status(201).json({
            message: "Google Review fetched Successfully",
            data: items,
        });
    }))();
});
exports.getGoogleReviews = getGoogleReviews;
// (async () => {
//   // Run the Actor and wait for it to finish
//   const run = await client.actor("Xb8osYTtOjlsgI6k9").call(input);
//   // Fetch and print Actor results from the run's dataset (if any)
//   console.log("Results from dataset");
//   const { items } = await client.dataset(run.defaultDatasetId).listItems();
//   // send success repsonse
//   res.status(201).json({
//     message: "Google Review fetched Successfully",
//     data: items,
//     return
//   });
// })();
