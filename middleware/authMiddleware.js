const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (isAdmin = false) => {
    return async (req, res, next) => {
        const token = req.header('x-auth-token');

        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;

            if (!req.user || !req.user.id) {
                return res.status(401).json({ msg: 'Invalid token, user information missing' });
            }

            const user = await User.findById(req.user.id);
            if (!user || (isAdmin && !user.isAdmin)) {
                return res.status(403).json({ msg: 'Access denied' });
            }

            next();
        } catch (err) {
            console.error('Token error:', err);
            res.status(401).json({ msg: 'Token is not valid' });
        }
    };
};

module.exports = auth;
