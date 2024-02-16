exports.mapCategory = function (category) {
    return {
        _id: category._id,
        url: category.url,
        name: category.name,
        description: category.description
    };
};

exports.mapCategoryToDisplay = function (category) {
    return {
        _id: category._id,
        url: category.url,
        Name: category.name,
        Description: category.description
    };
};
