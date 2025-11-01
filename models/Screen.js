const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater' },
    screenName: String,
    seatCapacity: Number,
    layoutInfo: {
        rows: Number,
        cols: Number,
        screenType: String,
        seatTypes: { type: Map, of: String }//{"A1": "Normal", A2: "Premium"}
    },
    theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater'
    }
});

module.exports = mongoose.model('Screen', screenSchema);