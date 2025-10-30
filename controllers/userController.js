const jwt = require("jsonwebtoken");
const User = require("../models/User");
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

