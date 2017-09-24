'use strict';

const server = require('../server'),
    levyController = require('./levyController'),
    pravyController = require('./pravyController');

//Parse board request
exports.parse = function (req, res) {
    //verify board
    const req_name = req.query.name;
    const req_mac = req.query.mac;
    const boardInfo = server.boards.find(board => board.name === req_name && board.mac === req_mac);

    if (boardInfo != null) {
        //do different stuff for different board
        if (req_name === 'LEVY')
            levyController.process(boardInfo, req, res);
        else if (req_name === 'PRAVY')
            pravyController.process(boardInfo, req, res);
    }
    else
        res.status(400).send('Unknown board!');
};

exports.setValue = function (req, res) {
    const name = req.params.name;
    const value = parseInt(req.params.value);
    let result = 'group not found';

    //check negative value
    if (value < 0){
        res.send('value must be positive');
        return;
    }

    //loop all boards
    let board = null;
    for (board of server.boards) {
        // try set value
        const response = board.setOutput(name, value);
        // break loop when response is other than 'group not found' - either 'succes' or 'not initialized'...
        //TODO do this better
        if (response !== result){
            result = response;
            break;
        }
    }
    res.send(result);
};

exports.getValue = function (req, res) {
    const name = req.params.name;
    let result = 0;

    //loop all boards
    let board = null;
    for (board of server.boards) {
        // try get value
        const response = board.getValue(name);

        if (response >= 0){
            result = response;
            break;
        }
    }
    res.send(result.toString());
};