const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');
const Brand = require('../models/brand');

exports.index = asyncHandler(async (req, res, next) => {
    const [numCategories, numItems, numBrands] = await Promise.all([
        Category.countDocuments({}).exec(),
        Item.countDocuments({}).exec(),
        Brand.countDocuments({}).exec()
    ]);

    res.render('index', {
        title: 'Home',
        category_count: numCategories,
        item_count: numItems,
        brand_count: numBrands
    });
});

exports.list = asyncHandler(async (req, res, next) => {
    const items = await Item.find({}, 'name brand price')
        .populate('brand')
        .sort({ name: 1 })
        .exec();
    console.log(items);
    res.render('item_list', {
        title: 'All items',
        items
    });
});
