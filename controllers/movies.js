const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new Error('Переданы некорректные данные при создании карточки');
        error.statusCode = 404;
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const currentUser = req.user._id;
  Movie.findById(req.params.movieId, {
    // если id не найден приходит в ответ пустой обьект (data: null), этот обьект не падает в catch
    upsert: false,
  })
    .then((movie) => {
      if (!movie) {
        const error = new Error('Фильм с указанным id не найден');
        error.statusCode = 404;
        throw error; // проверяю на пустой обьект, и если null отправляю ошибку 404
      } else if (movie.owner._id.toString() !== currentUser) {
        const error = new Error('Фильм с указанным id не принадлежит вам');
        error.statusCode = 403;
        throw error;
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => {
            res.send({ message: 'Пост удален' });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // CastError ошибка неправильной длины id
        const error = new Error('Переданы некорректные данные');
        error.statusCode = 400;
        next(error);
      } else {
        next(err);
      }
    });
};
