const router = require("express").Router();
const categoryController = require("../services/categoryService");

const {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
} = require("../utils/validation/categoryValidator");

const { allowedTo, protect } = require('../middlewares/auth');


router
  .route("/")
  .post(protect, allowedTo("admin"), createCategoryValidator, categoryController.createCategory)
  .get(categoryController.getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, categoryController.getCategoryById)
  .put(protect, allowedTo("admin"), updateCategoryValidator, categoryController.updateCategory)
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, categoryController.deleteCategory);

module.exports = router;