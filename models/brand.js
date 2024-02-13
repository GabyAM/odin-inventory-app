const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
    name: String,
    foundation_date: Date
});

BrandSchema.virtual('url').get(function () {
    return `/inventory/brand/${this._id}`;
});

const Brand = mongoose.model('Brand', BrandSchema);
module.exports = Brand;
