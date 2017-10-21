'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const DataLog = new Schema({
    name: String,
    inputs: [{
        _id: false,
        name: String,
        value: Number
    }]
}, {
    versionKey: false
});

module.exports = mongoose.model('DataLog', DataLog);