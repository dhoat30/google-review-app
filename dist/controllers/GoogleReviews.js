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
// import { Request, Response } from "express";
const postSyncGoogleReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mapURL } = req.body;
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
        // Send success response
        res.status(201).json({
            message: "Google Review fetched Successfully",
            data: items,
        });
        return;
    }
    catch (error) {
        console.error("Error fetching Google Reviews:", error);
        res.status(500).json({ message: "Internal server error" });
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
