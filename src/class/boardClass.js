const roundTo = require('round-to'),
    server = require('../server'),
    quidoBoard = require('../models/quidoBoard'),
    OutputGroup = require('./outputGroup'),
    InputGroup = require('./inputGroup');

class Board {
    constructor(data = {}) {
        //parse data from config
        Object.assign(this, data);

        //create outClasses
        let outClass = [];
        for (let group of data.output_groups) {
            outClass.push(new OutputGroup(group));
        }
        this.outputClasses = outClass;

        //create inClasses
        let inClass = [];
        for (let group of data.input_groups) {
            inClass.push(new InputGroup(group));
        }
        this.inputClasses = inClass;

        //array containing values to be subtracted from board counters
        this.resetCounters = Array(this.inputs).fill(0);
    }

    setOutput(name, value) {
        let result = '';
        // check that output classes are initialized and contains requested output group
        if (this.outputClasses != null) {
            const outGroup = this.outputClasses.find(group => group.name === name);
            if (outGroup != null) {
                // return the result
                result = outGroup.setValue(value);
            }
            else {
                result = 'group not found';
            }
        }
        else {
            result = 'not initialized';
        }
        return result;
    }

    getResponse() {
        //go through all output classes and substitute their output (deafult output = NOP)
        let outputString = 'x'.repeat(this.outputs);
        for (let group of this.outputClasses) {
            //save group output
            const groupOut = group.getBinaryValue();
            let bitCount = 0;
            let indexOne;
            for (indexOne of group.outs) {
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
            if (this.resetCounters[i] > 0){
                resetString += ` cnt${i+1}="${this.resetCounters[i]}"`;
                this.resetCounters[i] = 0;
            }
        }

        //build the response
        const result = `<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="${outputString}"${resetString} /></root>`;
        return result;
    }

    getValue(name) {
        //deafult output -1
        let result = -1;

        // check that output classes are initialized and contains requested group
        if (this.outputClasses != null) {
            const outGroup = this.outputClasses.find(group => group.name === name);
            if (outGroup != null) {
                // return the result
                result = outGroup.value;
            }
        }
        return result;
    }

    parseInput(inputs, counters) {
        //output array of parsed values
        let result = [];

        //go through all input classes
        for (let group of this.inputClasses) {
            //create input object
            const parsedValue = group.parse(inputs, counters);

            //only add value when valid (larger than zero)
            if (parsedValue >= 0) {
                const inputObject = {
                    name: group.name,
                    value: roundTo(parsedValue, 1)
                };
                result.push(inputObject);

                const resetValues = group.resetValues(counters);
                this.resetCounters.forEach(function(item, index, arr) {
                    arr[index] = item + resetValues[index];
                });
            }
        }
        return result;
    }

    saveCurrentState(inputs, counters, outputs){
        //Update current status of board
        quidoBoard.findByIdAndUpdate(this.name, {
            inputState: inputs,
            outputState: outputs,
            counters: counters
        }, { new: true, upsert: true }, function (err, data) {
            if (err)
                server.logger.warn(err);
            server.logger.debug(data.toString());
        });
    }
}

module.exports = Board;

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}