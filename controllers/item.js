const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');
const Brand = require('../models/brand');
const itemMappers = require('../mappers/item');
const { body, validationResult } = require('express-validator');
const mapErrors = require('../mappers/error');

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
        array: items.map((item) => itemMappers.mapItem(item))
    });
});

exports.itemDetail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id)
        .populate('brand category')
        .exec();

    if (item === null) {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
    }

    res.render('detail', {
        title: 'Item',
        item: itemMappers.mapItemToDisplay(item)
    });
});

exports.itemCreateGet = asyncHandler(async (req, res, next) => {
    const [categories, brands] = await Promise.all([
        Category.find({}, 'name').sort({ name: 1 }).exec(),
        Brand.find({}, 'name').sort({ name: 1 }).exec()
    ]);

    res.render('item_form', {
        title: 'New item',
        action: 'Add',
        categories,
        brands
    });
});

exports.itemCreatePost = [
    body('name', 'name must not be empty').trim().notEmpty().escape(),
    body('brand', 'brand must not be empty').trim().notEmpty().escape(),
    body('category', 'category must not be empty').trim().notEmpty().escape(),
    body('price')
        .notEmpty()
        .withMessage('Price must not be required')
        .isNumeric()
        .withMessage('Price must be numeric'),
    body('number-in-stock')
        .notEmpty()
        .withMessage('Number in stock must not be required')
        .isNumeric()
        .withMessage('Number in stock must be numeric'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const item = new Item({
            name: req.body.name,
            brand: req.body.brand,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body['number-in-stock']
        });

        if (!errors.isEmpty()) {
            const [categories, brands] = await Promise.all([
                Category.find({}, 'name').sort({ name: 1 }).exec(),
                Brand.find({}, 'name').sort({ name: 1 }).exec()
            ]);

            const selectedBrand = brands.find((brand) =>
                brand._id.equals(item.brand)
            );
            selectedBrand.selected = 'true';
            const selectedCategory = categories.find((category) =>
                category._id.equals(item.category)
            );
            selectedCategory.selected = 'true';

            res.render('item_form', {
                categories,
                brands,
                errors: mapErrors(errors),
                item
            });
        } else {
            await item.save();
            res.redirect('/inventory/items');
        }
    })
];

exports.itemUpdateGet = asyncHandler(async (req, res, next) => {
    const [item, brands, categories] = await Promise.all([
        Item.findById(req.params.id).exec(),
        Brand.find().sort({ name: 1 }).exec(),
        Category.find().sort({ name: 1 }).exec()
    ]);

    const selectedBrand = brands.find((brand) => brand._id.equals(item.brand));
    selectedBrand.selected = 'true';
    const selectedCategory = categories.find((category) =>
        category._id.equals(item.category)
    );
    selectedCategory.selected = 'true';

    res.render('item_form', {
        title: 'Update item',
        action: 'Update',
        item,
        brands,
        categories
    });
});

exports.itemUpdatePost = [
    body('name', 'name must not be empty').trim().notEmpty().escape(),
    body('brand', 'brand must not be empty').trim().notEmpty().escape(),
    body('category', 'category must not be empty').trim().notEmpty().escape(),
    body('price')
        .notEmpty()
        .withMessage('Price must not be required')
        .isNumeric()
        .withMessage('Price must be numeric'),
    body('number-in-stock')
        .notEmpty()
        .withMessage('Number in stock must not be required')
        .isNumeric()
        .withMessage('Number in stock must be numeric'),
    body('password')
        .notEmpty()
        .withMessage('Please insert a password')
        .equals(process.env.SECRET_PASSWORD)
        .withMessage('The password is incorrect')
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const item = new Item({
            name: req.body.name,
            brand: req.body.brand,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body['number-in-stock'],
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            const [categories, brands] = await Promise.all([
                Category.find({}, 'name').sort({ name: 1 }).exec(),
                Brand.find({}, 'name').sort({ name: 1 }).exec()
            ]);

            const selectedBrand = brands.find((brand) =>
                brand._id.equals(item.brand)
            );
            selectedBrand.selected = 'true';
            const selectedCategory = categories.find((category) =>
                category._id.equals(item.category)
            );
            selectedCategory.selected = 'true';

            res.render('item_form', {
                title: 'Update item',
                action: 'Update',
                categories,
                brands,
                errors: mapErrors(errors),
                item
            });
        } else {
            const updatedItem = await Item.findByIdAndUpdate(
                req.params.id,
                item,
                {}
            );
            res.redirect(updatedItem.url);
        }
    })
];

exports.itemDeleteGet = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id)
        .populate('brand category')
        .exec();

    if (item === null) {
        res.redirect('/inventory/items');
    }

    res.render('delete', {
        type: 'Item',
        item: itemMappers.mapItemToDisplay(item)
    });
});

exports.itemDeletePost = [
    body('password')
        .notEmpty()
        .withMessage('Please insert a password')
        .equals(process.env.SECRET_PASSWORD)
        .withMessage('The password is incorrect')
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const item = await Item.findById(req.params.id);
            res.render('delete', {
                type: 'Item',
                item: itemMappers.mapItemToDisplay(item),
                errors: mapErrors(errors)
            });
        }
        await Item.findByIdAndDelete(req.params.id);
        res.redirect('/inventory/items');
    })
];
