module.exports = function mapItemList(items) {
    return items.map((item) => {
        return {
            _id: item._id,
            name: item.name,
            brand: {
                name: item.brand.name,
                url: item.brand.url
            },
            price: item.price
        };
    });
};
