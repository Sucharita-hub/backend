const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Booking = require("../models/Booking");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    try {
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'user exists' });
        }
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
        res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).populate('bookings');
    res.json(user);
};

exports.updateUserProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    console.log('Body:', req.body);
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) user.password = req.body.password;
    await user.save();
    res.json({ message: 'Profile updated' }); 
};

exports.getUserBookings = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({ path: 'bookings', populate: ['movie', 'showtime'] });
    res.json(user.bookings || []);
};


//destructuring in js :- unpacking the values of different variable