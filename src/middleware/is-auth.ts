import dotenv from 'dotenv';
dotenv.config(); 
import jwt, { JwtPayload } from 'jsonwebtoken';
import {isTokenBlacklisted} from '../util/tokenService';
import { Request, Response, NextFunction } from 'express';

// maek sure the enviornment variable is defined 
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

const secret = getEnvVar("JSON_WEB_TOKEN_SECRET");



export const isAuth  = async (  req: Request & { userId?: string }, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is missing in Authorization header" });
    }

    let decodedToken;
    try {
        // check if the token is blacklisted 
      const blacklisted = await isTokenBlacklisted(token);
      if (blacklisted) {
        return res.status(401).json({ message: "Token is invalid or blacklisted" });
      }
      decodedToken = jwt.verify(token, secret);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token has expired" });
      }
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid token" });
      }
      return res.status(500).json({ message: "Failed to verify token" });
    }

    if (typeof decodedToken !== 'object' || !('userId' in decodedToken)) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Attach the userId to the request object
    req.userId = (decodedToken as JwtPayload).userId;
    next();
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


