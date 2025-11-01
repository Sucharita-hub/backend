const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // console.log('Header:', req.headers.authorization);
            // console.log('Received token:', token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log('decoded:', decoded);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'user not found' });
            }
            next();
        } catch (err) {
             console.log('JWT Error:', err.message);
           // console.log(err);
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
    // if (!token) {
    
        res.status(401).json({ message: 'Not authorized, no token' });
    }
    
};

module.exports = { protect };