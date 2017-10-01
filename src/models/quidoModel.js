'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const QuidoData = new Schema({
    name: String,
    inputs: [{
        _id: false,
        name: String,
        value: Number
    }]
}, {
    versionKey: false
});

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

exports.QuidoData = mongoose.model('QuidoData', QuidoData);
exports.QuidoCurrent = mongoose.model('QuidoCurrent', QuidoCurrent);