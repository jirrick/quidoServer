class OutputGroup {
    constructor(name, outs, minValue, increment) {
        this._name = name;
        this._outs = outs;
        this._minValue = minValue;
        this._increment = increment;
        this._maxValue = minValue + (Math.pow(2, outs.length) - 1) * increment;
        this._value = minValue;
    }

    setValue(value) {
        let result = '';
        //check value is number
        if (typeof value === 'number') {
            //check value is in bounds
            if (value >= this._minValue && value <= this._maxValue) {
                //check if value can be reached
                if ((value - this._minValue) % this._increment == 0) {
                    this._value = value;
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
        const length = this._outs.length;
        const baseValue = (this._value - this._minValue) / this._increment;
        const binary = baseValue.toString(2);
        const padded = '0'.repeat(length) + binary;
        return (padded.slice(-length));
    }
}

class Board{
    constructor(data = {}) {
        //parse data from config
        Object.assign(this, data);

        //create outClasses
        let outClass = [];
        let output_group;
        for (output_group of data.output_groups) {
            outClass.push(new OutputGroup(
                output_group.name,
                output_group.outs,
                output_group.minValue,
                output_group.increment
            ));
        }
        this.outputClasses = outClass;
    }
}

module.exports = {
    OutputGroup: OutputGroup,
    Board: Board
};