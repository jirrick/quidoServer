class OutputGroup {
    constructor(data = {}) {
        Object.assign(this, data);

        this.maxValue = data.minValue + (Math.pow(2, data.outs.length) - 1) * data.increment;
        this.value = data.minValue;
    }

    setValue(value) {
        let result = '';
        //check value is number
        if (typeof value === 'number') {
            //check value is in bounds
            if (value >= this.minValue && value <= this.maxValue) {
                //check if value can be reached
                if ((value - this.minValue) % this.increment == 0) {
                    this.value = value;
                    result = 'success';
                } else
                    result = 'value not reachable';
            } else
                result = 'value out of bounds';
        } else
            result = 'not a number';
        return result;
    }

    getValue() {
        const length = this.outs.length;
        const baseValue = (this.value - this.minValue) / this.increment;
        const binary = baseValue.toString(2);
        const padded = '0'.repeat(length) + binary;
        return (padded.slice(-length));
    }
}

class InputGroup {
    constructor(data = {}) {
        Object.assign(this, data);
    }

    parse(inputs, counters) {
        let result = -1;
        if (this.ins.length == 2) { //ANALOG
            //get counter values (convert index from one base to zero base)
            const cntBase = counters[this.ins[0] - 1];
            const cntValue = counters[this.ins[1] - 1];

            //parse only when counters are over treshold
            if (cntBase > this.treshold || cntValue > this.treshold) {
                result = this.multiplier * ((cntValue / cntBase) - 1);
            }
        }
        else if (this.ins.length == 1) { //BIT
            // just parse state of first (only) defined input (convert index from one base to zero base)
            const bitNumber = this.ins[0] - 1;
            result = parseInt(inputs[bitNumber]);
        }
        return result;
    }


}

class Board {
    constructor(data = {}) {
        //parse data from config
        Object.assign(this, data);

        let group;
        //create outClasses
        let outClass = [];
        for (group of data.output_groups) {
            outClass.push(new OutputGroup(group));
        }
        this.outputClasses = outClass;

        //create inClasses
        let inClass = [];
        for (group of data.input_groups) {
            inClass.push(new InputGroup(group));
        }
        this.inputClasses = inClass;
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

    getOutput() {
        //deafult output - NOP
        let result = 'x'.repeat(this.outputs);

        //go through all output classes and substitute their output
        let group;
        for (group of this.outputClasses) {
            //save group output
            const groupOut = group.getValue();
            let bitCount = 0;
            let indexOne;
            for (indexOne of group.outs) {
                const indexZero = --indexOne;
                //check output bounds and overwriting of result
                if (indexZero >= 0 && indexZero < this.outputs && result[indexZero] === 'x') {
                    result = setCharAt(result, indexZero, groupOut[bitCount]);
                    bitCount++;
                }
            }
        }
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
        let group;
        for (group of this.inputClasses) {
            //create input object
            const parsedValue = group.parse(inputs, counters);

            //only add value when valid (larger than zero)
            if (parsedValue >= 0) {
                const inputObject = {
                    name: group.name,
                    value: parsedValue
                };
                result.push(inputObject);
            }
        }
        return result;
    }
}

module.exports = {
    OutputGroup: OutputGroup,
    InputGroup: InputGroup,
    Board: Board
};

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}