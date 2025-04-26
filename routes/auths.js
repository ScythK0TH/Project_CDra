const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

// Middleware to parse request body
router.use(express.urlencoded({ extended: true }));

router.get('/login', UsersController.showLoginForm); // Show login form
router.post('/login', authController.login); // Handle login form submission
// router.get('/logout', UsersController.logout); // Handle logout

module.exports = router;
