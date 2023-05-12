const jwt = require('jsonwebtoken');
const Unauthorized = require('../utils/errors/Unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'very-very-very-secret-key');
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};