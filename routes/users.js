const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUserInfo, updateUserInfo, logout } = require('../controllers/users');

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
users.post('/singout', logout);

module.exports = users;
