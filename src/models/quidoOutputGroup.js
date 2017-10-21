'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const OutputGroup = new Schema({
    _id: String,
    caption: String,
    board: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['SINGLE', 'MULTI'],
        default: 'SINGLE',
        required: true
    },
    outputs: { //controlled outputs
        type: [Number],
        required: true
    },
    minValue: { //minimal value of output
        type: Number,
        default: 0,
        required: true
    },
    step: { //step between values
        type: Number,
        default: 1,
        required: true
    },
    Value: { 
        type: Number,
        default: 0,
        required: true
    },
});

OutputGroup.virtual('maxValue').get(function() {
    return (this.minValue + (Math.pow(2, this.outputs.length) - 1) * this.increment);
});

module.exports = mongoose.model('OutputGroup', OutputGroup);