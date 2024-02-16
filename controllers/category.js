const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');
const mapItemList = require('../mappers/item');
const { body, validationResult } = require('express-validator');
const { mapErrors } = require('../mappers/error');
const { mapCategory } = require('../mappers/category');

exports.list = asyncHandler(async (req, res, next) => {
    const categories = await Category.find({}).sort({ name: 1 }).exec();

    const categoriesArray = categories.map((category) => mapCategory(category));

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

    res.render('detail', {
        title: 'Category',
        item: mapCategory(category),
        list: items.length ? mapItemList(items) : items
    });
});

exports.categoryCreateGet = (req, res, next) => {
    res.render('category_form', {
        title: 'New category'
    });
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
                title: 'New category',
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

exports.categoryUpdateGet = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();
    res.render('category_form', {
        title: 'Update category',
        category
    });
});
exports.categoryUpdatePost = [
    body('name', 'name must not be empty').trim().notEmpty().escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Update category',
                category,
                errors: mapErrors(errors)
            });
        } else {
            const updatedCategory = await Category.findByIdAndUpdate(
                req.params.id,
                category,
                {}
            );
            res.redirect(updatedCategory.url);
        }
    })
];
