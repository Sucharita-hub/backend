const Theater = require('../models/Theater');
const Screen = require('../models/Screen');

exports.addTheater = async (req, res) => {
   const theater = new Theater(req.body);
       await theater.save();
       res.status(201).json(theater);
};

exports.addScreenToTheater = async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        const newScreen = await Screen.create(req.body);
        theater.screens.push(newScreen._id);
        await theater.save();
        
        res.status(200).json({ message: 'Screen added successfully', theater });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getAllTheaters = async (req, res) => {
    try {
        const theater = await Theater.find().populate('screens');
        res.status(200).json(theater);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.getTheaterById = async (req, res) => {
    const theater = await Theater.findById(req.params.id);
    if (!theater) {
        return res.status(404).json({ message: 'theater not found' });
    }
    res.json(theater);
};

exports.updateTheater = async (req, res) => {
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(theater);
};

exports.deleteTheater = async (req, res) => {
    const t = await Theater.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
};