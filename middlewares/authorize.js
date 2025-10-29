const jwt = require('jsonwebtoken');

const authorize = (requiredrole) => {
    return (req, res, next) => {
        // checks if user info is present (after authentication)
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (req.user.role !== requiredrole) { // it has role field (admin, theater, customer) middleware compares if they dont match we block access with forbidden
            return res.status(403).json({ message: "access forbidden: insufficient rights" });
        }
        next();
    }
}
module.exports = authorize;