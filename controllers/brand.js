const asyncHandler = require('express-async-handler');
const Brand = require('../models/brand');

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
