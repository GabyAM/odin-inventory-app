const asyncHandler = require('express-async-handler');
const Brand = require('../models/brand');
const Item = require('../models/item');
const itemMappers = require('../mappers/item');
const brandMappers = require('../mappers/brand');
const { body, validationResult } = require('express-validator');
const mapErrors = require('../mappers/error');

exports.list = asyncHandler(async (req, res, next) => {
    const brands = await Brand.find({}, 'name foundation_date')
        .sort({ name: 1 })
        .exec();

    res.render('list', {
        title: 'All brands',
        type: 'brand',
        array: brands.map((brand) => brandMappers.mapBrand(brand))
    });
});

exports.brandDetail = asyncHandler(async (req, res, next) => {
    const [brand, items] = await Promise.all([
        Brand.findById(req.params.id).exec(),
        Item.find({ brand: req.params.id }, 'name price').exec()
    ]);

    if (brand === null) {
        const err = new Error('Brand not found');
        err.status = 404;
        return next(err);
    }

    res.render('detail', {
        title: 'Brand',
        item: brandMappers.mapBrandToDisplay(brand),
        list: items.length
            ? items.map((item) => itemMappers.mapItem(item))
            : items
    });
});

exports.brandCreateGet = (req, res, next) => {
    res.render('brand_form', {
        title: 'New brand',
        action: 'Add'
    });
};

exports.brandCreatePost = [
    body('name', 'name must not be empty').trim().notEmpty().escape(),
    body('foundation-date').optional({ values: 'falsy' }).isISO8601().toDate(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const brand = new Brand({
            name: req.body.name,
            foundation_date: req.body['foundation-date']
        });

        if (!errors.isEmpty()) {
            res.render('brand_form', {
                brand,
                errors: mapErrors(errors)
            });
        } else {
            const brandExists = await Brand.findOne({
                name: req.body.name
            })
                .collation({ locale: 'en', strength: 2 })
                .exec();

            if (brandExists) {
                res.redirect(brandExists.url);
            } else {
                await brand.save();
                res.redirect(brand.url);
            }
        }
    })
];

exports.brandUpdateGet = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id).exec();
    res.render('brand_form', {
        title: 'Update brand',
        action: 'Update',
        brand
    });
});

exports.brandUpdatePost = [
    body('name', 'name must not be empty').trim().notEmpty().escape(),
    body('foundation-date').optional({ values: 'falsy' }).isISO8601().toDate(),
    body('password')
        .notEmpty()
        .withMessage('Please insert a password')
        .equals('1234')
        .withMessage('The password is incorrect'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const brand = new Brand({
            name: req.body.name,
            foundation_date: req.body['foundation-date'],
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            res.render('brand_form', {
                title: 'Update brand',
                action: 'Update',
                brand,
                errors: mapErrors(errors)
            });
        } else {
            const brandExists = await Brand.findOne({
                name: req.body.name,
                _id: { $ne: req.params.id }
            })
                .collation({ locale: 'en', strength: 2 })
                .exec();

            if (brandExists) {
                res.render('brand_form', {
                    title: 'Update brand',
                    action: 'Update',
                    brand,
                    errors: {
                        name: [
                            `The name '${req.body.name}' already exists in a brand`
                        ]
                    }
                });
            } else {
                const updatedBrand = await Brand.findByIdAndUpdate(
                    req.params.id,
                    brand,
                    {}
                );
                res.redirect(updatedBrand.url);
            }
        }
    })
];

exports.brandDeleteGet = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);

    if (brand === null) {
        res.redirect('/inventory/brands');
    }

    res.render('delete', {
        type: 'Brand',
        item: brandMappers.mapBrandToDisplay(brand)
    });
});

exports.brandDeletePost = [
    body('password')
        .notEmpty()
        .withMessage('Please insert a password')
        .equals('1234')
        .withMessage('The password is incorrect'),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const [brand, brandItems] = await Promise.all([
            Brand.findById(req.params.id).exec(),
            Item.find({ brand: req.params.id }).sort({ name: 1 }).exec()
        ]);

        if (brandItems.length > 0) {
            res.render('delete', {
                type: 'Brand',
                item: brandMappers.mapBrandToDisplay(brand),
                items: brandItems
            });
        } else if (!errors.isEmpty()) {
            res.render('delete', {
                type: 'Brand',
                item: brandMappers.mapBrandToDisplay(brand),
                errors: mapErrors(errors)
            });
        } else {
            await Brand.findByIdAndDelete(req.params.id);
            res.redirect('/inventory/brands');
        }
    })
];
