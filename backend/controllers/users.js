const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const Conflict = require('../utils/errors/Conflict');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFound('Пользователь с данным _id не найден :(');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные :('));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(201).send({ user: userObject });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже зарегистрирован :('));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании пользователя :('));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден.');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при обновлении профиля :('));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден.');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при обновлении аватара :('));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'very-very-very-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};