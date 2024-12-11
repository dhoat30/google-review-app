
import express from 'express';
import { body } from 'express-validator';
import {registerOrLoginUser, postSignOut, postRegisterUser} from '../controllers/auth';
const router = express.Router(); 

// user routes 
router.post("/register-or-login",  [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).optional().withMessage('Last name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Invalid email address'),
  body('password').trim().custom(()=> (value: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)).withMessage('Password must be at least 6 characters long'),
  body('provider').trim().isIn(['credentials', 'facebook', 'google']).optional().withMessage('Invalid provider'),
], registerOrLoginUser)


router.post("/register",  [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).optional().withMessage('Last name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Invalid email address'),
  body('password').trim().custom(()=> (value: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)).withMessage('Password must be at least 6 characters long'),
  body('provider').trim().isIn(['credentials', 'facebook', 'google']).optional().withMessage('Invalid provider'),
], postRegisterUser)

router.post("/sign-out", postSignOut)

export default router
