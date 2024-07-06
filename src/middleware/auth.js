const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.status(401).json({
      message: "not authorized",
      statusCode: 401,
    });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(401).json({
        message: "not authorized",
        statusCode: 401,
      });
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
