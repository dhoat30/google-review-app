import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import Business from "../models/businessModel/businessModel";
export interface CustomRequest extends Request {
  userId?: string; // Add the userId property
}


export const postAddBusiness = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { businessName } = req.body;


  const userId = req.userId; // Get userId from middleware
  if (!userId) {
    res.status(401).json({ message: "Unauthorized: userId is missing" });
    return;
  }
 
  try {
  
  
  } catch (error) {
    console.error("Error adding business:", error);
    res.status(500).json({ message: "Internal server errors" });
    return;
  }
};
