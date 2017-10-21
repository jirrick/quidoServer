'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const QuidoCurrent = new Schema({
    _id: String,
    inputs: String,
    outputs: String,
    raw_counters: [Number],
    values: [{
        _id: false,
        name: String,
        value: Number
    }]
});

module.exports = mongoose.model('QuidoCurrent', QuidoCurrent);