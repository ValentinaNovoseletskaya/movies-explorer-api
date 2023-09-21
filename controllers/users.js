const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const ValidationError = require('../middlewares/errors/ValidationError');
const DuplicateError = require('../middlewares/errors/DuplicateError');
const { validationErrorText, duplicateErrorText, userNotFoundText } = require('../utils/errorsTexts');

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  return user.findById(userId)
    .orFail(new NotFoundError(userNotFoundText))
    .then((data) => {
      const {
        name, id, email,
      } = data;
      res.status(200).send(
        {
          name, _id: id, email,
        },
      );
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new ValidationError(validationErrorText);
        next(err);
      } else {
        next(e);
      }
    });
};

module.exports.getLoggedUser = (req, res, next) => {
  const userId = req.user._id;
  return user.findById(userId)
    .orFail(new NotFoundError(userNotFoundText))
    .then((data) => {
      const {
        name, id, email,
      } = data;
      res.status(200).send(
        {
          name, _id: id, email,
        },
      );
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new ValidationError(validationErrorText);
        next(err);
      } else {
        next(e);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const reqPassword = req.body.password;
  bcrypt.hash(reqPassword, 10)
    .then((hash) => user.create({ ...req.body, password: hash })
      .then((data) => {
        const {
          name, id, email,
        } = data;
        return res.status(201).send({
          name, _id: id, email,
        });
      })
      .catch((e) => {
        if (e.code === 11000) {
          const err = new DuplicateError(duplicateErrorText);
          next(err);
        } else if (e.name === 'ValidationError') {
          const err = new ValidationError(validationErrorText);
          next(err);
        } else {
          next(e);
        }
      }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((users) => {
      const payload = {
        _id: users._id,
      };
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        payload,
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      return res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }).status(200).json({ token });
    })
    .catch(next);
};

module.exports.logout = (req, res) => res.cookie('token', '', { httpOnly: true, maxAge: '-1' }).status(200).json('Успешный выход');

module.exports.editUser = (req, res, next) => {
  const userId = req.user._id;
  const { name } = req.body;
  return user.findByIdAndUpdate(userId, { name }, { runValidators: true, new: true })
    .orFail(new NotFoundError(userNotFoundText))
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new ValidationError(validationErrorText);
        next(err);
      } else if (e.name === 'CastError') {
        const err = new ValidationError(validationErrorText);
        next(err);
      } else {
        next(e);
      }
    });
};
