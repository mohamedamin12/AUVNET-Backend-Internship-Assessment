const router = require('express').Router();
const {
  signupValidator,
  loginValidator,
} = require('../utils/validation/authValidator');

const {
  signup,
  login
} = require('../services/authService');


router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);


module.exports = router;