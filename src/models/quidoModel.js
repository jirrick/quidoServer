'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const LogSchema = new Schema({
    name: {
        type: String
    },
    temp: {
        type: Number
    },
    counters: {
        type: [Number]
    }
});

module.exports = mongoose.model('Logs', LogSchema);