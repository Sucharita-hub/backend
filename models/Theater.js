const mongoose = require('mongoose');

const TheaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: String
});

module.exports = mongoose.model('Theater', TheaterSchema);