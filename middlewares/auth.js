const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader && !authHeader.startsWith("bearer")) {
        return res.status(401).json({ message: "access denied, token is missing" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === "tokenExpiredError") {
                return res.status(401).json({ message: "token expired" });
            }
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    })
    next();
}

module.exports = authenticate;