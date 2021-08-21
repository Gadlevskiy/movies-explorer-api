const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUserInfo, updateUserInfo } = require('../controllers/users');

users.get('/me', getCurrentUserInfo);
users.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUserInfo,
);

module.exports = users;
