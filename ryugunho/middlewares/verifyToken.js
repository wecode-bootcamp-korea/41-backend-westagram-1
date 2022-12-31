require("dotenv").config();

const jwt = require ("jsonwebtoken");

const validateToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "token does not exist!!!" });
    }
    
    const decoded = jwt.verify(token, process.env.secretKey);

    if (!decoded) {
        return res.status(401).json({ message: "invalid token!!!" });    
    }

    req.userId = decoded.userId;
    next();
}

module.exports = validateToken;