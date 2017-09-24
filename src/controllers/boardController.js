'use strict';

const server = require('../server'),
    mongoose = require('mongoose'),
    Logs = mongoose.model('Logs');

//Parse board request
exports.parse = function (req, res) {
    //verify board
    const req_name = req.query.name;
    const req_mac = req.query.mac;
    const boardInfo = server.boards.find(board => board.name === req_name && board.mac === req_mac);

    if (boardInfo != null) {
        //parse counters into array
        const inputCounters = [];
        for (let i = 1; i <= boardInfo.inputs; i++) {
            const key = `cnt${i}`;
            const value = parseInt(req.query[key]);
            inputCounters.push(value);
        }
        const ins = req.query.ins;

        const parsedInput = boardInfo.parseInput(ins, inputCounters);
        console.log(parsedInput);

        //TODO - send actual response
        const reply = '<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="xxxxxxxx"/></root>';
        res.set('Content-Type', 'text/xml');
        res.send(reply);
    }
    else
        res.status(400).send('Unknown board!');
};

/* function output(boardInfo, req, res) {
    //Send reply from board class
    const outs = boardInfo.getOutput();

    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="ISO-8859-1"?><root><set outs="' + outs + '"/></root>');
} */