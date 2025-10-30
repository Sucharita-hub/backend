const jwt = require('jsonwebtoken');

module.exports = (user) => {
    return jwt.sign({ id: user._id },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};