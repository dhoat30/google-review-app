require('dotenv').config(); // Load environment variables

const GoogleReview = require("../models/googleReviewModel");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");


// Create a new google review
exports.postCreateGoogleReview = async (req, res) => {
  const errors = validationResult(req);

  // Check for validation errors
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }

  const { firstName, lastName } = req.body; // Destructure from req.body

  try {


    // Create the user
    const newGoogleReview = await GoogleReview.create({
      firstName,
      lastName,
 
    });

    // Send success response
    return res.status(201).json({
      message: "Google Review Added Succesfully  added successfully",
      data: { googleReviewId: newGoogleReview.id },
    });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

