// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const _CONF = require('../config/token');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, _CONF.SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next(); 
    });
};

module.exports = authenticateToken;
