'use strict';

const environment = process.env.NODE_ENV || 'no-environment',
    version = require('../../package.json').version,
    InputGroup = require('../models/quidoInputGroup'),
    OutputGroup = require('../models/quidoOutputGroup'),
    Board = require('../models/quidoBoard'),
    errorController = require('./errorController');

//Index page
exports.main = function (req, res) {
    res.send(`Welcome to jirrick's quidoServer v${version} @ ${environment}`);
};

exports.jsonConfigItems = async function (req, res, next) {
    try {
        let result = new Object();
        result.boards = await Board.find({}).lean().distinct('_id');
        result.inputGroups = await InputGroup.find({}).lean().distinct('_id');
        result.outputGroups = await OutputGroup.find({}).lean().distinct('_id');

        res.send(result);
    } catch (err) {
        errorController.handle(next, err);
    }

};
