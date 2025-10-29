const mongoose = require('mongoose');

const bookedSeatSchema = new mongoose.Schema({
    seatId: String,
    seat_row: String,
    seat_number: Number,
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    bookedAt: Date
});

const lockedSeatSchema = new mongoose.Schema({
    seatId: String,
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    expiresAt: { type: Date, index: {expires: 0} },
});

const showtimeSchema = new mongoose.Schema({
    theater: { type: mongoose.Schema.ObjectId, ref: 'theater' },
    ScreenIndex: Number,
    movie: { type: mongoose.Schema.ObjectId, ref: 'Movie' },
    startAt: Date,
    totalSeats: Number,
    bookedSeats: [bookedSeatSchema],
    lockedSeats: [lockedSeatSchema]
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);