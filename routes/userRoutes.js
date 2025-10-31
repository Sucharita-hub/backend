const express = require('express');
const userCtrl = require('../controllers/userController');
const router = express.Router();
const { protect } = require('../middlewares/auth');

router.post('/register', userCtrl.registerUser);
router.post('/login', userCtrl.loginUser);
//router.get('/profile',  protect, userCtrl.getUserProfile);
router.put('/profile', protect, userCtrl.updateUserProfile);
router.get('/bookings', protect, userCtrl.getUserBookings);

module.exports = router;