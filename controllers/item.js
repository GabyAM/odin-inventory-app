const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');
const Brand = require('../models/brand');
const mapItemList = require('../mappers/item');

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

    res.render('list', {
        title: 'All items',
        type: 'item',
        array: mapItemList(items)
    });
});

exports.itemDetail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id)
        .populate('brand category')
        .exec();

    const mappedItem = {
        _id: item._id,
        Name: item.name,
        Brand: {
            name: item.brand.name,
            url: item.brand.url
        },
        Category: {
            name: item.category.name,
            url: item.category.url
        },
        Description: item.description,
        Price: item.price,
        'In stock': item.number_in_stock
    };

    res.render('detail', {
        title: 'Item',
        item: mappedItem
    });
});
