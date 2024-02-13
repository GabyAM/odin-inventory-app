const mongoose = require('mongoose');
const Item = require('./item');
const Schema = mongoose.Schema;

const Ram = Item.discriminator(
    'Ram',
    new Schema({
        capacity: Number,
        type: String,
        speed: Number
    })
);

module.exports = Ram;
