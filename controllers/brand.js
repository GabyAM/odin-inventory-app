const asyncHandler = require('express-async-handler');
const Brand = require('../models/brand');
const Item = require('../models/item');
const mapItemList = require('../mappers/item');

exports.list = asyncHandler(async (req, res, next) => {
    const brands = await Brand.find({}, 'name foundation_date')
        .sort({ name: 1 })
        .exec();

    const brandsArray = brands.map((brand) => {
        return {
            _id: brand.id,
            name: brand.name,
            foundation_date_formatted: brand.foundation_date_formatted
        };
    });

    res.render('list', {
        title: 'All brands',
        type: 'brand',
        array: brandsArray
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

    const mappedBrand = {
        _id: brand._id,
        Name: brand.name,
        'Foundation date': brand.foundation_date
    };

    res.render('detail', {
        title: 'Brand',
        item: mappedBrand,
        list: items.length ? mapItemList(items) : items
    });
});
