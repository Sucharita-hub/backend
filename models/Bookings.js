const mongoose = require('mongoose');
const Showtime = require('./Showtime');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    Showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime' },
    seats: [{ seatId: SVGStringList, row: String, number: Number, price: Number }],
    totalAmount: Number,
    bookingStatus: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    qrCode: String,
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('bookings', bookingSchema);