import bcrypt from 'bcryptjs';
import User from '../models/authModel/User'
import {addTokenToBlacklist } from '../util/tokenService';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';

interface AuthRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    provider?: string; // Marked optional
  };
}

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};
const secret = getEnvVar("JSON_WEB_TOKEN_SECRET");


export const registerOrLoginUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, provider } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (provider === "credentials") {
      if (!existingUser) {
         res.status(401).json({ message: "User doesn't exist" });
         return
      }

      // Authenticate with credentials
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
         res.status(401).json({ message: "Invalid password" });
         return
      }
      
      // Generate a JWT for existing user
      const token = jwt.sign(
        { email: existingUser.email, userId: existingUser.id },
        secret, 
        { expiresIn: "48h" }
      );

       res.status(200).json({
        message: "User signed in successfully",
        userId: existingUser.id,
        email: existingUser.email,
        token,
      });
      return
    } else { 
      // Social login
      let user;
      if (existingUser) {
        user = existingUser; 
      } else {
           // Hash the password (only if not using an OAuth provider)
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new user for social login
        user = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword, //random password for social login 
          provider: provider as string,
        });
      }

      // Generate a JWT for the user (existing or new)
      const token = jwt.sign(
        { email: user.email, userId: user.id },
        secret, 
                { expiresIn: "48h" }
      );

      res.status(201).json({
        message: "User registered and signed in successfully",
        token,
      });
    }
  } catch (error) {
    console.error("Error in registerOrLoginUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return
  }
};


// Create a new user (for POST requests)
export const postRegisterUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, provider } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
       res.status(409).json({ message: "User already exists" });
       return
    }

    // Hash the password (only if not using an OAuth provider)
    const hashedPassword = provider === "credentials" ? await bcrypt.hash(password, 10) : await bcrypt.hash("temppassword", 10);

    // Create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Save hashed password
      provider: provider as string,
    });

    res.status(201).json({ message: "User added successfully", user: newUser.id });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// sign out 
export const postSignOut = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
     res.status(400).json({ message: "Token is required" });
     return
  }

  try {
    // Decode the token to get the expiration time
    const decoded = jwt.decode(token);

    if (!decoded || !(decoded as jwt.JwtPayload).exp) {
       res.status(400).json({ message: "Invalid token" });
       return
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expiresIn = (decoded as jwt.JwtPayload).exp! - currentTime; // Remaining time in seconds

    if (expiresIn <= 0) {
       res.status(400).json({ message: "Token already expired" });
       return
    }

    // Add the token to the blacklist
    await addTokenToBlacklist(token, expiresIn);

    res.status(200).json({ message: "Token revoked successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error revoking token:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      console.error("Error revoking token:", error);
      res.status(500).json({ message: "Internal Server Error" });

    }
  }
};
