const express = require('express');
const router = express.Router();
const movieCtrl = require('../controllers/movieController');
const { protect }   = require('../middlewares/auth');
const { admin }  = require('../middlewares/admin');
//const { route } = require('./userRoutes');

router.post('/add', protect, movieCtrl.addMovie);
router.get('/', movieCtrl.getAllMovies);
router.get('/:id', movieCtrl.getMovieById);
router.put('/:id', protect, admin, movieCtrl.updateMovie);
router.delete('/:id', protect, admin, movieCtrl.deleteMovie);

module.exports = router;