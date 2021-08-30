const index = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const users = require('./users');
const movies = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');

index.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
index.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(3).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);
index.use(auth);
index.use('/users', users);
index.use('/movies', movies);
index.use('/', (req, res, next) => {
  const error = new Error('Запрашиваемый ресурс не найден');
  error.statusCode = 404;
  next(error);
});
module.exports = index;
