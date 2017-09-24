// customize values and save as 'config.js'
const config = {
    //board config
    boards: [
        {
            name: 'name',
            mac: 'mac',
            inputs: 8,
            input_groups: [
                {
                    name: 'testIn1',
                    ins: [7, 8], //ANALOG - first base, second value
                    multiplier: 5
                },
                {
                    name: 'testInA',
                    ins: [1], //BIT
                    multiplier: 1
                }
            ],
            outputs: 8,
            output_groups: [
                {
                    name: 'testOut',
                    outs: [1, 2, 3],
                    minValue: 15,
                    increment: 2
                }
            ]
        }
    ],

    //mongoDB connection string
    mongoDB: 'mongodb://...'
};
module.exports = config;