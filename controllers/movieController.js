const Movie = require('../models/Movie');

exports.addMovie = async (req, res) => {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
};

exports.getAllMovies = async (req, res) => {
    const movies = await Movie.find().sort({ release_date: -1 });
    res.json(movies);
};

exports.getMovieById = async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        return res.status(404).json({ message: 'movie not found' });
        res.json(movie);
    }
};

exports.updateMovie = async (req, res) => {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(movie);
};

exports.deleteMovie = async (req, res) => {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
};