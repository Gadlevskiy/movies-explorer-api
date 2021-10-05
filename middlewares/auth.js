const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    const error = new Error('Необходима авторизация');
    error.statusCode = 401;
    next(error);
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    const error = new Error('Необходима авторизация');
    error.statusCode = 401;
    next(error);
  }
  req.user = payload;
  next();
};
