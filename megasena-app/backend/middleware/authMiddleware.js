const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'bolao-mega-secret';

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.sendStatus(401);
    }

    const [, token] = authHeader.split(' ');

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.sendStatus(401);
    }
};
