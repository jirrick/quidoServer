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

    getBinaryValue() {
        const length = this.outs.length;
        const baseValue = (this.value - this.minValue) / this.increment;
        const binary = baseValue.toString(2);
        const padded = '0'.repeat(length) + binary;
        return (padded.slice(-length));
    }
}

module.exports = OutputGroup;