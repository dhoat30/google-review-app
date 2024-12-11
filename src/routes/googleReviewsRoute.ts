
import express from 'express';
import {getGoogleReviews, postSyncGoogleReviews} from '../controllers/googleReviews'
import {isAuth} from '../middleware/is-auth'
const router = express.Router(); 

// user routes 

router.get("/get-google-reviews", getGoogleReviews)

router.post('/sync-google-reviews', isAuth, postSyncGoogleReviews)

export default router;
