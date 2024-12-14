import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import Business from "../models/businessModel/businessModel";
import GoogleReview from "../models/googleReviewsModel/googleReviewModel";
import sequelize from '../util/database' 
export interface CustomRequest extends Request {
  userId?: string;
  reviews?: any[]; // Add `reviews` to the request type

}

export const postAddBusiness = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { businessName, businessMapUrl } = req.body;
  const image = req.file;

  if (!image) {
    res.status(422).json({ message: "Attached file is not an image" });
    return;
  }

  if (!businessName || !businessMapUrl) {
    res.status(400).json({ message: "mapURL & businessName are required" });
    return;
  }

  const userId = req.userId; // Get userId from middleware
  if (!userId) {
    res.status(401).json({ message: "Unauthorized: userId is missing" });
    return;
  }

  const reviews = req.reviews || []; // Get reviews from the request

  if (!reviews || reviews.length === 0) {
    res.status(400).json({ message: "Reviews are missing" });
    return;
  }

  // Start a transaction for atomic operations
  const transaction = await sequelize.transaction();

  try {
    // Step 1: Check for existing reviews with the same placeId for the user
    const existingPlaceIds = await GoogleReview.findAll({
      where: {
        placeId: reviews.map((review: any) => review.placeId),
        BusinessID: await Business.findAll({
          where: { UserId: userId },
          attributes: ["id"],
          raw: true,
        }).then((businesses) => businesses.map((b) => b.id)),
      },
      attributes: ["placeId"],
    });

    const existingPlaceIdSet = new Set(existingPlaceIds.map((review) => review.placeId));

    // If any of the incoming reviews have a placeId already saved, return an error
    const duplicateReviews = reviews.filter((review: any) => existingPlaceIdSet.has(review.placeId));
    if (duplicateReviews.length > 0) {
      res.status(400).json({
        message: "You already have reviews for this place associated with your other business.",
        duplicatePlaceIds: duplicateReviews.map((r) => r.placeId),
      });
      await transaction.rollback();
      return;
    }

    // Step 2: Save the business
    const imageUrl = image.path;
    const business = await Business.create(
      {
        businessName,
        businessMapUrl,
        UserId: +userId,
        logoUrl: `${process.env.URL}/${imageUrl}`,
      },
      { transaction }
    );

    // Step 3: Save Google reviews (if they pass the duplicate check)
    const formattedReviews = reviews.map((item: any) => ({
      name: item.name || "Anonymous",
      placeId: item.placeId,
      reviewId: item.reviewId,
      reviewerPhotoUrl: item.reviewerPhotoUrl || "",
      review: item.text || "",
      rating: item.stars || 0,
      totalScore: item.totalScore || 0,
      reviewOrigin: item.reviewOrigin || "unknown",
      reviewerUrl: item.reviewerUrl || "",
      publishAt: item.publishAt || "",
      publishedAtDate: item.publishedAtDate || "",
      BusinessID: business.id, // Associate with the new business
    }));

    if (formattedReviews.length > 0) {
      await GoogleReview.bulkCreate(formattedReviews, { transaction });
    }

    // Commit the transaction
    await transaction.commit();

    // Step 4: Respond with success
    res.status(201).json({
      message: "Business and Google reviews added successfully",
      businessID: business.id,
      logoUrl: business.logoUrl,
      businessName: business.businessName,
      businessMapUrl: business.businessMapUrl,
      reviews: formattedReviews,
    });

    return;
  } catch (error) {
    console.error("Error adding business:", error);
    await transaction.rollback(); // Rollback in case of error
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getBusiness = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId; // Get userId from middleware
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: userId is missing" });
      return;
    }
   
    const business = await Business.findAll({ 
      attributes: ['businessName', 'logoUrl', 'businessMapUrl', "id"], 
      where: { UserId:userId },
    });
  
    res.status(200).json({ data: business, message: "Businesses fetched successfully" });
    return 
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ message: "Internal server errors" });
  }
}

