const movie = require('../models/movie');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const ValidationError = require('../middlewares/errors/ValidationError');
const OwnerError = require('../middlewares/errors/OwnerError');

module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;
  movie.find({ owner: userId }).sort({ createdAt: -1 })
    .then((movies) => res.status(200).send(movies))
    .catch((e) => {
      next(e);
    });
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const { country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN } = req.body;
  movie.create({
    country, director, duration, year, description, image, trailerLink, thumbnail, owner, movieId, nameRU, nameEN,
  })
    .then((data) => res.status(201).send(data))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new ValidationError('Ошибка в параметрах ввода');
        next(err);
      } else {
        next(e);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  const userId = req.user._id;
  movie.findById(_id)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((data) => {
      if (data.owner !== userId) {
        const err = new OwnerError('Нельзя удалить чужую карточку');
        next(err);
        return;
      }
      movie.deleteOne({ _id: _id }).then(() => res.status(200).send({ data }))
        .catch((e) => {
          next(e);
        });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new ValidationError('Ошибка в параметрах ввода');
        next(err);
      } else {
        next(e);
      }
    });
};