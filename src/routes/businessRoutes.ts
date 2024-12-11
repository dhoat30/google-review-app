
import express from 'express';
const router = express.Router(); 
import {isAuth} from '../middleware/is-auth'

import { postAddBusiness } from '../controllers/business';
// user routes 
router.post("/add-business", isAuth, postAddBusiness)




export default router
