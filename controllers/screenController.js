const Screen = require('../models/Screen');
const Theater = require('../models/Theater');

exports.addScreen = async (req, res) => {
    const screen = await Screen.create(req.body);
    await screen.save();
    if (screen.theater) {
        await Theater.findByIdAndUpdate(screen.theater, { $push: { screens: screen._id } });
    }
    res.status(201).json(screen);
};

exports.getScreenByTheater = async (req, res) => {
    const screens = await Screen.find({ theater: req.params.theaterId });
    res.json(screens);
}

exports.updateScreen = async (req, res) => {
    const screen = await Screen.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(screen);
}

exports.deleteScreen = async (req, res) => {
    await Screen.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
}