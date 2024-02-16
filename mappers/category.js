exports.mapCategory = function (category) {
    return {
        _id: category._id,
        url: category.url,
        name: category.name,
        description: category.description
    };
};
