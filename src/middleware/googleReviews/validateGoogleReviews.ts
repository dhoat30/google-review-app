import { Request, Response, NextFunction } from "express";
import { fetchGoogleReviews } from '../../util/fetchGoogleReviews'
export interface CustomRequest extends Request {
    reviews?: any[]; // Add the reviews property
  }
  
export const validateGoogleReviews = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { businessMapUrl } = req.body;

  if (!businessMapUrl) {
    res.status(400).json({ message: "Map URL is required." });
    return;
  }

  try {
    // Fetch Google reviews using the utility function
    const reviews = await fetchGoogleReviews(businessMapUrl);

    // Attach reviews to the request object
   console.log(reviews)
    req.reviews = reviews;

    // Proceed to the next middleware or controller
    next();
  } catch (error)  {
    console.error("Error validating Google reviews:", error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message || "Invalid Map URL." });
    } else {
      res.status(400).json({ message: "Invalid Map URL." });
    }
  }
};