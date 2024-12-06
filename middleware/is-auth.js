require("dotenv").config(); // Load environment variables
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
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
      decodedToken = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      return res.status(500).json({ message: "Failed to verify token" });
    }

    if (!decodedToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    req.userId = decodedToken.userId; // Attach userId to the request for further use
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
