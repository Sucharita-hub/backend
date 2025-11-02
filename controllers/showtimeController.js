const Showtime = require('../models/Showtime');

exports.addshowtime = async (req, res) => {
    const showtime = await Showtime.create(req.body);
    await showtime.save();
    res.status(201).json(showtime);
};

exports.getShowtimeByMovie = async (req, res) => {
    try {
    const showtimes = await Showtime.find({ movie: req.params.movieId })
        .populate('theater', 'name location')
        .populate('movie', 'title');
    res.json(showtimes);
} catch (err) {
        console.log("Error fetching showtimes by movie:", err.message);
        res.status(500).json({ message: 'Server Error' });
}
};

exports.getShowtimeByTheater = async (req, res) => {
    const showtimes = await Showtime.find({ theater: req.params.theaterId }).populate('theater').populate('movie');
    res.json(showtimes);
};

exports.updateShowtime = async (req, res) => {
    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(showtime);
};

exports.deleteShowtime = async (req, res) => {
     await Showtime.findByIdAndDelete(req.params.id);
    res.json({message: 'Deleted'});
};
