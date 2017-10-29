'use strict';

const server = require('../server'),
    environment = process.env.NODE_ENV || 'no-environment',
    version = require('../../package.json').version,
    InputGroup = require('../models/quidoInputGroup'),
    OutputGroup = require('../models/quidoOutputGroup'),
    Board = require('../models/quidoBoard'),
    errorController = require('./errorController');

//Index page
exports.main = function (req, res) {
    res.send(`Welcome to jirrick's quidoServer v${version} @ ${environment}`);
};

//list names of all config items
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

//list all board configurations
exports.jsonGetBoards = async function (req, res, next) {
    try {
        const result = await Board.find({})
            .lean().select('-__v');
        res.send(result);
    } catch (err) {
        errorController.handle(next, err);
    }
};

//add new board configurations (id must be specified)
exports.jsonPostBoard = async function (req, res, next) {
    try {
        //load data from request, content type must be JSON
        const request = req.body;

        //validate
        if (!request._id) {
            res.status(400).send('Board name (property "_id") not specified.');
            return;
        }

        //save to db
        const board = new Board();
        Object.assign(board, request);
        board.save()
            .then(function (data) {
                server.logger.verbose(`Received configuration for "${data._id}" board`);
                server.logger.debug(data.toString());
                res.status(200).send('Board data added succefully.');
            })
            .catch(function (err) {
                server.logger.warn(err);
                res.status(400).send('Failed to add board config. Content-Type must be set to JSON.');
            });
    } catch (err) {
        errorController.handle(next, err);
    }
};

//return particular board configuration
exports.jsonGetBoard = async function (req, res, next) {
    try {
        const id = req.params.id;
        const result = await Board.findById(id)
            .lean().select('-__v');
        res.send(result);
    } catch (err) {
        errorController.handle(next, err);
    }
};

//updateparticular board configuration
exports.jsonPutBoard = async function (req, res, next) {
    try {
        //find board
        const id = req.params.id;
        const board = await Board.findById(id);

        //load data from request (content type must be JSON) and update 
        const request = req.body;
        Object.assign(board, request);

        //validate
        if (request._id !== id) {
            res.status(400).send('Object ID changed, update canceled.');
            return;
        }

        //save board
        board.save()
            .then(function (data) {
                server.logger.verbose(`Updated configuration for "${data._id}" board`);
                server.logger.debug(data.toString());
                res.status(200).send('Board data updated succefully.');
            })
            .catch(function (err) {
                server.logger.warn(err);
                res.status(400).send('Failed to update board config. Content-Type must be set to JSON.');
            });
    } catch (err) {
        errorController.handle(next, err);
    }
};

//return particular board configuration
exports.jsonDeleteBoard = async function (req, res, next) {
    try {
        const id = req.params.id;
        Board.findByIdAndRemove(id)
            .then(function (data) {
                server.logger.verbose(`Removed configuration for "${data._id}" board`);
                server.logger.debug(data.toString());
                res.status(200).send('Board data deleted succefully.');
            })
            .catch(function (err) {
                server.logger.warn(err);
                res.status(400).send('Failed to delete board config.');
            });
    } catch (err) {
        errorController.handle(next, err);
    }
};