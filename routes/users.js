const router = require('express').Router();
const { getUserIdValidation, patchUserValidation } = require('../middlewares/validation');
const {
  getUserById,
  editUser,
  getLoggedUser,
} = require('../controllers/users');

router.get('/me', getLoggedUser);
router.get('/:userId', getUserIdValidation, getUserById);
router.patch('/me', patchUserValidation, editUser);

module.exports = router;
