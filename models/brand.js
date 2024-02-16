const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const BrandSchema = new Schema({
    name: { type: String, maxLength: 50, required: true },
    foundation_date: Date
});

BrandSchema.virtual('url').get(function () {
    return `/inventory/brand/${this._id}`;
});

BrandSchema.virtual('foundation_date_formatted').get(function () {
    return DateTime.fromJSDate(this.foundation_date).toLocaleString(
        DateTime.DATE_MED
    );
});

BrandSchema.virtual('foundation_date_yyyy_mm_dd').get(function () {
    return DateTime.fromJSDate(this.foundation_date).toISODate();
});

const Brand = mongoose.model('Brand', BrandSchema);
module.exports = Brand;
