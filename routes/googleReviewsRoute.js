
const express = require('express');
const {body} = require('express-validator');
const GoogleReviewsController = require('../controllers/googleReviews');
const isAuth  = require('../middleware/is-auth');
const router = express.Router(); 

// user routes 

router.post("/create-google-review", isAuth, GoogleReviewsController.postCreateGoogleReview)

module.exports = router
