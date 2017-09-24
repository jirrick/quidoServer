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

            //parse only when base counter is over treshold
            if (cntBase >= this.treshold) {
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

    resetValues(counters){
        // by default do nothing
        let result = Array(counters.length).fill(0);
        if (this.ins.length == 2) { //ANALOG
            //get counter values (convert index from one base to zero base)
            const indexBase = this.ins[0] - 1;
            const indexValue = this.ins[1] - 1;

            const cntBase = counters[indexBase];
            const cntValue = counters[indexValue];

            //reset only when base counter is over treshold
            if (cntBase >= this.treshold) {
                result[indexBase] = cntBase;
                result[indexValue] = cntValue;
            }
        }
        return result;
    }
}

module.exports = InputGroup;
