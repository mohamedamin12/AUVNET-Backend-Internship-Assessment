const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "category title is required"],
    unique: [true, 'Category must be unique'],
    trim: true,
    minlength: [3, 'Too short category name'],
    maxlength: [32, 'Too long category name'],
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  }
})

module.exports = mongoose.model('Category', categoriesSchema);