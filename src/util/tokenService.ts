import {TokenBlacklist} from '../models/authModel/TokenBlacklist'
import {  Op } from 'sequelize';
// add token to blacklist 
export const addTokenToBlacklist = async (token: string, expiresInSeconds: number) => {
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  try {
    await TokenBlacklist.create({ token, expiresAt });
    console.log("Token blacklisted successfully");
  } catch (error) {
    if(error instanceof Error) {
    console.error("Error blacklisting token:", error.message);
  }
  else { 
    console.error("Error blacklisting token:", error);
  }
}
};

// check if token is blacklisted
export const isTokenBlacklisted = async (token: string) => {
    try {
      const blacklistedToken = await TokenBlacklist.findOne({
        where: {
          token,
          expiresAt: { [Op.gt]: new Date() }, // Use Op directly
        },
      });
  
      return !!blacklistedToken; // Return true if token is found and valid
    } catch (error) {
      if(error instanceof Error){ 
        console.error("Error checking token blacklist:", error.message);

      }else{ 
        console.error("Error checking token blacklist:", error);
      }
      return false; // Treat as not blacklisted if an error occurs
    }
  };

//   clean expired tokens from blacklist 
export const cleanExpiredTokens = async () => {
    try {
      const result = await TokenBlacklist.destroy({
        where: {
          expiresAt: { [Op.gt]: new Date() }, // Use Op directly
        },
      });
  
      console.log(`${result} expired tokens cleaned up`);
    } catch (error) {
      if(error instanceof Error) {
        console.error("Error cleaning up tokens:", error.message);
      } 
      else { 
        console.error("Error cleaning up tokens:", error);
      }
    }
  };