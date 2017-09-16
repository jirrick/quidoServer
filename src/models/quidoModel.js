'use strict';
const mongoose = require('mongoose'),
    shortid = require('shortid'),
    Schema = mongoose.Schema;

const LogSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    name: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    temp: {
        type: Number
    },
    counters: {
        type: [Number]
    }
});

module.exports = mongoose.model('Logs', LogSchema);