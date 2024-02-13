const mongoose = require('mongoose');
const Item = require('./item');
const Schema = mongoose.Schema;

const Processor = Item.discriminator(
    'Processor',
    new Schema({
        cores: Number,
        threads: Number,
        clock_speed: Number
    })
);

module.exports = Processor;
