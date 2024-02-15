const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, maxLength: 25, required: true },
    description: { type: String, maxLength: 200 }
});

CategorySchema.virtual('url').get(function () {
    return `/inventory/category/${this._id}`;
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
