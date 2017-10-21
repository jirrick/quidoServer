'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const InputGroup = new Schema({
    _id: String,
    caption: String,
    board: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['BINARY', 'ANALOG', 'COUNTER'],
        default: 'BINARY',
        required: true
    },
    inputValue: { //input number containing actual value
        type: Number,
        required: true
    },
    inputBase: { //input number providing base count (for analog only)
        type: Number,
        required: false
    },
    treshold: { //reset counters after this value (for analog only)
        type: Number,
        required: false
    },
    expression: { //how to calculate value (for analog only)
        type: String,
        required: false
    },
    parameters: { //used in expression (for analog only)
        required: false,
        type: [{ 
            _id: false,
            name: String,
            value: Number
        }]
    }
});

module.exports = mongoose.model('InputGroup', InputGroup);