const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const bookingCtrl = require('../controllers/bookingController');

router.post('/confirm', protect, bookingCtrl.confirmBooking);
router.get('/:id', protect, bookingCtrl.getBookingById);
router.get('/', protect, bookingCtrl.getMyBookings);

module.exports = router;
