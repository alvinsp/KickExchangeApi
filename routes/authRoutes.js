const express = require('express');
const router = express.Router();
const { registerUser, signInUser,  } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', signInUser);
module.exports = router;
