'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Parser = require('expr-eval').Parser;

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
    expression: { //how to calculate value (for analog only), must contain reference to Nref and Ncount
        type: String,
        required: false
    }
});

InputGroup.methods.parse = function (inputs, counters) {
    let result = Number.NaN;

    if (this.category === 'BINARY') {
        // just parse state of defined input (convert index from one base to zero base)
        const bitNumber = this.inputValue - 1;
        result = parseInt(inputs[bitNumber]);
    }
    else if (this.category === 'COUNTER') {
        // just parse state of defined counter (convert index from one base to zero base)
        const bitNumber = this.inputValue - 1;
        result = parseInt(counters[bitNumber]);
    }
    else if (this.category === 'ANALOG') { 
        //get counter values (convert index from one base to zero base)
        const cntBase = counters[this.inputBase - 1];
        const cntValue = counters[this.inputValue - 1];

        //parse only when base counter is over treshold
        if (cntBase >= this.treshold) {
            const parser = new Parser();
            //load expression
            const expr = parser.parse(this.expression);
            //do the calculation (Nref and Ncount are reserved parameters)
            result = expr.evaluate({ Nref: cntBase, Ncount: cntValue});
        }
    }
    return result;
};

InputGroup.methods.resetValues = function(counters){
    // by default do nothing
    let result = Array(counters.length).fill(0);
    if (this.category === 'ANALOG') {
        //get counter values (convert index from one base to zero base)
        const indexBase = this.inputBase - 1;
        const indexValue = this.inputValue - 1;

        const cntBase = counters[indexBase];
        const cntValue = counters[indexValue];

        //reset only when base counter is over treshold
        if (cntBase >= this.treshold) {
            result[indexBase] = cntBase;
            result[indexValue] = cntValue;
        }
    }
    return result;
};

module.exports = mongoose.model('InputGroup', InputGroup);