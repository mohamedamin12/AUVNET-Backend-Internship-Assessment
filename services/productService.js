const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const ApiError = require("../utils/apiError");

const {
  buildFilter,
  buildSort,
  buildFields,
  buildKeywordSearch,
} = require("../utils/apiFeatures");


/**
 * @desc    Get all products
 * @route   GET /api/v1/products
 * @method  GET
 * @access  Public
 */
exports.getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort, fields, keyword, ...filters } = req.query;

  // Build query string
  const queryStr = buildFilter(filters);

  // Pagination
  const skip = (page - 1) * limit;

  let mongooseQuery = Product.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit);

  // Sorting
  mongooseQuery = mongooseQuery.sort(buildSort(sort));

  // Field limiting
  mongooseQuery = mongooseQuery.select(buildFields(fields));

  if (keyword) {
    mongooseQuery = mongooseQuery.find(buildKeywordSearch(keyword));
  }

  const products = await mongooseQuery;
  res.json({ results: products.length, page, data: products });

})

/**
 * @desc    Get single product
 * @route   GET /api/v1/products/:id
 * @method  GET
 * @access  Public
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id)

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

/**
 * @desc    Create new product
 * @route   POST /api/v1/products
 * @method  POST
 * @access  Private
 */
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create({ ...req.body, user: req.user._id });
  res.status(201).json({ data: product });
});

/**
 *  @desc    update product
 *  @route   /api/v1/categories
 *  @method  PUT
 *  @access  private (only admin and manager)
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }

  if (String(product.user) !== String(req.user._id) && req.user.role !== "admin") {
    return next(new ApiError("You are not allowed to update this product", 403));
  }

  const updateProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ message: "Product updated successfully", data: updateProduct });
});

/**
 *  @desc    delete Product
 *  @route   /api/products
 *  @method  DELETE
 *  @access  private (only admin)
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }

  if (String(product.user) !== String(req.user._id) && req.user.role !== "admin") {
    return next(new ApiError("You are not allowed to delete this product", 403));
  }

  await Product.findByIdAndDelete(id);
  res.json({ message: "Product deleted successfully" });
});