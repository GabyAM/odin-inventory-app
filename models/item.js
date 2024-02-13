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

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
