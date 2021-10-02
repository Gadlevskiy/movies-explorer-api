const movies = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

movies.get('/', getMovies);
movies.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .pattern(
          /^(?:http(s)?:\/\/)?(w{3}\.)?[-a-zA-Z0-9._#]{1,}\.[-a-zA-Z0-9]{0,}\/?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{0,}#?$/,
        ),
      trailer: Joi.string()
        .required()
        .pattern(
          /^(?:http(s)?:\/\/)?(w{3}\.)?[-a-zA-Z0-9._#]{1,}\.[-a-zA-Z0-9]{0,}\/?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{0,}#?$/,
        ),
      thumbnail: Joi.string()
        .required()
        .pattern(
          /^(?:http(s)?:\/\/)?(w{3}\.)?[-a-zA-Z0-9._#]{1,}\.[-a-zA-Z0-9]{0,}\/?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{0,}#?$/,
        ),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);
movies.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.number().required(),
    }),
  }),
  deleteMovie,
);

module.exports = movies;
