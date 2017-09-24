'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const LogSchema = new Schema({
    name: String,
    temp: Number,
    inputs: [{
        _id: false,
        name: String,
        value: Number
    }]
});

module.exports = mongoose.model('Logs', LogSchema);