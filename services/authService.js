
const bcrypt = require('bcryptjs');

const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const createToken = require('../utils/createToken');

const User = require('../models/User');

//* Helper function to hash password
const hashPassword = async (password) => await bcrypt.hash(password, 10);

/**
 * @desc    signup New User
 * @route  /api/v1/auth/signup
 * @method  POST
 * @access  public
 */
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const hashedPassword = await hashPassword(req.body.password);

  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  // 2- Generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

/**
 * @desc    Login  User
 * @route   /api/v1/auth/login
 * @method  POST
 * @access  public
 */
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Incorrect email or password', 401));
  }
  // 3) generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});