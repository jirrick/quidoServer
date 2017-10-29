'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    server = require('../server');

const DataLog = new Schema({
    name: String,
    inputs: [{
        _id: false,
        name: String,
        value: Number
    }]
}, {
    versionKey: false
});

DataLog.statics.logInputs = function(boardName, parsedInputs){
    const newLog = new this({
        name: boardName,
        inputs: parsedInputs
    });
    newLog.save()
        .then(function(data) {
            server.logger.verbose(`Received ${data.inputs.length} inputs from ${data.name} board`);
            server.logger.debug(data.toString());
        })
        .catch(function(err){
            server.logger.warn(err);
        });
};

module.exports = mongoose.model('DataLog', DataLog);