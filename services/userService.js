const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' });
  res.json({ results: users.length, data: users });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ApiError('User not found', 404));
  }
  res.status(204).json({ message: 'User deleted successfully' });
});