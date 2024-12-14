
import express from 'express';
import {getGoogleReviews, postSyncGoogleReviews, postFetchGoogleReviews} from '../controllers/googleReviews'
import {isAuth} from '../middleware/is-auth'
import { validateGoogleReviews } from '../middleware/googleReviews/validateGoogleReviews';
const router = express.Router(); 

// user routes 

router.get("/get-google-reviews", getGoogleReviews)

router.post('/fetch-google-reviews', isAuth, postFetchGoogleReviews)
router.post('/sync-google-reviews', isAuth, validateGoogleReviews,  postSyncGoogleReviews)

export default router;
