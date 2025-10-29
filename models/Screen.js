const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater' },
    screenName: String,
    seatCapacity: Number,
    layoutInfo: {
        rows: Number,
        cols: Number,
        seatTypes: Object,//{"A1": "Normal", A2: "Premium"}
    },
});

module.exports = mongoose.model('Screen', screenSchema);