const router = require('express').Router();
const { getMoviesValidation, deleteMovieValidation } = require('../middlewares/validation');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', getMoviesValidation, createMovie);
router.delete('/:_id', deleteMovieValidation, deleteMovie);

module.exports = router;
