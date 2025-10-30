const express = require('express');
const userCtrl = require('../controllers/userController');
const router = express.Router();
//const { protect } = require("../middlewares/auth");

router.post('/register', userCtrl.registerUser);
// router.post('login', login);
// router.get('/profile', protect, getProfile);

module.exports = router;