const express = require('express');
const router = express.Router();
const showtimeCtrl = require('../controllers/showtimeController');
const { protect } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');

router.post('/add', protect, admin, showtimeCtrl.addshowtime);
 router.get('/movie/:movieId', showtimeCtrl.getShowtimeByMovie);
 router.get('/theater/:theaterId', showtimeCtrl.getShowtimeByTheater);
 router.put('/:id', protect, admin, showtimeCtrl.updateShowtime);
router.delete('/:id',protect, admin, showtimeCtrl.deleteShowtime);

module.exports = router;