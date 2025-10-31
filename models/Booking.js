const mongoose = require('mongoose');
const Showtime = require('./Showtime');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie',required: true },
    Showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true},
    seats: [String],
    totalAmount: Number,
    bookingStatus: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    qrCode: String,
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);