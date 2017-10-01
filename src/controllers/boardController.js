'use strict';

const server = require('../server'),
    winston = require('winston'),
    QuidoData = require('../models/quidoModel').QuidoData,
    QuidoCurrent = require('../models/quidoModel').QuidoCurrent,
    logLevel = process.env.CONSOLE_LEVEL || 'debug',
    tsFormat = () => (new Date()).toLocaleTimeString(),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                timestamp: tsFormat,
                level: logLevel
            })
        ]
    });

//Parse board request
exports.parse = function (req, res) {
    //verify board
    const req_name = req.query.name;
    const req_mac = req.query.mac;
    const boardInfo = server.boards.find(board => board.name === req_name && board.mac === req_mac);

    if (boardInfo != null) {
        logger.debug(req.originalUrl);

        //parse counters into array
        const inputCounters = [];
        for (let i = 1; i <= boardInfo.inputs; i++) {
            const key = `cnt${i}`;
            const value = parseInt(req.query[key]);
            inputCounters.push(value);
        }
        const ins = req.query.ins,
            outs = req.query.outs;

        //add temp to parsed inputs
        const parsedInputs = boardInfo.parseInput(ins, inputCounters);
        const temp = new Object();
        temp.name = 'temp';
        temp.value = req.query.tempV;
        parsedInputs.push(temp);

        //Create new QuidoData item and save to mongo
        const newItem = new QuidoData({
            name: req.query.name,
            inputs: parsedInputs
        });
        newItem.save(function (err, data) {
            if (err)
                logger.warn(err);
            logger.verbose(`Received ${data.inputs.length} inputs from ${data.name} board`);
            logger.debug(data.toString());
        });

        //Update current status of board
        QuidoCurrent.findByIdAndUpdate(boardInfo.name, {
            inputs: ins,
            outputs: outs,
            raw_counters: inputCounters,
            values: [] //TODO
        }, { new: true, upsert: true }, function (err, data) {
            if (err)
                logger.warn(err);
            logger.debug(data.toString());
        });

        //send response
        const reply = boardInfo.getResponse();
        logger.debug(reply);
        res.set('Content-Type', 'text/xml');
        res.send(reply);
    }
    else
        res.status(400).send('Unknown board!');
};
