const jwt = require('jsonwebtoken');
const Unauthorized = require('../utils/errors/Unauthorized');
const crypto = require('crypto');
const randomString = crypto
  .randomBytes(16)
  .toString('hex');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, randomString);
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};

module.exports = { randomString };
