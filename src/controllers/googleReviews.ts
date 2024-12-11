import dotenv from "dotenv";
dotenv.config();

import { ApifyClient } from "apify-client";
import { Request, Response } from "express";
import GoogleReview from "../models/googleReviewsModel/googleReviewModel";

export interface CustomRequest extends Request {
  userId?: string; // Add the userId property
}


export const postSyncGoogleReviews = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
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
  const client = new ApifyClient({
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
    const run = await client.actor("Xb8osYTtOjlsgI6k9").call(input);

    // Fetch and print Actor results from the run's dataset (if any)
    console.log("Results from dataset");
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (items[0]?.error) {
      res.status(400).json({ message: items[0].errorDescription });
      return;
    } 
     // Process and store reviews in the database
     const reviews = items.map((item: any) => ({
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
      const [existingReview, created] = await GoogleReview.findOrCreate({
        where: {
          reviewId: review.reviewId,
          UserId: +userId, // Ensure it's unique for the same user
        },
        defaults: { ...review, UserId: +userId }, // Set userId in defaults
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
  
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    res.status(500).json({ message: "Internal server errors" });
    return;
  }
};

export const getGoogleReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Initialize the ApifyClient with API token
  const client = new ApifyClient({
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

  (async () => {
    // Run the Actor and wait for it to finish
    const run = await client.actor("Xb8osYTtOjlsgI6k9").call(input);

    // Fetch and print Actor results from the run's dataset (if any)
    console.log("Results from dataset");
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    // send success repsonse
    res.status(201).json({
      message: "Google Review fetched Successfully",
      data: items,
    });
  })();
};

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
