const router = require("express").Router();

const { allowedTo, protect } = require('../middlewares/auth');

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistService");

router.use(protect, allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete('/:productId', removeProductFromWishlist);

module.exports = router;