
const express = require('express');

const userController = require('../controllers/user');

const router = express.Router(); 

// user routes 
router.get("/register", userController.getRegister)
router.post("/register", userController.postAddUser)

module.exports = router
