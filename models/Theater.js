const mongoose = require('mongoose');

const TheaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    totalSeats: Number,
    isActive: {type: Boolean, default: true},
    screens: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Screen'
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Theater', TheaterSchema);