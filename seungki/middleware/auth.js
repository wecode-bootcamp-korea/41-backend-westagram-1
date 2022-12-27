const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const jwtVerify = jwt.verify(token, process.env.SECRETKEY);

    req.userId = jwtVerify;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Access Token' });
  }
};

module.exports = {
  validateToken,
};
