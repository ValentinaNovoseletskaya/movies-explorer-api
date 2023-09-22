const router = require('express').Router();
const { createUser, login, logout } = require('../controllers/users');
const { signInValidation, signUpValidation } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const { pageNotFoundText } = require('../utils/errorsTexts');

router.post('/signin', signInValidation, login);
router.post('/signup', signUpValidation, createUser);
router.use(auth);
router.get('/signout', logout);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  const err = new NotFoundError(pageNotFoundText);
  next(err);
});

module.exports = router;
