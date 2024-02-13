const mongoose = require('mongoose');
const Item = require('./item');
const Schema = mongoose.Schema;

const GraphicsCard = Item.discriminator(
    'GraphicsCard',
    new Schema({
        gpu: String,
        memory_size: Number,
        memory_type: String
    })
);

module.exports = GraphicsCard;
