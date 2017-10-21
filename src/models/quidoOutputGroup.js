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
    value: {
        type: Number,
        default: 0,
        required: true
    },
});

//Update current value when setting new minValue
OutputGroup.path('minValue')
    .set(function (value) {
        this.value = value;
        return value;
    });

//Calculate maximum value from minValue
OutputGroup.virtual('maxValue').get(function () {
    return (this.minValue + (Math.pow(2, this.outputs.length) - 1) * this.step);
});

OutputGroup.methods.setValue = function (value) {
    let result = '';
    //check value is number
    if (typeof value === 'number') {
        //check value is in bounds
        if (value >= this.minValue && value <= this.maxValue) {
            //check if value can be reached
            if ((value - this.minValue) % this.step == 0) {
                this.value = value;
                result = 'success';
            } else
                result = 'value not reachable';
        } else
            result = 'value out of bounds';
    } else
        result = 'not a number';
    return result;
};

OutputGroup.methods.getBinaryValue = function () {
    const length = this.outputs.length;
    const baseValue = (this.value - this.minValue) / this.step;
    const binary = baseValue.toString(2);
    const padded = '0'.repeat(length) + binary;
    return (padded.slice(-length));
};

module.exports = mongoose.model('OutputGroup', OutputGroup);