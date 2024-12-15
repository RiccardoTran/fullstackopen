// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = authorization.substring(7);
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if (!decodedToken.id) {
                return res.status(401).json({ error: 'token invalid' });
            }
            req.user = await User.findById(decodedToken.id);
            next();
        } catch (error) {
            return res.status(401).json({ error: 'token invalid' });
        }
    } else {
        return res.status(401).json({ error: 'token missing' });
    }
};

module.exports = authMiddleware;