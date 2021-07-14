const express = require('express');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// controller
const UserController = require('../controllers/user');

// routes
router.post('/signup', UserController.user_signup);
router.post('/login', UserController.user_login);
router.delete('/:userId', checkAuth, UserController.user_delete);

module.exports = router;