'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    name: {
        type: String
    },
    mac: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    temp: {
        type: Number
    }
});

module.exports = mongoose.model('Logs', LogSchema);