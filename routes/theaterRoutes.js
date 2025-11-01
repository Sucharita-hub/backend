const express = require('express');
const router = express.Router();
const theaterCtrl = require('../controllers/theaterController');
const { protect } = require('../middlewares/auth');
const { admin }  = require('../middlewares/admin');
const { route } = require('./userRoutes');

router.post('/add', protect, admin, theaterCtrl.addTheater);
router.post('/:id/screen', protect, admin, theaterCtrl.addScreenToTheater);
router.get('/', theaterCtrl.getAllTheaters);
router.get('/:id', theaterCtrl.getTheaterById);
router.put('/:id', protect, admin, theaterCtrl.updateTheater);
router.delete('/:id', protect, admin, theaterCtrl.deleteTheater);

module.exports = router;
