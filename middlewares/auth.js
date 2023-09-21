const jwt = require('jsonwebtoken');
const AuthorizationError = require('./errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    const err = new AuthorizationError('Необходима авторизация');
    next(err);
    return;
  }

  let payload;

  try {
    const { NODE_ENV, JWT_SECRET } = process.env;
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    const err = new AuthorizationError('Необходима авторизация');
    next(err);
    return;
  }

  req.user = payload;

  next();
};
