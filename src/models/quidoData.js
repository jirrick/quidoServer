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

module.exports = mongoose.model('QuidoData', QuidoData);