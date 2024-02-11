const express = require('express');
const { loginController, logoutController, signupContorller } = require('../controller/userController');
const router = express.Router();
// Similar format of importing userController for login, signup, and logout functions invoked for certain HTTP routes.
router.post('/login' ,loginController);
router.get('/logout', logoutController);
router.post('/signup', signupContorller);

module.exports = router;