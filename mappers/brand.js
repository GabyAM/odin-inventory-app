exports.mapBrand = function (brand) {
    return {
        _id: brand.id,
        url: brand.url,
        name: brand.name,
        foundation_date_formatted: brand.foundation_date_formatted
    };
};

exports.mapBrandToDisplay = function (brand) {
    return {
        _id: brand._id,
        url: brand.url,
        Name: brand.name,
        'Foundation date': brand.foundation_date_formatted
    };
};
