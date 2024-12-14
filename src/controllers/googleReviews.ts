import dotenv from "dotenv";
dotenv.config();

import { ApifyClient } from "apify-client";
import { Request, Response } from "express";
import GoogleReview from "../models/googleReviewsModel/googleReviewModel";
import Business from "../models/businessModel/businessModel";



export interface CustomRequest extends Request {
  userId?: string;
  reviews?: any[]; // Add `reviews` to the request type
}

export const postSyncGoogleReviews = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { businessID } = req.body;

  if (!businessID) {
    res.status(400).json({ message: "Business ID is required." });
    return;
  }

  const userId = req.userId; // Get userId from middleware
  if (!userId) {
    res.status(401).json({ message: "Unauthorized: userId is missing." });
    return;
  }

  try {
    // Step 1: Validate the business
    const business = await Business.findOne({
      where: {
        id: businessID,
        UserId: userId,
      },
    });

    if (!business) {
      res.status(403).json({ message: "You do not have access to this business." });
      return;
    }

    // Step 2: Access validated reviews from the middleware
    const reviews = req.reviews;
    if (!reviews) {
      res.status(400).json({ message: "Reviews are missing." });
      return;
    }
    // Step 3: Map and store reviews in the database
    const formattedReviews = reviews.map((item: any) => ({
      name: item.name || "Anonymous",
      reviewId: item.reviewId,
      placeId: item.placeId,
      reviewerPhotoUrl: item.reviewerPhotoUrl || "",
      review: item.text || "",
      rating: item.stars || 0,
      totalScore: item.totalScore || 0,

      reviewOrigin: item.reviewOrigin || "unknown",
      reviewerUrl: item.reviewerUrl || "",
      publishAt: item.publishAt || "",
      publishedAtDate: item.publishedAtDate || "",
      BusinessID: businessID, // Associate with the business
    }));

    for (const review of formattedReviews) {
      const [existingReview, created] = await GoogleReview.findOrCreate({
        where: {
          reviewId: review.reviewId,
          BusinessID: businessID, // Ensure uniqueness per business
        },
        defaults: review,
      });

      if (!created) {
        console.log(`Review with ID ${review.reviewId} already exists for Business ID ${businessID}.`);
      }
    }

    // Step 4: Send success response
    res.status(201).json({
      message: "Google reviews fetched and stored successfully.",
      data: formattedReviews,
    });
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message || "Internal server error." });
    } else {
      res.status(500).json({ message: "Internal server error." });
    }
  }
};


export const postFetchGoogleReviews = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // Initialize the ApifyClient with API token
  const userId = req.userId; // Retrieved from authentication middleware

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: userId is missing.' });
    return;
  }

  try {
    // Step 1: Fetch all businesses associated with the user
    const userBusinesses = await Business.findAll({
      where: { UserId: userId },
      attributes: ['id', 'businessName'],
    });

    if (!userBusinesses || userBusinesses.length === 0) {
      res.status(200).json({});
      return;
    }

    const businessIds = userBusinesses.map((business) => business.id);

    // Step 2: Fetch reviews for all businesses
    const reviews = await GoogleReview.findAll({
      where: { BusinessID: businessIds },
      attributes: [
        'id',
        'name',
        'reviewId',
        'placeId',
        'reviewerPhotoUrl',
        'review',
        'rating',
        'totalScore',
        'reviewOrigin',
        'reviewerUrl',
        'publishAt',
        'publishedAtDate',
        'BusinessID',

      ],
      order: [['publishAt', 'DESC']], // Sort reviews by date, newest first
    });



    // Step 3: Group reviews by BusinessID
    const groupedReviews = reviews.reduce((acc:  Record<number, GoogleReview[]>, review) => {
      if (!acc[review.BusinessID]) {
        acc[review.BusinessID] = [];
      }
      acc[review.BusinessID].push(review);
      return acc;
    }, {} as Record<number, GoogleReview[]>);
// Step 4: Convert keys to numbers
const groupedReviewsWithNumberKeys = Object.entries(groupedReviews).reduce(
  (acc, [key, value]) => {
    acc[Number(key)] = value; // Convert key to a number
    return acc;
  },
  {} as Record<number, GoogleReview[]>
);
    // Step 4: Send the grouped reviews
    res.status(200).json({
      message: "Google reviews fetched and stored successfully.",
      data: groupedReviewsWithNumberKeys,
    });
    return 
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }};


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
  