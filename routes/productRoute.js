const router = require("express").Router();

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validation/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  checkProductOwnership,
} = require("../services/productService");

const { allowedTo, protect } = require('../middlewares/auth');

const userRoute = require('./userRoute');

router
  .route("/")
  .get(protect, getProducts)
  .post(protect, allowedTo("user"), createProductValidator, createProduct);
router
  .route("/:id")
  .get(getProductValidator, protect, getProduct)
  .put(protect, allowedTo("user", "admin"), updateProductValidator, updateProduct)
  .delete(protect, allowedTo("user", "admin"), deleteProductValidator, deleteProduct);

router.use('/users', userRoute);

module.exports = router;