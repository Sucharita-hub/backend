const express = require('express');
const router = express.Router();
const screenCtrl = require('../controllers/screenController');
const { protect } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');

router.post('/add', protect, admin, screenCtrl.addScreen);
router.get('/theater/:theaterId', screenCtrl.getScreenByTheater);
router.put('/:id', protect, admin, screenCtrl.updateScreen);
router.delete('/:id', protect, admin, screenCtrl.deleteScreen);

module.exports = router;

