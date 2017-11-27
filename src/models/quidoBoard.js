'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    roundTo = require('round-to'),
    logger = require('../logger');

const Board = new Schema(
    {
        _id: String,
        caption: String,
        mac: String,
        inputs: Number,
        inputState: String,
        outputs: Number,
        outputState: String,
        counters: [Number]
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    });

//input Group collection
Board.virtual('inputGroups', {
    ref: 'InputGroup', // The model to use
    localField: '_id', // Find groups where `localField`
    foreignField: 'board', // is equal to `foreignField`
    justOne: false
});

//output Group collction
Board.virtual('outputGroups', {
    ref: 'OutputGroup', // The model to use
    localField: '_id', // Find groups where `localField`
    foreignField: 'board', // is equal to `foreignField`
    justOne: false
});

Board.methods.getResponse = function () {
    //go through all output classes and substitute their output (deafult output = NOP)
    let outputString = 'x'.repeat(this.outputs);
    for (let group of this.outputGroups) {
        //save group output
        const groupOut = group.getBinaryValue();
        let bitCount = 0;
        let indexOne;
        for (indexOne of group.outputs) {
            const indexZero = indexOne - 1;
            //check output bounds and overwriting of result
            if (indexZero >= 0 && indexZero < this.outputs && outputString[indexZero] === 'x') {
                outputString = setCharAt(outputString, indexZero, groupOut[bitCount]);
                bitCount++;
            }
        }
    }

    //go through all counter reset values and create reset string if needed (value bigger than 0)
    let resetString = '';
    for (var i = 0, len = this.resetCounters.length; i < len; i++) {
        if (this.resetCounters[i] > 0) {
            resetString += ` cnt${i + 1}="${this.resetCounters[i]}"`;
            this.resetCounters[i] = 0;
        }
    }

    //build the response
    const result = `<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="${outputString}"${resetString} /></root>`;
    return result;
};

Board.methods.parseInput = function (inputs, counters) {
    //output array of parsed values
    let result = [];

    //go through all input classes
    for (let group of this.inputGroups) {
        //create input object
        const parsedValue = group.parse(inputs, counters);

        //only add value when valid
        if (!Number.isNaN(parsedValue)) {
            const inputObject = {
                name: group._id,
                value: roundTo(parsedValue, 1)
            };
            result.push(inputObject);

            const resetValues = group.resetValues(counters);
            this.resetCounters.forEach(function (item, index, arr) {
                arr[index] = item + resetValues[index];
            });
        }
    }

    return result;
};

Board.methods.saveCurrentState = function (inputs, counters, outputs) {
    //Update current status of board
    this.inputState = inputs;
    this.outputState = outputs;
    this.counters = counters;
    this.save(function (err, data) {
        if (err)
            logger.warn(err);
        logger.silly(data.toString());
    });
};

module.exports = mongoose.model('Board', Board);

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}