'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Board = new Schema({
    _id: String,
    mac: String,
    inputs: Number,
    inputState: String,
    outputs: Number,
    outputState: String,
    counters: [Number]
});

Board.virtual('inputGroups', {
    ref: 'InputGroup', // The model to use
    localField: '_id', // Find groups where `localField`
    foreignField: 'board', // is equal to `foreignField`
    justOne: false
});

Board.virtual('outputGroups', {
    ref: 'OutputGroup', // The model to use
    localField: '_id', // Find groups where `localField`
    foreignField: 'board', // is equal to `foreignField`
    justOne: false
});

module.exports = mongoose.model('Board', Board);