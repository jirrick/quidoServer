'use strict';
const mongoose = require('mongoose'),
    logger = require('../logger'),
    OutputGroup = require('./quidoOutputGroup'),
    Schema = mongoose.Schema;

const Trigger = new Schema({
    _id: String,
    caption: String,
    triggerType: {
        type: String,
        enum: ['UNDER', 'OVER', 'IN_RANGE', 'NOT_IN_RANGE'],
        default: 'IN_RANGE',
        required: true
    },
    inputs: { //inputs to watch
        type: [String],
        required: true
    },
    output: { //output to be switched
        type: String,
        required: false
    },
    treshold: { //switching value 
        type: Number,
        required: true
    },
    hysteresis: { //optional hysteresis for treshold value
        type: Number,
        default: 0,
        required: true
    },
    triggered: { //list of inputs that keep the trigger active
        type: [String]
    },
});

Trigger.methods.handle = function (parsedInput) {//parsedInput is output of Board.parseInput() method

    const watchlist = this.triggered;

    //go through all values thet were parsed
    for (let input of parsedInput) {
        /* if (this.triggerType === 'UNDER') {  
        }
        else if (this.triggerType === 'OVER') {
        }
        else if (this.triggerType === 'IN_RANGE') {
        }
        else if (this.triggerType === 'NOT_IN_RANGE') {
        } */
        const x = input;
        //do stuff :)
    }

    OutputGroup.findById(this.output, function (err, group) {
        //set output to max when there are some inputs trigerring, set to min otherwise
        if (watchlist.length > 0) {
            group.value = group.maxValue;
        } else {
            group.value = group.minValue;
        }
    });

};

///Static method that iterates over all available trigger handlers
Trigger.statics.processTriggers = function (input) {
    this.find({})
        .then(function (data) {
            for (let trigger of data) {
                trigger.handle(input);
            }
        })
        .catch(function (err) {
            logger.warn(err);
        });
};

module.exports = mongoose.model('Trigger', Trigger);