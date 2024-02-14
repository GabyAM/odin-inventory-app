const asyncHandler = require('express-async-handler');
const Category = require('../models/category');

exports.list = asyncHandler(async (req, res, next) => {
    const categories = await Category.find({}, 'name').sort({ name: 1 }).exec();

    res.render('category_list', {
        title: 'All categories',
        categories
    });
});
