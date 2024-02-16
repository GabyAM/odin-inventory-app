const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');
const mapItemList = require('../mappers/item');
const { body, validationResult } = require('express-validator');
const { mapErrors } = require('../mappers/error');

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
    const [category, items] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, 'name brand price')
            .populate('brand')
            .exec()
    ]);

    if (category === null) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }

    const mappedCategory = {
        _id: category._id,
        Name: category.name,
        Description: category.description
    };

    res.render('detail', {
        title: 'Category',
        item: mappedCategory,
        list: items.length ? mapItemList(items) : items
    });
});

exports.categoryCreateGet = (req, res, next) => {
    res.render('category_form');
};

exports.categoryCreatePost = [
    body('name', 'name must not be empty').trim().notEmpty().escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            description: req.body.description
        });

        if (!errors.isEmpty()) {
            res.render('category_form', {
                category,
                errors: mapErrors(errors)
            });
        } else {
            const categoryExists = await Category.findOne({
                name: req.body.name
            })
                .collation({ locale: 'en', strength: 2 })
                .exec();

            if (categoryExists) {
                res.redirect(categoryExists.url);
            } else {
                await category.save();
                res.redirect(category.url);
            }
        }
    })
];
