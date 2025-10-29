const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    genre: [String],
    duration: Number,//minutes
    language: String,
    release_date: Date,
    trailer_url: String,
    isActive: { type: Boolean, default: true },
    avgRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);