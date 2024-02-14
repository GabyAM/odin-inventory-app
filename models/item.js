const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    number_in_stock: Number,
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' }
});

ItemSchema.virtual('url').get(function () {
    return '/inventory/item/' + this._id;
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
