const router = require('express').Router();
const { protect, allowedTo } = require('../middlewares/auth');
const { getAllUsers, deleteUser } = require('../services/userService');

router.get('/', protect, allowedTo('admin'), getAllUsers);
router.delete('/:id', protect, allowedTo('admin'), deleteUser);

module.exports = router;
