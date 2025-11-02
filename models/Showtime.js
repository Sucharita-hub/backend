const mongoose = require('mongoose');

const bookedSeatSchema = new mongoose.Schema({
    seatId: String,
    seat_row: String,
    seat_number: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bookedAt: { type: Date, default: Date.now }
});

const lockedSeatSchema = new mongoose.Schema({
    seatId: String,
    seat_row: String,
    seat_number: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expiresAt: Date
});

const showtimeSchema = new mongoose.Schema({
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater' , required: true},
    ScreenIndex: Number,
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    startAt: Date,
    totalSeats: Number,
    bookedSeats: [bookedSeatSchema],
    lockedSeats: [lockedSeatSchema]
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);