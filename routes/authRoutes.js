
const express = require('express');
const {body} = require('express-validator');
const authController = require('../controllers/auth');

const router = express.Router(); 

// user routes 
router.post("/register-or-login",  [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).optional().withMessage('Last name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Invalid email address'),
  body('password').trim().custom(()=> (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)).withMessage('Password must be at least 6 characters long'),
  body('provider').trim().isIn(['credentials', 'facebook', 'google']).optional().withMessage('Invalid provider'),
], authController.registerOrLoginUser)


router.post("/register",  [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).optional().withMessage('Last name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Invalid email address'),
  body('password').trim().custom(()=> (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)).withMessage('Password must be at least 6 characters long'),
  body('provider').trim().isIn(['credentials', 'facebook', 'google']).optional().withMessage('Invalid provider'),
], authController.postRegisterUser)


module.exports = router
