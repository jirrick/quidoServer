// customize values and save as 'config.js'
const config = {
    //board config
    boards: [
        {
            name: 'name',
            mac: 'mac',
            inputs: [],
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