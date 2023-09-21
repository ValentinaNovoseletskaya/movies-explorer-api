const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserById,
  editUser,
  getLoggedUser,
} = require('../controllers/users');

router.get('/me', getLoggedUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex(),
    }),
  }),
  getUserById,
);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }),
}), editUser);

module.exports = router;
