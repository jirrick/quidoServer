'use strict';

const config = require('../config'),
    levyController = require('./levyController'),
    pravyController = require('./pravyController');

//Parse board request
exports.parse = function (req, res) {
    //verify board
    const req_name = req.query.name;
    const req_mac = req.query.mac;
    const boardInfo = config.boards.find(board => board.name === req_name && board.mac === req_mac);

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