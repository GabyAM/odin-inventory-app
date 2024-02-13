const mongoose = require('mongoose');
const Item = require('./item');
const Schema = mongoose.Schema;

const Disk = Item.discriminator(
    'Disk',
    new Schema({
        capacity: Number,
        type: String
    })
);

module.exports = Disk;
