const jwt = require ("jsonwebtoken");

const validateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.secretKey);
        req.userId = decoded.userId;
        next();
    } catch(err) {
        next(err);
    }
}


module.exports = { validateToken };