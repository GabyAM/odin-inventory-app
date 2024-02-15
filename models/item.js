const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: { type: String, maxLength: 50, required: true },
    description: { type: String, maxLength: 200 },
    price: { type: Number, min: 0 },
    number_in_stock: { type: Number, min: 0, required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
});

ItemSchema.virtual('url').get(function () {
    return '/inventory/item/' + this._id;
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
