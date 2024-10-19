const jwt = require('jsonwebtoken');
const db = require('../models/index');

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ error: 'A token is required for authentication' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'A token is required for authentication' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await db.Users.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.id = decoded.id;
        req.user = user;
    } catch (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Invalid token' });
    }
    return next();
};
