const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    number_in_stock: Number,
    brand: String,
    category: { type: Schema.Types.ObjectId, ref: 'category' }
});

ItemSchema.virtual('url').get(function () {
    return '/inventory/item/' + this._id;
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
