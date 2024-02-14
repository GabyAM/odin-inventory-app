const asyncHandler = require('express-async-handler');
const Category = require('../models/category');

exports.list = asyncHandler(async (req, res, next) => {
    const categories = await Category.find({}, 'name').sort({ name: 1 }).exec();

    const categoriesArray = categories.map((category) => {
        return {
            _id: category._id,
            name: category.name,
            description: category.description
        };
    });

    console.log(categoriesArray);

    res.render('list', {
        title: 'All categories',
        type: 'category',
        array: categoriesArray
    });
});
