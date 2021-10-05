const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashpassword) => User.create({
      email,
      password: hashpassword,
      name,
    }))
    .then(({ _id }) => {
      res.status(201).send({
        _id,
        email,
        name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new Error('Переданы некорректные данные при создании профиля');
        error.statusCode = 400;
        next(error);
      } else if (err.name === 'MongoError' && err.code === 11000) {
        const error = new Error('указан email, который уже существует на сервере');
        error.statusCode = 409;
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ token: token })
        .end();
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.statusCode = 401;
      next(error);
    });
};

module.exports.logout = (req, res, next) => {
  User.findById(req.user._id)
    .then(() => {
      res.clearCookie('jwt').send({ message: 'cookie cleared' }).end();
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.statusCode = 401;
      next(error);
    });
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  const currentUser = req.user._id;
  User.findOne({ email })
    .then((userData) => {
      if (!userData) {
        User.findByIdAndUpdate(
          currentUser,
          { email, name },
          {
            new: true,
            runValidators: true,
          },
        )
          .then((user) => {
            if (!user) {
              const error = new Error('Пользователь с указанным _id не найден');
              res.send({ message: 'Пользователь с указанным _id не найден' });
              error.statusCode = 404;
              throw error;
            } else {
              res.send({ user: user, message: 'Профиль обновлен' });
            }
          })
          .catch((err) => {
            if (err.name === 'ValidationError' || 'CastError') {
              const error = new Error('Переданы некорректные данные при обновлении профиля');
              res.send({ message: 'Переданы некорректные данные при обновлении профиля' });
              error.statusCode = 400;
              next(error);
            } else {
              next(err);
            }
          });
      } else {
        User.findById(currentUser)
          .then((data) => {
            if (data.email === email) {
              User.findByIdAndUpdate(
                currentUser,
                { email, name },
                {
                  new: true,
                  runValidators: true,
                },
              )
                .then((user) => {
                  if (!user) {
                    const error = new Error('Пользователь с указанным _id не найден');
                    res.send({ message: 'Пользователь с указанным _id не найден' });
                    error.statusCode = 404;
                    throw error;
                  } else {
                    res.send({ user: user, message: 'Профиль обновлен' });
                  }
                })
                .catch((err) => {
                  if (err.name === 'ValidationError' || 'CastError') {
                    const error = new Error('Переданы некорректные данные при обновлении профиля');
                    res.send({ message: 'Переданы некорректные данные при обновлении профиля' });
                    error.statusCode = 400;
                    next(error);
                  } else {
                    next(err);
                  }
                });
            } else {
              const error = new Error('Email занят');
              res.send({ message: 'Email занят' });
              error.statusCode = 409;
              next(error);
            }
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};
