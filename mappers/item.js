exports.mapItem = function (item) {
    if (!item.brand) {
        return {
            _id: item._id,
            name: item.name,
            price: item.price,
            url: item.url
        };
    }
    return {
        _id: item._id,
        name: item.name,
        brand: {
            name: item.brand.name,
            url: item.brand.url
        },
        price: item.price,
        url: item.url
    };
};

exports.mapItemToDisplay = function (item) {
    return {
        _id: item._id,
        url: item.url,
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
};
