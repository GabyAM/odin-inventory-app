const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');
const mapItemList = require('../mappers/item');

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

exports.categoryDetail = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();

    const mappedCategory = {
        _id: category._id,
        Name: category.name,
        Description: category.description
    };

    res.render('detail', {
        title: 'Category',
        item: mappedCategory,
    });
});
