// customize values and save as 'config.js'
const config = {
    //board config
    boards: [
        {
            name: 'name',
            mac: 'mac',
            inputs: 8,
            outputs: 8
        }
    ],

    //mongoDB connection string
    mongoDB: 'mongodb://...'
};
module.exports = config;