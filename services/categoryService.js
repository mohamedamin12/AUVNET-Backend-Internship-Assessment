const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const ApiError = require("../utils/apiError");

const {
  buildFilter,
  buildSort,
  buildFields,
  buildKeywordSearch,
} = require("../utils/apiFeatures");

/**
 *  @desc    create a new category
 *  @route   /api/v1/categories
 *  @method  POST
 *  @access  private
 */
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { title, parent } = req.body;

  let level = 1;
  if (parent) {
    const parentCategory = await Category.findById(parent);
    if (!parentCategory) {
      return next(new ApiError("Parent category not found", 404));
    }
    let current = parentCategory;
    while (current && current.parent) {
      level++;
      current = await Category.findById(current.parent);
      if (level >= 3) break;
    }
    if (level >= 3) {
      return next(new ApiError("Cannot add more than 3 levels of nested categories", 400));
    }
  }

  const newCategory = new Category({ title, parent: parent || null });
  await newCategory.save();
  res.status(201).json(newCategory);
});

/**
 *  @desc    get all categories
 *  @route   /api/v1/categories
 *  @method  GET
 *  @access  public
 */
exports.getCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, sort, fields, keyword, ...filters } = req.query;

  // Build query string
  const queryStr = buildFilter(filters);

  // Pagination
  const skip = (page - 1) * limit;

  let mongooseQuery = Category.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit);

  // Sorting
  mongooseQuery = mongooseQuery.sort(buildSort(sort));

  // Field limiting
  mongooseQuery = mongooseQuery.select(buildFields(fields));

  if (keyword) {
    mongooseQuery = mongooseQuery.find(buildKeywordSearch(keyword));
  }

  if (req.query.nested === "true") {
    const allCategories = await Category.find();
    function buildTree(categories, parent = null) {
      return categories
        .filter(cat => String(cat.parent) === String(parent))
        .map(cat => ({
          ...cat.toObject(),
          children: buildTree(categories, cat._id)
        }));
    }
    const tree = buildTree(allCategories, null);
    return res.json({ results: tree.length, data: tree });
  }

  const category = await mongooseQuery;
  res.json({ results: category.length, page, data: category });
});

/**
 *  @desc    get one category
 *  @route   /api/categories
 *  @method  GET
 *  @access  public
 */
exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new ApiError(`No category found for this id ${req.params.id}`, 404));
  res.json(category);
});

/**
 * @desc    update category
 * @route   PUT /api/v1/categories/:id
 * @method  PUT
 * @access  private
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    { title },
    { new: true, runValidators: true }
  );

  if (!category) {
    return next(new ApiError(`No category found for this id ${id}`, 404));
  }

  res.status(200).json({ data: category });
});

/**
 * @desc    delete category
 * @route   DELETE /api/v1/categories/:id
 * @method  DELETE
 * @access  private
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return next(new ApiError(`No category found for this id ${id}`, 404));
  }

  res.status(204).json({ data: null });
});