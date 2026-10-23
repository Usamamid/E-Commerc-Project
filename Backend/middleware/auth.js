const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

const ownerOnly = (req, res, next) => {
    requireAuth(req, res, () => {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ success: false, message: "Owner access only" });
        }
        next();
    });
};

module.exports = { requireAuth, ownerOnly };