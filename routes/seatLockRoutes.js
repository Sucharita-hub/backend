const express = require('express');
const seatLockCtrl = require('../controllers/seatLockController');
const { protect } = require('../middlewares/auth');
const router = express.Router();

router.post('/lock', protect, seatLockCtrl.lockedSeats);
router.post('/release', protect,  seatLockCtrl.releaseSeats);
router.get('/status/:id', protect, seatLockCtrl.getSeatStatus);

module.exports = router;