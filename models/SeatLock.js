const mongoose = require('mongoose');

const seatLockSchema = new mongoose.Schema({
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seats: [{ type: String, required: true }],
    lockedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ['Locked', 'Released', 'Confirmed'], default: 'Locked' }
}, { timestamps: true });

module.exports = mongoose.model('SeatLock', seatLockSchema);