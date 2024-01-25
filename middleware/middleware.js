const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({
      message: "jwt token is missing",
    });
  }

  const verifiedToken = jwt.verify(authHeader, JWT_SECRET);
  if (!verifiedToken) {
    return res.status(403).json({
      message: "invalid jwt token",
    });
  }
  req.userId = verifiedToken.userId;
  next();
};

module.exports = authMiddleWare;
