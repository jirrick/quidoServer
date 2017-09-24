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
        //console.log(req.originalUrl);

        //parse counters into array
        const inputCounters = [];
        for (let i = 1; i <= boardInfo.inputs; i++) {
            const key = `cnt${i}`;
            const value = parseInt(req.query[key]);
            inputCounters.push(value);
        }
        const ins = req.query.ins;

        //gater other data
        const data = new Object();
        data.name = req.query.name;
        data.temp = req.query.tempV;
        data.timestamp = Date.now();
        data.inputs = boardInfo.parseInput(ins, inputCounters);
    
        //Create Log item and save to mongo
        const newLog = new Logs(data);
        newLog.save(function (err, data) {
            if (err)
                console.error(err);
            console.log(data);
        });

        //send response
        const reply = boardInfo.getResponse();
        //console.log(reply);
        res.set('Content-Type', 'text/xml');
        res.send(reply);
    }
    else
        res.status(400).send('Unknown board!');
};
