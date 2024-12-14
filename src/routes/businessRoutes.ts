
import express from 'express';
const router = express.Router(); 
import {isAuth} from '../middleware/is-auth'

import { postAddBusiness, getBusiness } from '../controllers/business';
import { validateGoogleReviews } from '../middleware/googleReviews/validateGoogleReviews';
// user routes 
router.post("/add-business", isAuth, validateGoogleReviews,  postAddBusiness)

router.get("/get-business", isAuth, getBusiness)



export default router