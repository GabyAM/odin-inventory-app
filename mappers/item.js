module.exports = function mapItemList(items) {
    if (!items[0].brand) {
        return items.map((item) => {
            return {
                _id: item._id,
                name: item.name,
                price: item.price
            };
        });
    }
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
