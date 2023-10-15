const jwt = require('jsonwebtoken');
const AuthorizationError = require('./errors/AuthorizationError');
const { authorizationErrorText } = require('../utils/errorsTexts');
const config = require('../utils/config');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    const err = new AuthorizationError(authorizationErrorText);
    next(err);
    return;
  }

  let payload;

  try {
    const { NODE_ENV, JWT_SECRET } = process.env;
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : config.JWT_SECRET);
  } catch (e) {
    const err = new AuthorizationError(authorizationErrorText);
    next(err);
    return;
  }

  req.user = payload;

  next();
};
