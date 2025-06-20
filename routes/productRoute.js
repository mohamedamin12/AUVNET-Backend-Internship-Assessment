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
} = require("../services/productService");

const { allowedTo, protect } = require('../middlewares/auth');




router
  .route("/")
  .get(getProducts)
  .post(protect, allowedTo("admin") , createProductValidator, createProduct);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(protect, allowedTo("admin"), updateProductValidator, updateProduct)
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;